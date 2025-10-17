import { Head, useForm } from "@inertiajs/react";
// Layouts
import ApplicationLogo from "@/Components/ApplicationLogo";
// Components
import { InputLabel, TextInput, InputError } from "@/Components/Forms";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import FlashMessage from "@/Components/Notifications/FlashMessage";

export default function ResetPassword({ token, email }) {
    // フォーム状態管理
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });
    // フォーム送信ハンドラー
    const submit = (e) => {
        e.preventDefault();

        post(route("admin.password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="新しいパスワード設定" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-md w-full space-y-8">
                {/* ロゴとヘッダー */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <ApplicationLogo className="h-16 w-auto fill-current text-gray-800" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        新しいパスワード設定
                    </h2>
                    <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                        <svg
                            className="w-4 h-4 text-green-600 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-green-700 font-medium text-sm">
                            パスワード再設定
                        </span>
                    </div>
                </div>

                {/* フォーム */}
                <div className="bg-white shadow-2xl rounded-2xl px-8 py-8 space-y-6">
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                                autoComplete="username"
                                readOnly
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                新しいパスワード
                            </label>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="8文字以上で入力してください"
                                autoComplete="new-password"
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

                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                パスワード確認
                            </label>
                            <TextInput
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="もう一度同じパスワードを入力してください"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                required
                            />
                            <InputError
                                message={errors.password_confirmation}
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
                                className="bg-green-600 hover:bg-green-700 focus:ring-green-500 px-6 py-3 rounded-lg font-medium transition duration-200 ease-in-out transform hover:scale-105"
                                disabled={processing}
                            >
                                {processing ? "更新中..." : "パスワードを更新"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
