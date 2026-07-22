import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

const formatYen = (amount) =>
    new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
        maximumFractionDigits: 0,
    }).format(amount || 0);

export default function PayrollIndex({ payrolls = [], currentYear, currentMonth }) {
    const changeMonth = (offset) => {
        const newDate = new Date(currentYear, currentMonth - 1 + offset, 1);
        router.get(route("admin.payroll.index"), {
            year: newDate.getFullYear(),
            month: newDate.getMonth() + 1,
        });
    };

    const totalPay = payrolls.reduce((sum, p) => sum + (p.pay || 0), 0);

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.payroll.title}
                    description={PageConfig.payroll.description}
                    breadcrumbs={PageConfig.payroll.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.payroll.documentTitle} />
            <FlashMessage />

            <div className="w-full space-y-4">
                <Card>
                    <div className="p-4 flex items-center justify-between">
                        <button
                            onClick={() => changeMonth(-1)}
                            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <ChevronLeftIcon className="w-5 h-5 mr-1" />
                            前月
                        </button>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            {currentYear}年 {currentMonth}月
                        </h3>
                        <button
                            onClick={() => changeMonth(1)}
                            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            翌月
                            <ChevronRightIcon className="w-5 h-5 ml-1" />
                        </button>
                    </div>
                </Card>

                <Card>
                    <Table>
                        <THead>
                            <Tr hover={false}>
                                <Th>担当者</Th>
                                <Th>雇用形態</Th>
                                <Th>給与体系</Th>
                                <Th className="text-right">出勤日数</Th>
                                <Th className="text-right">実働時間</Th>
                                <Th className="text-right">支給額（概算）</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {payrolls.length > 0 ? (
                                payrolls.map((row) => (
                                    <Tr key={row.admin_id}>
                                        <Td>{row.admin_name}</Td>
                                        <Td>{row.employment_type_label}</Td>
                                        <Td>
                                            {row.pay_type_label}
                                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                                {row.pay_type === "hourly"
                                                    ? `(${formatYen(row.hourly_wage)}/時)`
                                                    : `(${formatYen(row.base_salary)})`}
                                            </span>
                                        </Td>
                                        <Td className="text-right">
                                            {row.work_days}日
                                        </Td>
                                        <Td className="text-right">
                                            {row.worked_hours}時間
                                        </Td>
                                        <Td className="text-right font-semibold text-gray-900 dark:text-gray-100">
                                            {formatYen(row.pay)}
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td
                                        colSpan={6}
                                        className="text-center text-slate-500 dark:text-slate-400 py-8"
                                    >
                                        雇用条件が設定されている管理者がいません（管理者詳細画面の「設定」タブから登録してください）
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                        {payrolls.length > 0 && (
                            <tfoot>
                                <Tr hover={false}>
                                    <Td
                                        colSpan={5}
                                        className="text-right font-semibold text-gray-700 dark:text-gray-200"
                                    >
                                        合計
                                    </Td>
                                    <Td className="text-right font-bold text-gray-900 dark:text-gray-100">
                                        {formatYen(totalPay)}
                                    </Td>
                                </Tr>
                            </tfoot>
                        )}
                    </Table>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
