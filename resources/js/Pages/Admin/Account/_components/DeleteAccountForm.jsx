import { useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Layout/Modal";
import { FormGroup, TextInput, InputError } from "@/Components/Forms";
import DangerButton from "@/Components/Buttons/DangerButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";

export default function DeleteAccountForm() {
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } =
        useForm({
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

        destroy(route("admin.profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
                アカウントを削除
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                アカウントを削除すると、関連するすべてのデータが完全に削除されます。削除前に、保持したいデータがあればダウンロードしてください。
            </p>

            <DangerButton onClick={confirmDeletion}>
                アカウントを削除
            </DangerButton>

            <Modal show={confirmingDeletion} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-slate-900">
                        本当にアカウントを削除しますか？
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                        アカウントを削除すると、関連するすべてのデータが完全に削除されます。削除を確定するには、パスワードを入力してください。
                    </p>

                    <div className="mt-6">
                        <FormGroup>
                            <TextInput
                                id="password"
                                ref={passwordInput}
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                isFocused
                                placeholder="パスワード"
                            />
                            <InputError message={errors.password} />
                        </FormGroup>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton type="button" onClick={closeModal}>
                            キャンセル
                        </SecondaryButton>

                        <DangerButton type="submit" disabled={processing}>
                            アカウントを削除
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
