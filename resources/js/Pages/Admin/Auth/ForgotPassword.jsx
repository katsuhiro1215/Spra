import { Head, useForm } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Card, CardBody } from "@/Components/Card";
import { TextInput, FormGroup } from "@/Components/Forms";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import { FlashMessage } from "@/Components/Notifications";

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-black py-12 px-4 sm:px-6 lg:px-8">
            <Head title="パスワードリセット" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-md w-full space-y-8">
                {/* ロゴとヘッダー */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <ApplicationLogo className="h-16 w-auto fill-current text-gray-800 dark:text-gray-200" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
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
                <Card>
                    <CardBody className="px-8 py-8 space-y-6">
                        <div className="text-center">
                            <p className="text-gray-600 text-sm dark:text-gray-400">
                                メールアドレスを入力してください。
                                <br />
                                パスワードリセット用のリンクをお送りします。
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <FormGroup
                                label="メールアドレス"
                                htmlFor="email"
                                help="パスワードリセット用のリンクを送信するメールアドレスを入力してください"
                                error={errors.email}
                            >
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
                            </FormGroup>

                            <div className="flex flex-col items-center justify-center gap-4">
                                <PrimaryButton
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 px-6 py-3 rounded-lg font-medium transition duration-200 ease-in-out transform hover:scale-105"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "送信中..."
                                        : "リセットリンクを送信"}
                                </PrimaryButton>
                                <a
                                    href={route("admin.login")}
                                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                >
                                    ← ログイン画面に戻る
                                </a>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
