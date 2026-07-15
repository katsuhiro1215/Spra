import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badge";
import { FlashMessage } from "@/Components/Notifications";
import { PencilIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

const slotTypeLabels = {
    meeting: "面談",
    progress_review: "進捗会",
    consultation: "相談",
    other: "その他",
};

const slotStatusVariants = {
    available: "success",
    blocked: "secondary",
    full: "danger",
};

const slotStatusLabels = {
    available: "予約可能",
    blocked: "ブロック中",
    full: "満席",
};

const appointmentStatusVariants = {
    pending: "warning",
    confirmed: "info",
    completed: "success",
    cancelled: "danger",
    no_show: "secondary",
};

const appointmentStatusLabels = {
    pending: "保留中",
    confirmed: "確定",
    completed: "完了",
    cancelled: "キャンセル",
    no_show: "不参加",
};

export default function Show({ appointmentSlot }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
        });
    };

    const formatTime = (time) => (time ? time.substring(0, 5) : "");

    const headerActions = [
        {
            label: PageConfig.appointmentSlots.actions.edit,
            icon: PencilIcon,
            variant: "secondary",
            route: route("admin.appointment-slots.edit", appointmentSlot.id),
        },
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.appointment-slots.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.appointmentSlots.breadcrumbs,
        PageConfig.appointmentSlots.pages.show.breadcrumb,
    ];

    const appointments = appointmentSlot.appointments || [];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.appointmentSlots.pages.show.title}
                    description={`${formatDate(appointmentSlot.date)} ${formatTime(appointmentSlot.start_time)}-${formatTime(appointmentSlot.end_time)}`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.appointmentSlots.pages.show.title} />
            <FlashMessage />

            <div className="max-w-5xl mx-auto py-6 space-y-6">
                {/* ヘッダー情報 */}
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {formatDate(appointmentSlot.date)}{" "}
                        {formatTime(appointmentSlot.start_time)}-
                        {formatTime(appointmentSlot.end_time)}
                    </h1>
                    <Badge
                        variant={
                            slotStatusVariants[appointmentSlot.status] ||
                            "secondary"
                        }
                    >
                        {slotStatusLabels[appointmentSlot.status] ||
                            appointmentSlot.status}
                    </Badge>
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
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            予約タイプ
                                        </dt>
                                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                            {slotTypeLabels[
                                                appointmentSlot.slot_type
                                            ] || appointmentSlot.slot_type}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            担当者
                                        </dt>
                                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                            {appointmentSlot.assigned_admin
                                                ?.profile?.full_name ||
                                                appointmentSlot.assigned_admin
                                                    ?.email ||
                                                "未割り当て"}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            予約状況
                                        </dt>
                                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                            {appointmentSlot.current_bookings}{" "}
                                            / {appointmentSlot.max_capacity}
                                            <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                                                （残り
                                                {appointmentSlot.max_capacity -
                                                    appointmentSlot.current_bookings}
                                                ）
                                            </span>
                                        </dd>
                                    </div>
                                </dl>
                                {appointmentSlot.notes && (
                                    <div className="mt-6">
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                            メモ
                                        </dt>
                                        <dd className="text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                                            {appointmentSlot.notes}
                                        </dd>
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        {/* この枠に紐づく予約 */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                    予約一覧（{appointments.length}件）
                                </h2>
                            </CardHeader>
                            <CardBody>
                                {appointments.length === 0 ? (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        この枠にはまだ予約がありません。
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-900">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        予約者
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        件名
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        ステータス
                                                    </th>
                                                    <th className="px-4 py-2" />
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {appointments.map(
                                                    (appointment) => (
                                                        <tr key={appointment.id}>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                                {appointment.booker_name}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                                {appointment.subject}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">
                                                                <Badge
                                                                    variant={
                                                                        appointmentStatusVariants[
                                                                            appointment
                                                                                .status
                                                                        ]
                                                                    }
                                                                >
                                                                    {appointmentStatusLabels[
                                                                        appointment
                                                                            .status
                                                                    ] ||
                                                                        appointment.status}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-4 py-3 text-right text-sm">
                                                                <Link
                                                                    href={route(
                                                                        "admin.appointments.show",
                                                                        appointment.id,
                                                                    )}
                                                                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                                                >
                                                                    詳細
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* 登録情報 */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                    登録情報
                                </h2>
                            </CardHeader>
                            <CardBody>
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            作成者
                                        </dt>
                                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                            {appointmentSlot.creator?.profile
                                                ?.full_name ||
                                                appointmentSlot.creator
                                                    ?.email ||
                                                "-"}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            最終更新者
                                        </dt>
                                        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                                            {appointmentSlot.updater?.profile
                                                ?.full_name ||
                                                appointmentSlot.updater
                                                    ?.email ||
                                                "-"}
                                        </dd>
                                    </div>
                                </dl>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
