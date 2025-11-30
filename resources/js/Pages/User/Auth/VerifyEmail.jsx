import { Head, Link, useForm } from "@inertiajs/react";
import { EnvelopeIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import UserAuthLayout from "@/Layouts/UserAuthLayout";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route("user.verification.send"));
    };

    return (
        <UserAuthLayout>
            <Head title="メール認証 | Smart Sprouts" />

            {/* Header Section */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-4">
                    <EnvelopeIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    メールアドレスの認証
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                    ご登録ありがとうございます！
                    <br />
                    サービスのご利用を開始する前に、メールアドレスの認証をお願いします。
                </p>
            </div>

            {/* Instruction */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg
                            className="w-5 h-5 text-blue-600 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3 text-sm text-blue-700">
                        <p className="mb-2 font-medium">認証手順:</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                            <li>
                                ご登録のメールアドレスに認証メールをお送りしました
                            </li>
                            <li>メール内の認証リンクをクリックしてください</li>
                            <li>認証完了後、サービスをご利用いただけます</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* Status Message */}
            {status === "verification-link-sent" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
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
                        <p className="text-sm text-green-700">
                            新しい認証メールを送信しました。メールボックスをご確認ください。
                        </p>
                    </div>
                </div>
            )}

            {/* Actions */}
            <form onSubmit={submit} className="space-y-6">
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                        メールが届かない場合は、迷惑メールフォルダもご確認ください。
                    </p>

                    <button
                        type="submit"
                        disabled={processing}
                        className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                            processing
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 active:transform active:scale-[0.98]"
                        } text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2`}
                    >
                        {processing ? (
                            <>
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
                                送信中...
                            </>
                        ) : (
                            <>
                                <ArrowPathIcon className="w-5 h-5 mr-2" />
                                認証メールを再送信
                            </>
                        )}
                    </button>
                </div>

                {/* Logout Link */}
                <div className="text-center pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">
                        別のアカウントでログインしますか？
                    </p>
                    <Link
                        href={route("user.logout")}
                        method="post"
                        as="button"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-cyan-600 font-medium transition-colors duration-200"
                    >
                        <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        ログアウト
                    </Link>
                </div>
            </form>
        </UserAuthLayout>
    );
}
