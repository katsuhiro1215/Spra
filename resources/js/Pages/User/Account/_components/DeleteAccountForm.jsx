import { useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import DangerButton from "@/Components/Buttons/DangerButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import Modal from "@/Components/Layout/Modal";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import TextInput from "@/Components/Forms/TextInput";

export default function DeleteAccountForm() {
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
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

    const confirmDeletion = () => setConfirmingDeletion(true);

    const closeModal = () => {
        setConfirmingDeletion(false);
        clearErrors();
        reset();
    };

    const submit = (e) => {
        e.preventDefault();

        destroy(route("user.profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    アカウントを削除
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    アカウントを削除すると、関連するすべてのデータが完全に削除されます。削除前に、保持したいデータがあればダウンロードしてください。
                </p>
            </header>

            <DangerButton className="mt-6" onClick={confirmDeletion}>
                アカウントを削除
            </DangerButton>

            <Modal show={confirmingDeletion} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
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
                            ref={passwordInput}
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="パスワード"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton type="button" onClick={closeModal}>
                            キャンセル
                        </SecondaryButton>

                        <DangerButton
                            type="submit"
                            className="ms-3"
                            disabled={processing}
                        >
                            アカウントを削除
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
