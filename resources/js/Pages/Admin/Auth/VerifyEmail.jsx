import { Head, Link, useForm } from "@inertiajs/react";
// Layouts
import ApplicationLogo from "@/Components/ApplicationLogo";
// Components
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import FlashMessage from "@/Components/Notifications/FlashMessage";

export default function VerifyEmail({ status }) {
    // フォーム状態管理
    const { post, processing } = useForm({});
    // フォーム送信ハンドラー
    const submit = (e) => {
        e.preventDefault();

        post(route("admin.verification.send"));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="メールアドレス認証" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-md w-full space-y-8">
                {/* ロゴとヘッダー */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <ApplicationLogo className="h-16 w-auto fill-current text-gray-800" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        メールアドレス認証
                    </h2>
                    <div className="mt-4 inline-flex items-center px-4 py-2 bg-purple-50 border border-purple-200 rounded-full">
                        <svg
                            className="w-4 h-4 text-purple-600 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="text-purple-700 font-medium text-sm">
                            認証が必要です
                        </span>
                    </div>
                </div>

                {/* フォーム */}
                <div className="bg-white shadow-2xl rounded-2xl px-8 py-8 space-y-6">
                    <div className="text-center space-y-4">
                        <div className="text-6xl">📧</div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                アカウント登録ありがとうございます！
                            </h3>
                            <p className="text-gray-600 text-sm">
                                続行する前に、お送りしたメールアドレス認証リンクをクリックしてください。
                                <br />
                                メールが届いていない場合は、再送信いたします。
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="flex flex-col space-y-4">
                            <PrimaryButton
                                className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 px-6 py-3 rounded-lg font-medium transition duration-200 ease-in-out transform hover:scale-105 w-full"
                                disabled={processing}
                            >
                                {processing
                                    ? "送信中..."
                                    : "認証メールを再送信"}
                            </PrimaryButton>

                            <div className="text-center">
                                <Link
                                    href={route("admin.logout")}
                                    method="post"
                                    as="button"
                                    className="text-sm text-gray-600 hover:text-gray-900 underline font-medium transition duration-200"
                                >
                                    ログアウト
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
