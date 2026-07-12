import DangerButton from "@/Components/Buttons/DangerButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import Modal from "@/Components/Layout/Modal";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import TextInput from "@/Components/Forms/TextInput";
import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";

export default function DeleteUserForm({ routePrefix, className = "" }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route(`${routePrefix}.profile.destroy`), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    アカウントを削除
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    アカウントを削除すると、関連するすべてのデータが完全に削除されます。削除前に、保持したいデータがあればダウンロードしてください。
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                アカウントを削除
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        本当にアカウントを削除しますか？
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        アカウントを削除すると、関連するすべてのデータが完全に削除されます。削除を確定するには、パスワードを入力してください。
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="パスワード"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="パスワード"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            キャンセル
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            アカウントを削除
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
