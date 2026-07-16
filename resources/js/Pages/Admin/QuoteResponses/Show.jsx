import React, { useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FlashMessage } from "@/Components/Notifications";
import { ConfirmAlert } from "@/Components/Alerts";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

const QUOTE_STATUS_BADGE_VARIANT = {
    draft: "secondary",
    negotiating: "warning",
    approved: "success",
    rejected: "danger",
    contracted: "success",
    cancelled: "secondary",
};

const QUOTE_STATUS_LABELS = {
    draft: "下書き",
    negotiating: "交渉中",
    approved: "承認済み",
    rejected: "却下",
    contracted: "契約済み",
    cancelled: "キャンセル",
};

export default function Detail({ quoteResponse, responseTypes }) {
    const { post, processing } = useForm();
    const declineForm = useForm({ note: "" });
    const [showInvitationConfirm, setShowInvitationConfirm] = useState(false);
    const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);

    const handleSendInvitation = () => {
        setShowInvitationConfirm(true);
    };

    const confirmSendInvitation = () => {
        post(route("admin.quote-response.send-invitation", quoteResponse.id));
        setShowInvitationConfirm(false);
    };

    const confirmDecline = () => {
        declineForm.post(
            route("admin.quote-response.mark-declined", quoteResponse.id),
            {
                preserveScroll: true,
                onSuccess: () => setShowDeclineConfirm(false),
            },
        );
    };

    const elapsedDays = Math.floor(
        (Date.now() - new Date(quoteResponse.created_at).getTime()) /
            (1000 * 60 * 60 * 24),
    );

    const getStatusBadge = (response) => {
        if (!response.responded_at) {
            return <Badge variant="warning">未返信</Badge>;
        }
        return <Badge variant="success">返信済み</Badge>;
    };

    const getResponseTypeLabel = (responseType) => {
        return responseTypes[responseType] || responseType;
    };

    const breadcrumbs = [...PageConfig.quoteResponses.breadcrumbs, "詳細"];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="見積返信詳細"
                    description="クライアントからの見積返信内容を確認します"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
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
                                                QUOTE_STATUS_BADGE_VARIANT[
                                                    quoteResponse.quote.status
                                                ] || "secondary"
                                            }
                                        >
                                            {QUOTE_STATUS_LABELS[
                                                quoteResponse.quote.status
                                            ] || quoteResponse.quote.status}
                                        </Badge>
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        合計金額
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        ¥
                                        {quoteResponse.quote.current_version?.total_amount?.toLocaleString() ||
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

                {/* 未回答: 管理者による手動NG判定 */}
                {!quoteResponse.responded_at && (
                    <Card>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                未回答（送信から{elapsedDays}日経過）
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                クライアントからの回答がまだありません。しばらく様子を見ても回答が得られない場合は、内容を確認のうえ手動で見送り(NG)として記録できます。この処理は自動では行われません。
                            </p>
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    メモ（任意）
                                </label>
                                <textarea
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 text-sm"
                                    rows={2}
                                    value={declineForm.data.note}
                                    onChange={(e) =>
                                        declineForm.setData(
                                            "note",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="例: 電話でも連絡が取れず見送りと判断"
                                />
                            </div>
                            <PrimaryButton
                                onClick={() => setShowDeclineConfirm(true)}
                                disabled={declineForm.processing}
                            >
                                NG（未回答）として処理
                            </PrimaryButton>
                        </div>
                    </Card>
                )}

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

                {/* 見直し依頼への対応 */}
                {quoteResponse.response_type === "revision_request" &&
                    quoteResponse.quote && (
                        <Card>
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    見積書の見直し依頼
                                </h3>
                                {quoteResponse.response_text && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            見直しのご要望
                                        </label>
                                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                            {quoteResponse.response_text}
                                        </div>
                                    </div>
                                )}
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    クライアントからの見直し依頼に対応するため、見積書を編集します。
                                </p>
                                <div className="flex gap-2">
                                    <Link
                                        href={route(
                                            "admin.quote.edit",
                                            quoteResponse.quote.id,
                                        )}
                                    >
                                        <PrimaryButton>
                                            見積書を編集する
                                        </PrimaryButton>
                                    </Link>
                                    <Link
                                        href={route(
                                            "admin.quote.show",
                                            quoteResponse.quote.id,
                                        )}
                                    >
                                        <SecondaryButton>
                                            見積書を確認
                                        </SecondaryButton>
                                    </Link>
                                </div>
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
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {/* 招待メール送信確認ダイアログ */}
            <ConfirmAlert
                isOpen={showInvitationConfirm}
                onClose={() => setShowInvitationConfirm(false)}
                onCancel={() => setShowInvitationConfirm(false)}
                onConfirm={confirmSendInvitation}
                title="確認"
                message="招待メールを送信してもよろしいですか？"
                confirmText="送信"
                cancelText="キャンセル"
            />

            {/* NG判定確認ダイアログ */}
            <ConfirmAlert
                isOpen={showDeclineConfirm}
                onClose={() => setShowDeclineConfirm(false)}
                onCancel={() => setShowDeclineConfirm(false)}
                onConfirm={confirmDecline}
                title="確認"
                message="この見積を見送り(NG)として記録します。よろしいですか？"
                confirmText="NGとして処理"
                cancelText="キャンセル"
                type="warning"
            />
        </AdminAuthenticatedLayout>
    );
}
