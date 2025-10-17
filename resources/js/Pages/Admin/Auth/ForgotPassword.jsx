import { Head, useForm } from "@inertiajs/react";
// Layouts
import ApplicationLogo from "@/Components/ApplicationLogo";
// Components
import { TextInput, InputError } from "@/Components/Forms";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import FlashMessage from "@/Components/Notifications/FlashMessage";

export default function ForgotPassword({ status }) {
    // フォーム状態管理
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });
    // フォーム送信ハンドラー
    const submit = (e) => {
        e.preventDefault();

        post(route("admin.password.email"));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="パスワードリセット" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-md w-full space-y-8">
                {/* ロゴとヘッダー */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <ApplicationLogo className="h-16 w-auto fill-current text-gray-800" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        パスワードリセット
                    </h2>
                    <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                        <svg
                            className="w-4 h-4 text-blue-600 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 8A6 6 0 006 8v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V8zm-8 0a4 4 0 118 0v2H8V8z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-blue-700 font-medium text-sm">
                            パスワードをお忘れの方
                        </span>
                    </div>
                </div>

                {/* フォーム */}
                <div className="bg-white shadow-2xl rounded-2xl px-8 py-8 space-y-6">
                    <div className="text-center">
                        <p className="text-gray-600 text-sm">
                            メールアドレスを入力してください。
                            <br />
                            パスワードリセット用のリンクをお送りします。
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                メールアドレス
                            </label>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="your@email.com"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <a
                                href={route("admin.login")}
                                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                            >
                                ← ログイン画面に戻る
                            </a>
                            <PrimaryButton
                                className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 px-6 py-3 rounded-lg font-medium transition duration-200 ease-in-out transform hover:scale-105"
                                disabled={processing}
                            >
                                {processing
                                    ? "送信中..."
                                    : "リセットリンクを送信"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
