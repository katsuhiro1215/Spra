import React, { useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FlashMessage } from "@/Components/Notifications";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function Detail({ quoteResponse, responseTypes }) {
    const { post, processing } = useForm();
    const [showInvitationConfirm, setShowInvitationConfirm] = useState(false);

    const handleSendInvitation = () => {
        setShowInvitationConfirm(true);
    };

    const confirmSendInvitation = () => {
        post(route("admin.quote-response.send-invitation", quoteResponse.id));
        setShowInvitationConfirm(false);
    };

    const getStatusBadge = (response) => {
        if (!response.responded_at) {
            return <Badge variant="yellow">未返信</Badge>;
        }
        return <Badge variant="green">返信済み</Badge>;
    };

    const getResponseTypeLabel = (responseType) => {
        return responseTypes[responseType] || responseType;
    };

    const pageConfig = {
        title: "見積返信詳細",
        description: "クライアントからの見積返信内容を確認します",
        breadcrumbs: [
            { label: "ダッシュボード", href: route("admin.dashboard") },
            {
                label: "見積返信管理",
                href: route("admin.quote-response.index"),
            },
            {
                label: "詳細",
                href: route("admin.quote-response.show", quoteResponse.id),
            },
        ],
    };

    return (
        <AdminAuthenticatedLayout header={<PageHeader {...pageConfig} />}>
            <Head title="見積返信詳細" />

            <FlashMessage />

            <div className="space-y-4">
                {/* 戻るボタン */}
                <div>
                    <Link href={route("admin.quote-response.index")}>
                        <SecondaryButton>
                            <ChevronLeftIcon className="w-4 h-4" />
                            一覧に戻る
                        </SecondaryButton>
                    </Link>
                </div>

                {/* 基本情報 */}
                <Card>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                返信内容
                            </h2>
                            {getStatusBadge(quoteResponse)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    メールアドレス
                                </label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {quoteResponse.email}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    見積番号
                                </label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {quoteResponse.quote?.quote_number || "-"}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    返信タイプ
                                </label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {getResponseTypeLabel(
                                        quoteResponse.response_type,
                                    )}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    返信日時
                                </label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {quoteResponse.responded_at
                                        ? new Date(
                                              quoteResponse.responded_at,
                                          ).toLocaleString("ja-JP")
                                        : "未返信"}
                                </p>
                            </div>
                        </div>

                        {quoteResponse.response_text && (
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    返信内容
                                </label>
                                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                    {quoteResponse.response_text}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* 見積情報 */}
                {quoteResponse.quote && (
                    <Card>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                見積書情報
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        見積番号
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {quoteResponse.quote.quote_number}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        ステータス
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        <Badge
                                            variant={
                                                quoteResponse.quote.status ===
                                                "approved"
                                                    ? "green"
                                                    : "yellow"
                                            }
                                        >
                                            {quoteResponse.quote.status}
                                        </Badge>
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        合計金額
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        ¥
                                        {quoteResponse.quote.total_amount?.toLocaleString() ||
                                            "0"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* ユーザー・会社情報 */}
                <Card>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            ユーザー・会社情報
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    ユーザーメール
                                </label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {quoteResponse.user?.email ||
                                        quoteResponse.email}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    会社名
                                </label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {quoteResponse.company?.name ? (
                                        <span>
                                            {quoteResponse.company.name}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 dark:text-gray-400">
                                            未登録
                                        </span>
                                    )}
                                </p>
                            </div>

                            {quoteResponse.user?.profile && (
                                <>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            姓名
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {
                                                quoteResponse.user.profile
                                                    .last_name
                                            }{" "}
                                            {
                                                quoteResponse.user.profile
                                                    .first_name
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            電話番号
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {quoteResponse.user.profile.phone ||
                                                quoteResponse.user.profile
                                                    .mobile ||
                                                "-"}
                                        </p>
                                    </div>
                                </>
                            )}

                            {quoteResponse.company?.addresses &&
                                quoteResponse.company.addresses.length > 0 && (
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            住所
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {quoteResponse.company.addresses[0]
                                                .postal_code && (
                                                <>
                                                    {
                                                        quoteResponse.company
                                                            .addresses[0]
                                                            .postal_code
                                                    }{" "}
                                                </>
                                            )}
                                            {
                                                quoteResponse.company
                                                    .addresses[0].prefecture
                                            }
                                            {
                                                quoteResponse.company
                                                    .addresses[0].city
                                            }
                                            {
                                                quoteResponse.company
                                                    .addresses[0].street
                                            }
                                        </p>
                                    </div>
                                )}
                        </div>
                    </div>
                </Card>

                {/* アクション */}
                {quoteResponse.response_type === "request" &&
                    !quoteResponse.user_id && (
                        <Card>
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    次のステップ
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    クライアントが見積を了承しました。招待メールを送信して、アカウント作成と会社情報入力を促します。
                                </p>
                                <PrimaryButton
                                    onClick={handleSendInvitation}
                                    disabled={processing}
                                >
                                    招待メールを送信
                                </PrimaryButton>
                            </div>
                        </Card>
                    )}

                {quoteResponse.user_id && (
                    <Card>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                ユーザーオンボーディング完了
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                クライアントがアカウント作成と会社情報入力を完了しました。
                                契約書作成に進むことができます。
                            </p>
                            <div className="flex gap-2">
                                <Link
                                    href={route("admin.contract.create", {
                                        quote_response_id: quoteResponse.id,
                                    })}
                                >
                                    <PrimaryButton>
                                        契約書を作成する
                                    </PrimaryButton>
                                </Link>
                                <Link
                                    href={route(
                                        "admin.onboarding.detail",
                                        quoteResponse.user_id,
                                    )}
                                >
                                    <SecondaryButton>
                                        詳細を確認
                                    </SecondaryButton>
                                </Link>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {/* 招待メール送信確認ダイアログ */}
            {showInvitationConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-sm mx-4">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                確認
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                招待メールを送信してもよろしいですか？
                            </p>
                            <div className="flex justify-end gap-2">
                                <SecondaryButton
                                    onClick={() =>
                                        setShowInvitationConfirm(false)
                                    }
                                    disabled={processing}
                                >
                                    キャンセル
                                </SecondaryButton>
                                <PrimaryButton
                                    onClick={confirmSendInvitation}
                                    disabled={processing}
                                >
                                    送信
                                </PrimaryButton>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </AdminAuthenticatedLayout>
    );
}
