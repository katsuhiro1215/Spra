import { useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import FilterSelect from "@/Components/FilterSelect";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    PlusIcon,
    Squares2X2Icon,
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("ja-JP") : "-";

export default function ShiftsIndex({ shifts, admins, filters }) {
    const { data, setData, get } = useForm({
        admin_id: filters.admin_id || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
    });

    const handleFilter = (patch) => {
        const next = { ...data, ...patch };
        setData(next);
        get(route("admin.attendance.shifts.index"), next, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (shift) => {
        if (
            confirm(
                `${shift.shift_date} のシフト（${shift.admin?.profile?.full_name || shift.admin?.email}）を削除しますか？`,
            )
        ) {
            router.delete(route("admin.attendance.shifts.destroy", shift.id), {
                preserveScroll: true,
            });
        }
    };

    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.attendance.index"),
        },
        {
            label: "まとめて作成",
            icon: Squares2X2Icon,
            variant: "secondary",
            route: route("admin.attendance.shifts.bulk-create"),
        },
        {
            label: "シフトを作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.attendance.shifts.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="シフト管理"
                    description="管理者の勤務予定を管理します"
                    actions={headerActions}
                    breadcrumbs={[
                        ...PageConfig.attendance.breadcrumbs,
                        "シフト管理",
                    ]}
                />
            }
        >
            <Head title="シフト管理" />
            <FlashMessage />

            <div className="space-y-4">
                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FilterSelect
                            label="担当者"
                            value={data.admin_id}
                            onChange={(value) =>
                                handleFilter({ admin_id: value })
                            }
                            options={admins}
                            placeholder="すべて"
                        />
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                開始日
                            </label>
                            <input
                                type="date"
                                value={data.date_from}
                                onChange={(e) =>
                                    handleFilter({ date_from: e.target.value })
                                }
                                className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                終了日
                            </label>
                            <input
                                type="date"
                                value={data.date_to}
                                onChange={(e) =>
                                    handleFilter({ date_to: e.target.value })
                                }
                                className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                            />
                        </div>
                    </div>
                </Card>

                <Card>
                    <Table>
                        <THead>
                            <Tr hover={false}>
                                <Th>日付</Th>
                                <Th>担当者</Th>
                                <Th>時間</Th>
                                <Th>メモ</Th>
                                <Th className="text-right">アクション</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {shifts.data.length > 0 ? (
                                shifts.data.map((shift) => (
                                    <Tr key={shift.id}>
                                        <Td>{formatDate(shift.shift_date)}</Td>
                                        <Td>
                                            {shift.admin?.profile?.full_name ||
                                                shift.admin?.email}
                                        </Td>
                                        <Td>
                                            {shift.start_time?.substring(0, 5)}{" "}
                                            -{" "}
                                            {shift.end_time?.substring(0, 5)}
                                        </Td>
                                        <Td>{shift.notes || "-"}</Td>
                                        <Td className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={route(
                                                        "admin.attendance.shifts.edit",
                                                        shift.id,
                                                    )}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 p-1"
                                                    title="編集"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(shift)
                                                    }
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 p-1"
                                                    title="削除"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td
                                        colSpan={5}
                                        className="text-center text-slate-500 dark:text-slate-400 py-8"
                                    >
                                        シフトはありません
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                </Card>

                <Pagination paginationData={shifts} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
