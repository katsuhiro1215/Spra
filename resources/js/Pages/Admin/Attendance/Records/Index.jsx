import { Head, Link, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import FilterSelect from "@/Components/FilterSelect";
import { ArrowLeftIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

const STATUS_BADGE_CLASSES = {
    working: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
    finished: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

export default function RecordsIndex({ records, admins, statuses, filters }) {
    const { data, setData, get } = useForm({
        admin_id: filters.admin_id || "",
        status: filters.status || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
    });

    const handleFilter = (patch) => {
        const next = { ...data, ...patch };
        setData(next);
        get(route("admin.attendance.records.index"), next, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (record) => {
        if (
            confirm(
                `${record.work_date} の勤怠記録（${record.admin?.profile?.full_name || record.admin?.email}）を削除しますか？`,
            )
        ) {
            router.delete(
                route("admin.attendance.records.destroy", record.id),
                { preserveScroll: true },
            );
        }
    };

    const getStatusLabel = (status) => {
        const s = statuses.find((st) => st.value === status);
        return s ? s.label : status;
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="出退勤記録の修正"
                    description="打刻された出退勤実績を確認・修正します"
                    actions={[
                        {
                            label: "戻る",
                            icon: ArrowLeftIcon,
                            variant: "secondary",
                            route: route("admin.attendance.index"),
                        },
                    ]}
                    breadcrumbs={[
                        ...PageConfig.attendance.breadcrumbs,
                        "出退勤記録",
                    ]}
                />
            }
        >
            <Head title="出退勤記録の修正" />
            <FlashMessage />

            <div className="space-y-4">
                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FilterSelect
                            label="担当者"
                            value={data.admin_id}
                            onChange={(value) =>
                                handleFilter({ admin_id: value })
                            }
                            options={admins}
                            placeholder="すべて"
                        />
                        <FilterSelect
                            label="ステータス"
                            value={data.status}
                            onChange={(value) =>
                                handleFilter({ status: value })
                            }
                            options={statuses}
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
                                <Th>勤務日</Th>
                                <Th>担当者</Th>
                                <Th>出勤</Th>
                                <Th>退勤</Th>
                                <Th>ステータス</Th>
                                <Th className="text-right">アクション</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {records.data.length > 0 ? (
                                records.data.map((record) => (
                                    <Tr key={record.id}>
                                        <Td>{record.work_date}</Td>
                                        <Td>
                                            {record.admin?.profile
                                                ?.full_name ||
                                                record.admin?.email}
                                        </Td>
                                        <Td>
                                            {record.clocked_in_at
                                                ? new Date(
                                                      record.clocked_in_at,
                                                  ).toLocaleTimeString(
                                                      "ja-JP",
                                                      {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      },
                                                  )
                                                : "-"}
                                        </Td>
                                        <Td>
                                            {record.clocked_out_at
                                                ? new Date(
                                                      record.clocked_out_at,
                                                  ).toLocaleTimeString(
                                                      "ja-JP",
                                                      {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      },
                                                  )
                                                : "-"}
                                        </Td>
                                        <Td>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    STATUS_BADGE_CLASSES[
                                                        record.status
                                                    ] ||
                                                    STATUS_BADGE_CLASSES.finished
                                                }`}
                                            >
                                                {getStatusLabel(
                                                    record.status,
                                                )}
                                            </span>
                                        </Td>
                                        <Td className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={route(
                                                        "admin.attendance.records.edit",
                                                        record.id,
                                                    )}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 p-1"
                                                    title="編集"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(record)
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
                                        colSpan={6}
                                        className="text-center text-slate-500 dark:text-slate-400 py-8"
                                    >
                                        勤怠記録はありません
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                </Card>

                <Pagination paginationData={records} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
