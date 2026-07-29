import React from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { Badge } from "@/Components/Badge";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { SecondaryButton, DangerButton } from "@/Components/Buttons";
import { PlusIcon } from "@heroicons/react/24/outline";

const SLOT_TYPE_LABELS = {
    meeting: "面談",
    progress_review: "進捗会",
    consultation: "相談",
    other: "その他",
};

export default function Index({ recurrences = [] }) {
    const handlePause = (recurrence) => {
        router.post(
            route("admin.appointment-slot-recurrences.pause", recurrence.id),
            {},
            { preserveScroll: true },
        );
    };

    const handleResume = (recurrence) => {
        router.post(
            route("admin.appointment-slot-recurrences.resume", recurrence.id),
            {},
            { preserveScroll: true },
        );
    };

    const handleDelete = (recurrence) => {
        if (
            confirm(
                "この繰り返し設定を削除してもよろしいですか？（既に生成済みの予約枠は残ります）",
            )
        ) {
            router.delete(
                route(
                    "admin.appointment-slot-recurrences.destroy",
                    recurrence.id,
                ),
                { preserveScroll: true },
            );
        }
    };

    const headerActions = [
        {
            label: "繰り返し設定を作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.appointment-slot-recurrences.create"),
        },
    ];

    const breadcrumbs = [
        { label: "ホーム" },
        { label: "スケジュール管理" },
        { label: "予約枠の繰り返し設定" },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="予約枠の繰り返し設定"
                    description="毎週決まった曜日・時間の予約枠を自動生成します"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="予約枠の繰り返し設定" />

            <FlashMessage />

            <Card>
                <Table>
                    <THead>
                        <Tr>
                            <Th>曜日・時間</Th>
                            <Th>タイプ</Th>
                            <Th>担当者</Th>
                            <Th>期間</Th>
                            <Th>生成済み件数</Th>
                            <Th>ステータス</Th>
                            <Th>操作</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {recurrences.length === 0 ? (
                            <Tr>
                                <Td colSpan={7}>
                                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                        繰り返し設定はまだありません
                                    </div>
                                </Td>
                            </Tr>
                        ) : (
                            recurrences.map((recurrence) => (
                                <Tr key={recurrence.id}>
                                    <Td>
                                        {recurrence.day_name}曜日{" "}
                                        {recurrence.start_time?.slice(0, 5)}〜
                                        {recurrence.end_time?.slice(0, 5)}
                                    </Td>
                                    <Td>
                                        {SLOT_TYPE_LABELS[
                                            recurrence.slot_type
                                        ] || recurrence.slot_type}
                                    </Td>
                                    <Td>
                                        {recurrence.assigned_admin
                                            ? recurrence.assigned_admin.profile
                                                  ?.full_name ||
                                              recurrence.assigned_admin.email
                                            : "未割り当て"}
                                    </Td>
                                    <Td>
                                        {recurrence.starts_on} 〜{" "}
                                        {recurrence.ends_on || "無期限"}
                                    </Td>
                                    <Td>{recurrence.slots_count ?? 0}件</Td>
                                    <Td>
                                        <Badge
                                            variant={
                                                recurrence.status === "active"
                                                    ? "success"
                                                    : "secondary"
                                            }
                                        >
                                            {recurrence.status === "active"
                                                ? "有効"
                                                : "一時停止中"}
                                        </Badge>
                                    </Td>
                                    <Td>
                                        <div className="flex items-center gap-2">
                                            {recurrence.status === "active" ? (
                                                <SecondaryButton
                                                    onClick={() =>
                                                        handlePause(recurrence)
                                                    }
                                                >
                                                    一時停止
                                                </SecondaryButton>
                                            ) : (
                                                <SecondaryButton
                                                    onClick={() =>
                                                        handleResume(
                                                            recurrence,
                                                        )
                                                    }
                                                >
                                                    再開
                                                </SecondaryButton>
                                            )}
                                            <DangerButton
                                                onClick={() =>
                                                    handleDelete(recurrence)
                                                }
                                            >
                                                削除
                                            </DangerButton>
                                        </div>
                                    </Td>
                                </Tr>
                            ))
                        )}
                    </TBody>
                </Table>
            </Card>
        </AdminAuthenticatedLayout>
    );
}
