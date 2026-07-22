import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { TextArea } from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { ConfirmAlert } from "@/Components/Alerts";
import { FlashMessage } from "@/Components/Notifications";
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

const STATUS_BADGE_VARIANTS = {
    pending: "info",
    approved: "success",
    rejected: "danger",
};

export default function Show({ redemption }) {
    const [showApproveAlert, setShowApproveAlert] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const isPending = redemption.status === "pending";

    const handleApprove = () => {
        router.post(route("admin.point-redemption.approve", redemption.id));
    };

    const handleReject = () => {
        router.post(route("admin.point-redemption.reject", redemption.id), {
            reason: rejectReason,
        });
    };

    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.point-redemption.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`交換申請: ${redemption.item_name}`}
                    description="ポイント交換申請の詳細"
                    actions={headerActions}
                />
            }
        >
            <Head title={`交換申請 - ${redemption.item_name}`} />

            <FlashMessage />

            <ConfirmAlert
                isOpen={showApproveAlert}
                onClose={() => setShowApproveAlert(false)}
                onConfirm={handleApprove}
                title="承認確認"
                message={`「${redemption.item_name}」（${redemption.points_used}pt）の交換申請を承認します。承認するとポイントが消費されます。よろしいですか？`}
                confirmText="承認する"
                type="confirm"
            />

            <div className="space-y-4">
                <Card>
                    <CardHeader>基本情報</CardHeader>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    会社
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {redemption.company?.name || "-"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    ステータス
                                </dt>
                                <dd className="mt-1">
                                    <Badge
                                        variant={
                                            STATUS_BADGE_VARIANTS[
                                                redemption.status
                                            ] || "secondary"
                                        }
                                        size="sm"
                                    >
                                        {redemption.status_label}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    交換商品
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {redemption.item_name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    消費ポイント
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {redemption.points_used.toLocaleString()}
                                    pt
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    申請者
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {redemption.requested_by?.name ||
                                        redemption.requested_by?.email ||
                                        "-"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    申請日時
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                    {new Date(
                                        redemption.created_at,
                                    ).toLocaleString("ja-JP")}
                                </dd>
                            </div>
                        </div>

                        {redemption.status !== "pending" && (
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        対応者
                                    </dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                        {redemption.reviewed_by?.name || "-"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        対応日時
                                    </dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                        {redemption.reviewed_at
                                            ? new Date(
                                                  redemption.reviewed_at,
                                              ).toLocaleString("ja-JP")
                                            : "-"}
                                    </dd>
                                </div>
                                {redemption.rejection_reason && (
                                    <div className="col-span-2">
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            却下理由
                                        </dt>
                                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                                            {redemption.rejection_reason}
                                        </dd>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Card>

                {isPending && (
                    <Card>
                        <CardHeader>対応する</CardHeader>
                        <div className="p-6 space-y-4">
                            <div className="flex flex-wrap gap-3">
                                <PrimaryButton
                                    onClick={() => setShowApproveAlert(true)}
                                >
                                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                                    承認する
                                </PrimaryButton>
                                <SecondaryButton
                                    onClick={() =>
                                        setShowRejectForm(!showRejectForm)
                                    }
                                >
                                    <XCircleIcon className="h-4 w-4 mr-2" />
                                    却下する
                                </SecondaryButton>
                            </div>

                            {showRejectForm && (
                                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                    <TextArea
                                        value={rejectReason}
                                        onChange={(e) =>
                                            setRejectReason(e.target.value)
                                        }
                                        rows={3}
                                        placeholder="却下理由（任意）"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleReject}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                        >
                                            却下を確定する
                                        </button>
                                        <SecondaryButton
                                            onClick={() =>
                                                setShowRejectForm(false)
                                            }
                                        >
                                            キャンセル
                                        </SecondaryButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
