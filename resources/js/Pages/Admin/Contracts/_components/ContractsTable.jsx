import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    DocumentTextIcon,
    DocumentArrowDownIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

const ContractsTable = ({
    contracts,
    onDelete,
    onActivate,
    onCancel,
    onApprove,
    onReminder,
}) => {
    // ステータスのバッジカラーを取得
    const getContractStatusColor = (status) => {
        const colors = {
            draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
            pending_signature:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            suspended:
                "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
            completed:
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            cancelled:
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };
        return (
            colors[status] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
        );
    };

    // 署名ステータスのバッジカラーを取得
    const getSignatureStatusColor = (status) => {
        const colors = {
            pending:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            user_signed:
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            fully_signed:
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            rejected:
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };
        return (
            colors[status] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
        );
    };

    // 署名ステータスのラベルを取得
    const getSignatureStatusLabel = (status) => {
        const labels = {
            pending: "署名待ち",
            user_signed: "ユーザー署名済み",
            fully_signed: "完全署名",
            rejected: "却下",
        };
        return labels[status] || status;
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>契約一覧 ({contracts.total}件)</CardTitle>
            </CardHeader>
            <CardBody>
                <Table>
                    <THead>
                        <Tr hover={false}>
                            <Th>契約番号</Th>
                            <Th>タイトル</Th>
                            <Th>クライアント</Th>
                            <Th>タイプ</Th>
                            <Th>金額</Th>
                            <Th>契約期間</Th>
                            <Th>ステータス</Th>
                            <Th>署名ステータス</Th>
                            <Th className="text-right">アクション</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {contracts.data.map((contract) => (
                            <Tr key={contract.id}>
                                <Td>
                                    <Link
                                        href={route(
                                            "admin.contract.show",
                                            contract.id,
                                        )}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        {contract.contract_number ||
                                            contract.id.substring(0, 8)}
                                    </Link>
                                </Td>
                                <Td>
                                    <div className="font-medium text-gray-900">
                                        {contract.title}
                                    </div>
                                    {contract.description && (
                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                            {contract.description}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <div className="text-gray-900">
                                        {contract.user?.profile?.full_name ||
                                            contract.user?.email}
                                    </div>
                                    {contract.company && (
                                        <div className="text-sm text-gray-500">
                                            {contract.company.name}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <Badge className="bg-purple-100 text-purple-800">
                                        {getTypeLabel(contract.type)}
                                    </Badge>
                                </Td>
                                <Td>
                                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                                        {formatAmount(
                                            contract.current_version
                                                ?.total_amount,
                                        )}
                                    </div>
                                    {contract.current_version?.tax_rate > 0 && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            (税率:{" "}
                                            {contract.current_version.tax_rate}
                                            %)
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <div className="text-sm">
                                        <div>
                                            {formatDate(contract.start_date)}
                                        </div>
                                        {contract.end_date && (
                                            <div className="text-gray-500">
                                                ～{" "}
                                                {formatDate(contract.end_date)}
                                            </div>
                                        )}
                                        {contract.auto_renewal && (
                                            <div className="text-xs text-blue-600 mt-1">
                                                自動更新
                                            </div>
                                        )}
                                    </div>
                                </Td>
                                <Td>
                                    <Badge
                                        className={getContractStatusColor(
                                            contract.status,
                                        )}
                                    >
                                        {getStatusLabel(contract.status)}
                                    </Badge>
                                </Td>
                                <Td>
                                    {contract.signature_status && (
                                        <Badge
                                            className={getSignatureStatusColor(
                                                contract.signature_status,
                                            )}
                                        >
                                            {getSignatureStatusLabel(
                                                contract.signature_status,
                                            )}
                                        </Badge>
                                    )}
                                </Td>
                                <Td>
                                    <div className="flex justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.contract.show",
                                                contract.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="詳細"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.contract.pdf",
                                                contract.id,
                                            )}
                                            className="text-gray-600 hover:text-gray-800"
                                            title="PDFダウンロード"
                                        >
                                            <DocumentArrowDownIcon className="h-5 w-5" />
                                        </Link>

                                        {/* 署名完了 & 未承認 → 承認ボタン */}
                                        {contract.signature_status ===
                                            "fully_signed" &&
                                            contract.status ===
                                                "pending_signature" && (
                                                <button
                                                    onClick={() =>
                                                        onApprove &&
                                                        onApprove(contract)
                                                    }
                                                    className="text-green-600 hover:text-green-800"
                                                    title="契約を承認"
                                                >
                                                    <CheckCircleIcon className="h-5 w-5" />
                                                </button>
                                            )}

                                        {/* 署名待ち → リマインダー送信ボタン */}
                                        {contract.signature_status ===
                                            "pending" && (
                                            <button
                                                onClick={() =>
                                                    onReminder &&
                                                    onReminder(contract)
                                                }
                                                className="text-orange-600 hover:text-orange-800"
                                                title="署名リマインダー送信"
                                            >
                                                <DocumentTextIcon className="h-5 w-5" />
                                            </button>
                                        )}

                                        {(contract.status === "draft" ||
                                            contract.status ===
                                                "pending_signature") && (
                                            <>
                                                <Link
                                                    href={route(
                                                        "admin.contract.edit",
                                                        contract.id,
                                                    )}
                                                    className="text-yellow-600 hover:text-yellow-800"
                                                    title="編集"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        onActivate(contract)
                                                    }
                                                    className="text-green-600 hover:text-green-800"
                                                    title="有効化"
                                                >
                                                    <CheckCircleIcon className="h-5 w-5" />
                                                </button>
                                            </>
                                        )}

                                        {contract.status === "active" && (
                                            <button
                                                onClick={() =>
                                                    onCancel(contract)
                                                }
                                                className="text-orange-600 hover:text-orange-800"
                                                title="キャンセル"
                                            >
                                                <XCircleIcon className="h-5 w-5" />
                                            </button>
                                        )}

                                        {contract.documents &&
                                            contract.documents.length > 0 && (
                                                <span
                                                    className="text-gray-600"
                                                    title={`${contract.documents.length}件の書類`}
                                                >
                                                    <DocumentTextIcon className="h-5 w-5" />
                                                </span>
                                            )}

                                        {contract.status === "draft" && (
                                            <button
                                                onClick={() =>
                                                    onDelete(contract)
                                                }
                                                className="text-red-600 hover:text-red-800"
                                                title="削除"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </CardBody>
        </Card>
    );
};

export default ContractsTable;
