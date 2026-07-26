import { useForm } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import {
    FormGroup,
    TextInput,
    InputLabel,
    InputError,
} from "@/Components/Forms";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";

export default function UpdateEmailForm({ email }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("admin.profile.update"));
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
                メールアドレス
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                ログインに使用するメールアドレスを変更します。
            </p>

            <form onSubmit={submit} className="space-y-4">
                <FormGroup>
                    <InputLabel htmlFor="email">メールアドレス</InputLabel>
                    <TextInput
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        autoComplete="username"
                        isFocused
                        required
                    />
                    <InputError message={errors.email} />
                </FormGroup>

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
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            保存しました。
                        </p>
                    </Transition>
                </div>
            </form>
        </div>
    );
}
