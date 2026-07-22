import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badge";
import { SecondaryButton } from "@/Components/Buttons";
import { FlashMessage } from "@/Components/Notifications";
import {
    ArrowLeftIcon,
    PencilIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

const statusVariants = {
    pending: "warning",
    confirmed: "info",
    completed: "success",
    cancelled: "danger",
    no_show: "secondary",
};

const statusLabels = {
    pending: "保留中",
    confirmed: "確定",
    completed: "完了",
    cancelled: "キャンセル",
    no_show: "不参加",
};

const meetingToolLabels = {
    zoom: "Zoom",
    teams: "Microsoft Teams",
    google_meet: "Google Meet",
    other: "その他",
};

export default function Show({ appointment }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleString("ja-JP");
    };

    const formatTime = (time) => (time ? time.substring(0, 5) : "");

    const handleConfirm = () => {
        if (confirm("この予約を確定しますか？")) {
            router.post(route("admin.appointments.confirm", appointment.id));
        }
    };

    const handleCancel = () => {
        const reason = prompt("キャンセル理由を入力してください（任意）:");
        if (reason !== null) {
            router.post(route("admin.appointments.cancel", appointment.id), {
                cancellation_reason: reason,
            });
        }
    };

    const handleComplete = () => {
        if (confirm("この予約を完了にしますか？")) {
            router.post(route("admin.appointments.complete", appointment.id));
        }
    };

    const headerActions = [
        {
            label: "編集",
            icon: PencilIcon,
            variant: "secondary",
            route: route("admin.appointments.edit", appointment.id),
        },
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.appointments.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.appointments.breadcrumbs,
        PageConfig.appointments.pages.show.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.appointments.pages.show.title}
                    description={appointment.subject}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.appointments.pages.show.title} />
            <FlashMessage />

            <div className="max-w-5xl mx-auto py-6 space-y-6">
                {/* ヘッダー情報 */}
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {appointment.subject}
                    </h1>
                    <Badge variant={statusVariants[appointment.status]}>
                        {statusLabels[appointment.status] || appointment.status}
                    </Badge>
                    {appointment.is_guest_booking && (
                        <Badge variant="warning">一般クライアント</Badge>
                    )}
                    {appointment.source === "instagram" && (
                        <Badge variant="info">Instagram</Badge>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* 基本情報 */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                    基本情報
                                </h2>
                            </CardHeader>
                            <CardBody>
                                {appointment.description && (
                                    <div className="mb-6">
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                            詳細
                                        </dt>
                                        <dd className="text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                                            {appointment.description}
                                        </dd>
                                    </div>
                                )}
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            日時
                                        </dt>
                                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                            {formatDate(
                                                appointment.appointment_slot
                                                    ?.date,
                                            )}{" "}
                                            {formatTime(
                                                appointment.appointment_slot
                                                    ?.start_time,
                                            )}
                                            -
                                            {formatTime(
                                                appointment.appointment_slot
                                                    ?.end_time,
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            担当者
                                        </dt>
                                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                            {appointment.appointment_slot
                                                ?.assigned_admin?.profile
                                                ?.full_name ||
                                                appointment.appointment_slot
                                                    ?.assigned_admin?.email ||
                                                "未割り当て"}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            会議形式
                                        </dt>
                                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                            {appointment.location_type ===
                                            "online"
                                                ? "オンライン"
                                                : "対面"}
                                            {appointment.meeting_tool &&
                                                ` (${meetingToolLabels[appointment.meeting_tool] || appointment.meeting_tool})`}
                                        </dd>
                                    </div>
                                    {appointment.meeting_url && (
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                会議URL
                                            </dt>
                                            <dd className="mt-1 text-sm">
                                                <a
                                                    href={appointment.meeting_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                                                >
                                                    {appointment.meeting_url}
                                                </a>
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </CardBody>
                        </Card>

                        {/* メモ */}
                        {(appointment.client_notes ||
                            appointment.admin_notes) && (
                            <Card>
                                <CardHeader>
                                    <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                        メモ
                                    </h2>
                                </CardHeader>
                                <CardBody className="space-y-4">
                                    {appointment.client_notes && (
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                                クライアント向けメモ
                                            </dt>
                                            <dd className="text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                                                {appointment.client_notes}
                                            </dd>
                                        </div>
                                    )}
                                    {appointment.admin_notes && (
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                                Admin向けメモ（内部用）
                                            </dt>
                                            <dd className="text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                                                {appointment.admin_notes}
                                            </dd>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        )}

                        {/* ステータス履歴 */}
                        {(appointment.confirmed_at ||
                            appointment.cancelled_at) && (
                            <Card>
                                <CardHeader>
                                    <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                        ステータス履歴
                                    </h2>
                                </CardHeader>
                                <CardBody className="space-y-3">
                                    {appointment.confirmed_at && (
                                        <p className="text-sm text-blue-800 dark:text-blue-300">
                                            <strong>確定日時:</strong>{" "}
                                            {formatDateTime(
                                                appointment.confirmed_at,
                                            )}
                                        </p>
                                    )}
                                    {appointment.cancelled_at && (
                                        <div>
                                            <p className="text-sm text-red-800 dark:text-red-300">
                                                <strong>キャンセル日時:</strong>{" "}
                                                {formatDateTime(
                                                    appointment.cancelled_at,
                                                )}
                                            </p>
                                            {appointment.cancellation_reason && (
                                                <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                                                    <strong>理由:</strong>{" "}
                                                    {
                                                        appointment.cancellation_reason
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* 予約者情報 */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                    予約者情報
                                </h2>
                            </CardHeader>
                            <CardBody>
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            予約者
                                        </dt>
                                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                            {appointment.booker_name}
                                        </dd>
                                    </div>
                                    {appointment.is_guest_booking && (
                                        <>
                                            {appointment.guest_email && (
                                                <div>
                                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        メールアドレス
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                        {
                                                            appointment.guest_email
                                                        }
                                                    </dd>
                                                </div>
                                            )}
                                            {appointment.guest_phone && (
                                                <div>
                                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        電話番号
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                        {
                                                            appointment.guest_phone
                                                        }
                                                    </dd>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {appointment.company && (
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                企業
                                            </dt>
                                            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                {appointment.company.name}
                                            </dd>
                                        </div>
                                    )}
                                    {appointment.project && (
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                プロジェクト
                                            </dt>
                                            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                                {appointment.project.title}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </CardBody>
                        </Card>

                        {/* アクション */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                    アクション
                                </h2>
                            </CardHeader>
                            <CardBody className="space-y-2">
                                {appointment.status === "pending" && (
                                    <SecondaryButton
                                        onClick={handleConfirm}
                                        className="w-full justify-center"
                                        icon={CheckCircleIcon}
                                    >
                                        予約を確定
                                    </SecondaryButton>
                                )}
                                {["pending", "confirmed"].includes(
                                    appointment.status,
                                ) && (
                                    <SecondaryButton
                                        onClick={handleCancel}
                                        className="w-full justify-center"
                                        icon={XCircleIcon}
                                    >
                                        キャンセル
                                    </SecondaryButton>
                                )}
                                {appointment.status === "confirmed" && (
                                    <SecondaryButton
                                        onClick={handleComplete}
                                        className="w-full justify-center"
                                    >
                                        完了にする
                                    </SecondaryButton>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
