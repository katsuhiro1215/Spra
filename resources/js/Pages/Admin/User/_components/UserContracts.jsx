import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import { DocumentTextIcon, EyeIcon } from "@heroicons/react/24/outline";

const CONTRACT_STATUS_VARIANTS = {
    draft: "secondary",
    pending_signature: "warning",
    active: "success",
    suspended: "orange",
    completed: "info",
    cancelled: "danger",
};

const CONTRACT_STATUS_LABELS = {
    draft: "下書き",
    pending_signature: "署名待ち",
    active: "契約中",
    suspended: "一時停止",
    completed: "完了",
    cancelled: "キャンセル",
};

const CONTRACT_TYPE_LABELS = {
    one_time: "一括払い",
    monthly: "月額",
    annual: "年額",
};

const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(amount);
};

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

export default function UserContracts({ contracts = [] }) {
    return (
        <Card>
            <CardHeader className="flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    契約情報
                </span>
                <Badge variant="secondary" size="sm">
                    {contracts.length}件
                </Badge>
            </CardHeader>
            <CardBody>
                {contracts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <THead>
                                <Tr hover={false}>
                                    <Th>契約番号</Th>
                                    <Th>タイトル</Th>
                                    <Th>会社</Th>
                                    <Th>タイプ</Th>
                                    <Th>金額</Th>
                                    <Th>契約期間</Th>
                                    <Th>ステータス</Th>
                                    <Th className="text-right">操作</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {contracts.map((contract) => (
                                    <Tr key={contract.id}>
                                        <Td>
                                            <Link
                                                href={route(
                                                    "admin.contract.show",
                                                    contract.id,
                                                )}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                            >
                                                {contract.contract_number ||
                                                    contract.id.substring(0, 8)}
                                            </Link>
                                        </Td>
                                        <Td>
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                {contract.title}
                                            </div>
                                        </Td>
                                        <Td>
                                            {contract.company ? (
                                                <Link
                                                    href={route(
                                                        "admin.company.show",
                                                        contract.company.id,
                                                    )}
                                                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                                >
                                                    {contract.company.name}
                                                </Link>
                                            ) : (
                                                <span className="text-slate-400">
                                                    -
                                                </span>
                                            )}
                                        </Td>
                                        <Td>
                                            <Badge variant="purple">
                                                {CONTRACT_TYPE_LABELS[
                                                    contract.type
                                                ] || contract.type}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                {formatAmount(
                                                    contract.current_version
                                                        ?.total_amount,
                                                )}
                                            </div>
                                        </Td>
                                        <Td>
                                            <div className="text-sm">
                                                <div className="text-gray-900 dark:text-gray-100">
                                                    {formatDate(
                                                        contract.start_date,
                                                    )}
                                                </div>
                                                {contract.end_date && (
                                                    <div className="text-gray-500 dark:text-gray-400">
                                                        ～{" "}
                                                        {formatDate(
                                                            contract.end_date,
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </Td>
                                        <Td>
                                            <Badge
                                                variant={
                                                    CONTRACT_STATUS_VARIANTS[
                                                        contract.status
                                                    ] || "secondary"
                                                }
                                            >
                                                {CONTRACT_STATUS_LABELS[
                                                    contract.status
                                                ] || contract.status}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <div className="flex justify-end">
                                                <IconButton
                                                    icon={EyeIcon}
                                                    variant="info-text"
                                                    size="lg"
                                                    href={route(
                                                        "admin.contract.show",
                                                        contract.id,
                                                    )}
                                                    title="詳細"
                                                />
                                            </div>
                                        </Td>
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                        契約情報が登録されていません
                    </p>
                )}
            </CardBody>
        </Card>
    );
}
