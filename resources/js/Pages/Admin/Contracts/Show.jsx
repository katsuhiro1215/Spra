import React, { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
// Icons
import {
    ArrowLeftIcon,
    PencilIcon,
    CheckCircleIcon,
    XCircleIcon,
    DocumentArrowUpIcon,
    DocumentTextIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

export default function Show({ contract }) {
    const [uploading, setUploading] = useState(false);
    const { data, setData, post, reset } = useForm({
        document: null,
    });

    // ステータスのバッジカラーを取得
    const getContractStatusColor = (status) => {
        const colors = {
            draft: "bg-gray-100 text-gray-800",
            pending_signature: "bg-yellow-100 text-yellow-800",
            active: "bg-green-100 text-green-800",
            suspended: "bg-orange-100 text-orange-800",
            completed: "bg-blue-100 text-blue-800",
            cancelled: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    // ステータスのラベルを取得
    const getStatusLabel = (status) => {
        const labels = {
            draft: "下書き",
            pending_signature: "署名待ち",
            active: "契約中",
            suspended: "一時停止",
            completed: "完了",
            cancelled: "キャンセル",
        };
        return labels[status] || status;
    };

    // タイプのラベルを取得
    const getTypeLabel = (type) => {
        const labels = {
            one_time: "一括払い",
            monthly: "月額",
            annual: "年額",
        };
        return labels[type] || type;
    };

    // 金額をフォーマット
    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount);
    };

    // 日付をフォーマット
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    // 税込金額を計算
    const getTotalWithTax = () => {
        const amount = parseFloat(contract.amount) || 0;
        const taxRate = parseFloat(contract.tax_rate) || 0;
        return amount * (1 + taxRate / 100);
    };

    // ========================================
    // Handlers
    // ========================================
    const handleActivate = () => {
        const confirmed = confirm(
            `契約「${contract.title}」を有効化してもよろしいですか？`,
        );
        if (confirmed) {
            router.patch(route("admin.contract.activate", contract.id));
        }
    };

    const handleCancel = () => {
        const reason = prompt("キャンセル理由を入力してください（任意）:");
        if (reason !== null) {
            router.patch(route("admin.contract.cancel", contract.id), {
                cancellation_reason: reason,
            });
        }
    };

    const handleDelete = () => {
        const confirmed = confirm(
            `契約「${contract.title}」を削除してもよろしいですか？`,
        );
        if (confirmed) {
            router.delete(route("admin.contract.destroy", contract.id));
        }
    };

    const handleDocumentUpload = (e) => {
        e.preventDefault();
        setUploading(true);

        post(route("admin.contract.documents.upload", contract.id), {
            onSuccess: () => {
                reset();
                setUploading(false);
            },
            onError: () => {
                setUploading(false);
            },
        });
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contract.index"),
        },
    ];

    // ステータスに応じてアクションボタンを追加
    if (
        contract.status === "draft" ||
        contract.status === "pending_signature"
    ) {
        headerActions.push({
            label: "編集",
            icon: PencilIcon,
            variant: "secondary",
            route: route("admin.contract.edit", contract.id),
        });
    }

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "契約一覧", href: route("admin.contract.index") },
        { label: contract.contract_number || contract.title, href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={contract.title}
                    description="契約詳細"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`契約詳細 - ${contract.title}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="space-y-6">
                {/* 基本情報 */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>基本情報</CardTitle>
                            <Badge
                                className={getContractStatusColor(
                                    contract.status,
                                )}
                            >
                                {getStatusLabel(contract.status)}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    契約番号
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 font-mono">
                                    {contract.contract_number || "-"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    タイトル
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {contract.title}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    契約タイプ
                                </dt>
                                <dd className="mt-1">
                                    <Badge className="bg-purple-100 text-purple-800">
                                        {getTypeLabel(contract.type)}
                                    </Badge>
                                </dd>
                            </div>
                            {contract.quote && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        関連見積もり
                                    </dt>
                                    <dd className="mt-1 text-sm text-blue-600">
                                        {contract.quote.quote_number} -{" "}
                                        {contract.quote.title}
                                    </dd>
                                </div>
                            )}
                            {contract.project && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        関連プロジェクト
                                    </dt>
                                    <dd className="mt-1 text-sm text-blue-600">
                                        {contract.project.project_code ||
                                            contract.project.title}
                                    </dd>
                                </div>
                            )}
                            {contract.description && (
                                <div className="md:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">
                                        契約内容
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                                        {contract.description}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </CardBody>
                </Card>

                {/* クライアント情報 */}
                <Card>
                    <CardHeader>
                        <CardTitle>クライアント情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {contract.user && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        ユーザー
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {contract.user.profile?.full_name ||
                                            contract.user.email}
                                    </dd>
                                </div>
                            )}
                            {contract.company && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        会社
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {contract.company.name}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </CardBody>
                </Card>

                {/* 契約金額 */}
                <Card>
                    <CardHeader>
                        <CardTitle>契約金額</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <div className="space-y-3">
                                <div className="flex justify-between text-base">
                                    <span className="text-gray-600">
                                        契約金額:
                                    </span>
                                    <span className="font-semibold">
                                        {formatAmount(contract.amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-gray-600">
                                        消費税 ({contract.tax_rate}%):
                                    </span>
                                    <span className="font-semibold">
                                        {formatAmount(
                                            contract.amount *
                                                (contract.tax_rate / 100),
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-3 border-t border-blue-200">
                                    <span>税込合計:</span>
                                    <span className="text-blue-600">
                                        {formatAmount(getTotalWithTax())}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* 契約期間 */}
                <Card>
                    <CardHeader>
                        <CardTitle>契約期間</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    開始日
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {formatDate(contract.start_date)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    終了日
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {formatDate(contract.end_date)}
                                </dd>
                            </div>
                            {contract.auto_renewal && (
                                <>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            自動更新
                                        </dt>
                                        <dd className="mt-1">
                                            <Badge className="bg-green-100 text-green-800">
                                                有効
                                            </Badge>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            更新通知日数
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {contract.renewal_notice_days}日前
                                        </dd>
                                    </div>
                                </>
                            )}
                            {contract.signed_at && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        署名日時
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {formatDate(contract.signed_at)}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </CardBody>
                </Card>

                {/* 詳細設定 */}
                {(contract.payment_terms ||
                    contract.terms_and_conditions ||
                    contract.notes) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>詳細設定</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <dl className="space-y-6">
                                {contract.payment_terms && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            支払い条件
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                                            {contract.payment_terms}
                                        </dd>
                                    </div>
                                )}
                                {contract.terms_and_conditions && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            利用規約
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                                            {contract.terms_and_conditions}
                                        </dd>
                                    </div>
                                )}
                                {contract.notes && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            備考
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                                            {contract.notes}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </CardBody>
                    </Card>
                )}

                {/* 契約書類 */}
                <Card>
                    <CardHeader>
                        <CardTitle>契約書類</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {/* アップロードフォーム */}
                        <form onSubmit={handleDocumentUpload} className="mb-4">
                            <div className="flex items-end space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        書類をアップロード
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) =>
                                            setData(
                                                "document",
                                                e.target.files[0],
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        accept=".pdf,.doc,.docx,.txt"
                                    />
                                </div>
                                <PrimaryButton
                                    type="submit"
                                    disabled={!data.document || uploading}
                                >
                                    {uploading
                                        ? "アップロード中..."
                                        : "アップロード"}
                                </PrimaryButton>
                            </div>
                        </form>

                        {/* 書類リスト */}
                        {contract.documents && contract.documents.length > 0 ? (
                            <div className="space-y-2">
                                {contract.documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {doc.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {formatDate(doc.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                        <a
                                            href={route(
                                                "admin.contract.documents.download",
                                                [contract.id, doc.id],
                                            )}
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            ダウンロード
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">
                                書類はアップロードされていません
                            </p>
                        )}
                    </CardBody>
                </Card>

                {/* アクションボタン */}
                <Card>
                    <CardBody>
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-4">
                                {(contract.status === "draft" ||
                                    contract.status ===
                                        "pending_signature") && (
                                    <PrimaryButton onClick={handleActivate}>
                                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                                        契約を有効化
                                    </PrimaryButton>
                                )}
                                {contract.status === "active" && (
                                    <SecondaryButton onClick={handleCancel}>
                                        <XCircleIcon className="h-5 w-5 mr-2" />
                                        契約をキャンセル
                                    </SecondaryButton>
                                )}
                            </div>
                            {contract.status === "draft" && (
                                <SecondaryButton
                                    onClick={handleDelete}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <TrashIcon className="h-5 w-5 mr-2" />
                                    削除
                                </SecondaryButton>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
