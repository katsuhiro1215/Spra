import { Head, Link, useForm } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Card, CardBody } from "@/Components/Card";
import {
    FormGroup,
    Checkbox,
    InputError,
    InputLabel,
    TextInput,
} from "@/Components/Forms";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import { FlashMessage } from "@/Components/Notifications";

export default function Login({ status, canResetPassword }) {
    // フォーム状態管理
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });
    // フォーム送信ハンドラー
    // 二段階認証が有効なアカウントの場合、サーバー側で
    // /admin/two-factor-challenge にリダイレクトされる
    const submit = (e) => {
        e.preventDefault();

        post(route("admin.login"), {
            onFinish: () => reset("password"),
        });
    };
    // Googleログインハンドラー（後で実装）
    const handleGoogleLogin = () => {
        // Googleログインの処理（後で実装）
        console.log("Googleログインを開始");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-black py-12 px-4 sm:px-6 lg:px-8">
            <Head title="管理者ログイン" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-md w-full space-y-8">
                {/* ロゴとヘッダー */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <ApplicationLogo className="h-16 w-auto fill-current text-gray-800 dark:text-red-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                        管理者ログイン
                    </h2>
                    <div className="mt-4 inline-flex items-center px-4 py-2 bg-red-50 border border-red-200 rounded-full">
                        <svg
                            className="w-4 h-4 text-red-600 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-red-700 font-medium text-sm dark:text-red-400">
                            管理者専用エリア
                        </span>
                    </div>
                </div>

                {/* フォーム */}
                <Card>
                    <CardBody className="px-8 py-8 space-y-6">
                        {status && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-900 dark:border-green-700">
                                <div className="flex">
                                    <svg
                                        className="w-5 h-5 text-green-600 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="text-sm font-medium text-green-800">
                                        {status}
                                    </p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                                {/* Google認証ボタン */}
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    <svg
                                        className="w-5 h-5 mr-3"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Googleアカウントでログイン
                                </button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                            または
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <FormGroup
                                        label="メールアドレス"
                                        htmlFor="email"
                                        help="管理者用のメールアドレスを入力してください"
                                    >
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="px-4 py-3 border focus:ring-2 transition-colors"
                                            autoComplete="username"
                                            isFocused={true}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="admin@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </FormGroup>

                                    <FormGroup
                                        label="パスワード"
                                        htmlFor="password"
                                        help="管理者用のパスワードを入力してください"
                                    >
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="px-4 py-3 border focus:ring-2 transition-colors"
                                            autoComplete="current-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="••••••••"
                                        />
                                        <InputError message={errors.password} />
                                    </FormGroup>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center">
                                            <Checkbox
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) =>
                                                    setData(
                                                        "remember",
                                                        e.target.checked,
                                                    )
                                                }
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                                ログイン状態を保持
                                            </span>
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href={route(
                                                    "admin.password.request",
                                                )}
                                                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                            >
                                                パスワードを忘れた場合
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <PrimaryButton
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            ログイン中...
                                        </div>
                                    ) : (
                                        "ログイン"
                                    )}
                                </PrimaryButton>
                            </form>

                        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                管理者アカウントをお持ちでない場合は{" "}
                                <Link
                                    href={route("admin.register")}
                                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                >
                                    新規登録
                                </Link>
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
