import { Head, Link, useForm } from "@inertiajs/react";
// Components
import ApplicationLogo from "@/Components/ApplicationLogo";
import { InputError, InputLabel, TextInput } from "@/Components/Forms";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import { FlashMessage } from "@/Components/Notifications";

export default function Register() {

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="管理者新規登録" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-md w-full space-y-8">
                {/* ロゴとヘッダー */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <ApplicationLogo className="h-16 w-auto fill-current text-gray-800" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        管理者アカウント作成
                    </h2>

                    {/* 新規登録不可の警告 */}
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="text-left">
                                <h3 className="text-sm font-semibold text-red-800">
                                    新規登録は許可されていません
                                </h3>
                                <p className="mt-2 text-sm text-red-700">
                                    システムオーナーアカウントは、セキュリティ上の理由により一般的な登録プロセスを経由できません。
                                </p>
                                <p className="mt-1 text-sm text-red-700">
                                    アカウントが必要な場合は、既存の管理者にお問い合わせください。
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-full opacity-50">
                        <svg
                            className="w-4 h-4 text-gray-500 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-gray-600 font-medium text-sm">
                            登録機能は無効化されています
                        </span>
                    </div>
                </div>

                {/* フォーム（無効化） */}

                {/* 戻るボタン */}
                <div className="mt-6 text-center">
                    {/* ホームへ */}
                    <Link
                        href="/"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                        戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}
