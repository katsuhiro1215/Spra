import { Head, useForm } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Card, CardBody } from "@/Components/Card";
import { TextInput, FormGroup } from "@/Components/Forms";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import { FlashMessage } from "@/Components/Notifications";

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-black py-12 px-4 sm:px-6 lg:px-8">
            <Head title="新しいパスワード設定" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-md w-full space-y-8">
                {/* ロゴとヘッダー */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <ApplicationLogo className="h-16 w-auto fill-current text-gray-800 dark:text-gray-200" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
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
                <Card>
                    <CardBody className="px-8 py-8 space-y-6">
                        <form onSubmit={submit} className="space-y-6">
                            <FormGroup
                                label="メールアドレス"
                                htmlFor="email"
                                error={errors.email}
                            >
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                                    autoComplete="username"
                                    readOnly
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                            </FormGroup>

                            <FormGroup
                                label="新しいパスワード"
                                htmlFor="password"
                                error={errors.password}
                            >
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
                            </FormGroup>

                            <FormGroup
                                label="パスワード確認"
                                htmlFor="password_confirmation"
                                error={errors.password_confirmation}
                            >
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
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </FormGroup>

                            <div className="flex items-center justify-center gap-4">
                                <PrimaryButton
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 focus:ring-green-500 px-6 py-3 rounded-lg font-medium transition duration-200 ease-in-out transform hover:scale-105"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "更新中..."
                                        : "パスワードを更新"}
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
