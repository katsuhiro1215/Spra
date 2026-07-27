import { useForm } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import TextInput from "@/Components/Forms/TextInput";
import InputLabel from "@/Components/Forms/InputLabel";
import InputError from "@/Components/Forms/InputError";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";

export default function UpdateEmailForm({ email }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("user.profile.update"));
    };

    return (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    メールアドレス
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    ログインに使用するメールアドレスを変更します。
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="メールアドレス" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        isFocused
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton type="submit" disabled={processing}>
                        保存
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">保存しました。</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
