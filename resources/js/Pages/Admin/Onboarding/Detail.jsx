import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Detail({ user, company, quote }) {
    const [showRejectForm, setShowRejectForm] = useState(false);
    const {
        data: formData,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        reason: "",
    });

    const handleApprove = () => {
        post(route("admin.onboarding.approve", user.id), {
            onSuccess: () => {
                // Success message will be shown by the server
            },
        });
    };

    const handleReject = (e) => {
        e.preventDefault();
        post(route("admin.onboarding.reject", user.id));
    };

    return (
        <>
            <Head title={`オンボーディング確認 - ${user.email}`} />
            <AdminLayout>
                <div className="space-y-6">
                    {/* ヘッダー */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                オンボーディング確認
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                ユーザー登録情報の確認と承認
                            </p>
                        </div>
                        <Link
                            href={route("admin.onboarding.index")}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
                        >
                            戻る
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* メイン情報 */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* ユーザー情報 */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                    ユーザー情報
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            メールアドレス
                                        </p>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            名前
                                        </p>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                            {user.first_name} {user.last_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            登録日時
                                        </p>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                            {new Date(
                                                user.created_at,
                                            ).toLocaleString("ja-JP")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 会社情報 */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                    会社情報
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            会社名
                                        </p>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                            {company.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            電話番号
                                        </p>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                            {company.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            事業形態
                                        </p>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                            {company.type === "corporate"
                                                ? "法人"
                                                : "個人事業主"}
                                        </p>
                                    </div>
                                    {company.legal_name && (
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                法人名（登記）
                                            </p>
                                            <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                                {company.legal_name}
                                            </p>
                                        </div>
                                    )}
                                    {company.representative_name && (
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                代表者名
                                            </p>
                                            <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                                {company.representative_name}
                                            </p>
                                        </div>
                                    )}
                                    {company.representative_email && (
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                代表者メール
                                            </p>
                                            <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                                {company.representative_email}
                                            </p>
                                        </div>
                                    )}
                                    {company.representative_phone && (
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                代表者電話番号
                                            </p>
                                            <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                                {company.representative_phone}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 見積情報 */}
                            {quote && (
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                        関連する見積
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                見積番号
                                            </p>
                                            <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                                {quote.quote_number}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                件名
                                            </p>
                                            <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                                {quote.title}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                金額
                                            </p>
                                            <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                                ¥
                                                {quote.total_amount.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                有効期限
                                            </p>
                                            <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                                {quote.valid_until
                                                    ? new Date(
                                                          quote.valid_until,
                                                      ).toLocaleDateString(
                                                          "ja-JP",
                                                      )
                                                    : "未設定"}
                                            </p>
                                        </div>
                                    </div>
                                    {quote.description && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                説明
                                            </p>
                                            <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                                {quote.description}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* サイドバー - アクション */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6 space-y-4">
                                {/* 承認ボタン */}
                                <button
                                    onClick={handleApprove}
                                    disabled={processing}
                                    className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                                >
                                    {processing ? "処理中..." : "承認する"}
                                </button>

                                {/* 却下ボタン */}
                                <button
                                    onClick={() =>
                                        setShowRejectForm(!showRejectForm)
                                    }
                                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    {showRejectForm ? "キャンセル" : "却下する"}
                                </button>

                                {/* 却下フォーム */}
                                {showRejectForm && (
                                    <form
                                        onSubmit={handleReject}
                                        className="space-y-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                却下理由{" "}
                                                <span className="text-red-600">
                                                    *
                                                </span>
                                            </label>
                                            <textarea
                                                value={formData.reason}
                                                onChange={(e) =>
                                                    setData(
                                                        "reason",
                                                        e.target.value,
                                                    )
                                                }
                                                rows={4}
                                                className="w-full px-3 py-2 border border-red-300 dark:border-red-700 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                                placeholder="却下理由を入力してください"
                                            />
                                            {errors.reason && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {errors.reason}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded transition-colors"
                                        >
                                            {processing
                                                ? "処理中..."
                                                : "却下を確定"}
                                        </button>
                                    </form>
                                )}

                                {/* 情報パネル */}
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        次のステップ
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                        <li>✓ 契約書の自動作成</li>
                                        <li>✓ 請求書の自動作成（50% 頭金）</li>
                                        <li>✓ 通知メールの送信</li>
                                        <li>
                                            ✓ ユーザーステータス: pending →
                                            active
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
