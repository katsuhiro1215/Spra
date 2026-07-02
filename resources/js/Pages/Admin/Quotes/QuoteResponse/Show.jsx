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

    const handleSendInvitation = () => {
        if (window.confirm("招待メールを送信してもよろしいですか？")) {
            post(
                route("admin.quote-response.send-invitation", quoteResponse.id),
            );
        }
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
                            <h2 className="text-lg font-semibold text-gray-900">
                                返信内容
                            </h2>
                            {getStatusBadge(quoteResponse)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    メールアドレス
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {quoteResponse.email}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    見積番号
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {quoteResponse.quote?.quote_number || "-"}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    返信タイプ
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {getResponseTypeLabel(
                                        quoteResponse.response_type,
                                    )}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    返信日時
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
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
                                <label className="text-sm font-medium text-gray-700">
                                    返信内容
                                </label>
                                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900 whitespace-pre-wrap">
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
                            <h3 className="text-lg font-semibold text-gray-900">
                                見積書情報
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        見積番号
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {quoteResponse.quote.quote_number}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        ステータス
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
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
                                    <label className="text-sm font-medium text-gray-700">
                                        合計金額
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
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
                        <h3 className="text-lg font-semibold text-gray-900">
                            ユーザー・会社情報
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    ユーザー
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {quoteResponse.user ? (
                                        <span>{quoteResponse.user.email}</span>
                                    ) : (
                                        <span className="text-gray-500">
                                            未登録
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    会社
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {quoteResponse.company ? (
                                        <span>
                                            {quoteResponse.company.name}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500">
                                            未登録
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* アクション */}
                {quoteResponse.response_type === "request" &&
                    !quoteResponse.user_id && (
                        <Card>
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    次のステップ
                                </h3>
                                <p className="text-sm text-gray-700">
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
                            <h3 className="text-lg font-semibold text-gray-900">
                                ユーザーオンボーディング完了
                            </h3>
                            <p className="text-sm text-gray-700">
                                クライアントがアカウント作成と会社情報入力を完了しました。
                                契約書作成に進むことができます。
                            </p>
                            <Link
                                href={route(
                                    "admin.onboarding.detail",
                                    quoteResponse.user_id,
                                )}
                            >
                                <PrimaryButton>
                                    オンボーディング詳細を確認
                                </PrimaryButton>
                            </Link>
                        </div>
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
