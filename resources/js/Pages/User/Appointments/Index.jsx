import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import UserPagination from "@/Components/Layout/UserPagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody } from "@/Components/Card";
import Badge from "@/Components/Badge";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { PlusIcon, VideoCameraIcon, MapPinIcon } from "@heroicons/react/24/outline";

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

export default function Index({ appointments }) {
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

    const handleCancel = (appointment) => {
        const reason = prompt("キャンセル理由があればご記入ください（任意）:");
        if (reason !== null) {
            router.post(route("user.appointments.cancel", appointment.id), {
                cancellation_reason: reason,
            });
        }
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: route("user.dashboard") },
        { label: "予約", href: null },
    ];

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="予約"
                    description="担当者との面談・相談の予約を確認・管理できます"
                    breadcrumbs={breadcrumbs}
                    actions={[
                        {
                            label: "新しく予約する",
                            route: route("user.appointments.create"),
                        },
                    ]}
                />
            }
        >
            <Head title="予約" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 py-8 space-y-4">
                <div className="flex justify-end md:hidden">
                    <Link href={route("user.appointments.create")}>
                        <PrimaryButton>
                            <PlusIcon className="h-4 w-4 mr-1" />
                            新しく予約する
                        </PrimaryButton>
                    </Link>
                </div>

                {appointments.data.length === 0 ? (
                    <Card>
                        <CardBody>
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    予約はまだありません
                                </p>
                                <Link href={route("user.appointments.create")}>
                                    <PrimaryButton>予約する</PrimaryButton>
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {appointments.data.map((appointment) => (
                            <Card key={appointment.id}>
                                <CardBody>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {appointment.subject}
                                                </h3>
                                                <Badge
                                                    variant={
                                                        statusVariants[
                                                            appointment.status
                                                        ]
                                                    }
                                                >
                                                    {
                                                        statusLabels[
                                                            appointment.status
                                                        ]
                                                    }
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
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
                                            </p>
                                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                {appointment.location_type ===
                                                "online" ? (
                                                    <VideoCameraIcon className="h-4 w-4" />
                                                ) : (
                                                    <MapPinIcon className="h-4 w-4" />
                                                )}
                                                {appointment.location_type ===
                                                "online"
                                                    ? "オンライン"
                                                    : "対面"}
                                                {appointment.project && (
                                                    <span className="ml-2">
                                                        プロジェクト:{" "}
                                                        {
                                                            appointment.project
                                                                .title
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                            {appointment.meeting_url && (
                                                <a
                                                    href={
                                                        appointment.meeting_url
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-block mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    会議に参加する →
                                                </a>
                                            )}
                                        </div>

                                        {["pending", "confirmed"].includes(
                                            appointment.status,
                                        ) && (
                                            <div className="flex gap-2 flex-shrink-0">
                                                <Link
                                                    href={route(
                                                        "user.appointments.edit",
                                                        appointment.id,
                                                    )}
                                                >
                                                    <SecondaryButton>
                                                        変更
                                                    </SecondaryButton>
                                                </Link>
                                                <SecondaryButton
                                                    onClick={() =>
                                                        handleCancel(
                                                            appointment,
                                                        )
                                                    }
                                                >
                                                    キャンセル
                                                </SecondaryButton>
                                            </div>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}

                {appointments.data.length > 0 && (
                    <UserPagination
                        links={appointments.links}
                        meta={appointments.meta}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
