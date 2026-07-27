import { useRef } from "react";
import { useForm } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import {
    FormGroup,
    TextInput,
    InputLabel,
    InputError,
} from "@/Components/Forms";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        put(route("admin.password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
                パスワード変更
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                アカウントを安全に保つため、長くランダムなパスワードを使用してください。
            </p>

            <form onSubmit={submit} className="space-y-4">
                <FormGroup>
                    <InputLabel htmlFor="current_password">
                        現在のパスワード
                    </InputLabel>
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        type="password"
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} />
                </FormGroup>

                <FormGroup>
                    <InputLabel htmlFor="password">
                        新しいパスワード
                    </InputLabel>
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} />
                </FormGroup>

                <FormGroup>
                    <InputLabel htmlFor="password_confirmation">
                        新しいパスワード（確認）
                    </InputLabel>
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} />
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
