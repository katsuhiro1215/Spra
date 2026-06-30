import React from "react";
import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function OnboardingSuccess({ user, company }) {
    return (
        <>
            <Head title="登録完了" />
            <PublicLayout>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                            {/* 成功アイコン */}
                            <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-6" />

                            {/* タイトル */}
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                登録完了いたしました
                            </h1>

                            {/* メッセージ */}
                            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                                ご登録ありがとうございます。以下の情報で登録されました。
                            </p>

                            {/* 登録情報 */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6 mb-8 text-left">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    登録情報
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">
                                            ユーザー名:
                                        </span>{" "}
                                        <span className="text-gray-900 dark:text-white">
                                            {user.email}
                                        </span>
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">
                                            会社名:
                                        </span>{" "}
                                        <span className="text-gray-900 dark:text-white">
                                            {company.name}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* 次のステップ */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8 text-left">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    次のステップ
                                </h3>
                                <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                                    <li className="flex">
                                        <span className="font-bold text-blue-600 mr-3">
                                            1.
                                        </span>
                                        <span>
                                            当社の確認を待たせていただきます。確認後、登録完了のメールをお送りします。
                                        </span>
                                    </li>
                                    <li className="flex">
                                        <span className="font-bold text-blue-600 mr-3">
                                            2.
                                        </span>
                                        <span>
                                            契約書および請求書をメールにてお送りします。ご確認ください。
                                        </span>
                                    </li>
                                    <li className="flex">
                                        <span className="font-bold text-blue-600 mr-3">
                                            3.
                                        </span>
                                        <span>
                                            支払いが完了いたしましたら、お客様のアカウントから「入金完了」をお知らせください。
                                        </span>
                                    </li>
                                    <li className="flex">
                                        <span className="font-bold text-blue-600 mr-3">
                                            4.
                                        </span>
                                        <span>
                                            入金確認後、プロジェクトが開始いたします。
                                        </span>
                                    </li>
                                </ol>
                            </div>

                            {/* CTA */}
                            <div className="flex gap-4 flex-col sm:flex-row">
                                <Link
                                    href={route("public.home")}
                                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
                                >
                                    ホームページへ戻る
                                </Link>
                                <a
                                    href="mailto:support@example.com"
                                    className="flex-1 px-6 py-3 border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
                                >
                                    サポートに連絡
                                </a>
                            </div>

                            {/* 補足 */}
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
                                ご質問やご不明な点がございましたら、お気軽にお問い合わせください。
                            </p>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        </>
    );
}
