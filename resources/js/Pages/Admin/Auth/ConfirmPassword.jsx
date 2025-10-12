import { Head, useForm } from "@inertiajs/react";
// Layouts
import ApplicationLogo from "@/Components/ApplicationLogo";
// Components
import { InputError, InputLabel, TextInput } from "@/Components/Forms";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import FlashMessage from "@/Components/Notifications/FlashMessage";

export default function ConfirmPassword() {
    // フォーム状態管理
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });
    // フォーム送信ハンドラー
    const submit = (e) => {
        e.preventDefault();

        post(route("admin.password.confirm"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="パスワード確認" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-md w-full space-y-8">
                {/* ロゴとヘッダー */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <ApplicationLogo className="h-16 w-auto fill-current text-gray-800" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        パスワード確認
                    </h2>
                    <div className="mt-4 inline-flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full">
                        <svg
                            className="w-4 h-4 text-yellow-600 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-yellow-700 font-medium text-sm">
                            セキュリティ確認
                        </span>
                    </div>
                </div>

                {/* フォーム */}
                <div className="bg-white shadow-2xl rounded-2xl px-8 py-8 space-y-6">
                    <div className="text-center">
                        <p className="text-gray-600 text-sm">
                            セキュリティ保護のため、パスワードを再度確認してください。
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                現在のパスワード
                            </label>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="パスワードを入力してください"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-end">
                            <PrimaryButton
                                className="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 px-6 py-3 rounded-lg font-medium transition duration-200 ease-in-out transform hover:scale-105 w-full"
                                disabled={processing}
                            >
                                {processing ? "確認中..." : "パスワードを確認"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
