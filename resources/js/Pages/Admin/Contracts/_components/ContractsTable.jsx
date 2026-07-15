import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    DocumentTextIcon,
    DocumentArrowDownIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

const ORANGE_TEXT = `
    bg-transparent text-orange-600
    hover:text-orange-900 hover:bg-orange-50
    focus:ring-orange-500
    dark:text-orange-400 dark:hover:text-orange-300 dark:hover:bg-orange-900/20
`
    .trim()
    .replace(/\s+/g, " ");

const ContractsTable = ({
    contracts,
    onDelete,
    onActivate,
    onCancel,
    onApprove,
    onReminder,
}) => {
    // ステータスのバッジバリアントを取得
    const getContractStatusVariant = (status) => {
        const variants = {
            draft: "secondary",
            pending_signature: "warning",
            active: "success",
            suspended: "orange",
            completed: "info",
            cancelled: "danger",
        };
        return variants[status] || "secondary";
    };

    // 署名ステータスのバッジバリアントを取得
    const getSignatureStatusVariant = (status) => {
        const variants = {
            pending: "warning",
            user_signed: "info",
            fully_signed: "success",
            rejected: "danger",
        };
        return variants[status] || "secondary";
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
                                    {contract.description && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                            {contract.description}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <div className="text-gray-900 dark:text-gray-100">
                                        {contract.user?.profile?.full_name ||
                                            contract.user?.email}
                                    </div>
                                    {contract.company && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {contract.company.name}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    <Badge variant="purple">
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
                                        <div className="text-gray-900 dark:text-gray-100">
                                            {formatDate(contract.start_date)}
                                        </div>
                                        {contract.end_date && (
                                            <div className="text-gray-500 dark:text-gray-400">
                                                ～{" "}
                                                {formatDate(contract.end_date)}
                                            </div>
                                        )}
                                        {contract.auto_renewal && (
                                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                自動更新
                                            </div>
                                        )}
                                    </div>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={getContractStatusVariant(
                                            contract.status,
                                        )}
                                    >
                                        {getStatusLabel(contract.status)}
                                    </Badge>
                                </Td>
                                <Td>
                                    {contract.signature_status && (
                                        <Badge
                                            variant={getSignatureStatusVariant(
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
                                    <div className="flex justify-end items-center gap-1">
                                        <IconButton
                                            variant="info-text"
                                            icon={EyeIcon}
                                            size="lg"
                                            href={route(
                                                "admin.contract.show",
                                                contract.id,
                                            )}
                                            title="詳細"
                                        />
                                        <IconButton
                                            variant="text"
                                            icon={DocumentArrowDownIcon}
                                            size="lg"
                                            href={route(
                                                "admin.contract.pdf",
                                                contract.id,
                                            )}
                                            title="PDFダウンロード"
                                        />

                                        {/* 署名完了 & 未承認 → 承認ボタン */}
                                        {contract.signature_status ===
                                            "fully_signed" &&
                                            contract.status ===
                                                "pending_signature" && (
                                                <IconButton
                                                    variant="success-text"
                                                    icon={CheckCircleIcon}
                                                    size="lg"
                                                    onClick={() =>
                                                        onApprove &&
                                                        onApprove(contract)
                                                    }
                                                    title="契約を承認"
                                                />
                                            )}

                                        {/* 署名待ち → リマインダー送信ボタン */}
                                        {contract.signature_status ===
                                            "pending" && (
                                            <IconButton
                                                colorClasses={ORANGE_TEXT}
                                                icon={DocumentTextIcon}
                                                size="lg"
                                                onClick={() =>
                                                    onReminder &&
                                                    onReminder(contract)
                                                }
                                                title="署名リマインダー送信"
                                            />
                                        )}

                                        {(contract.status === "draft" ||
                                            contract.status ===
                                                "pending_signature") && (
                                            <>
                                                <IconButton
                                                    variant="warning-text"
                                                    icon={PencilIcon}
                                                    size="lg"
                                                    href={route(
                                                        "admin.contract.edit",
                                                        contract.id,
                                                    )}
                                                    title="編集"
                                                />
                                                <IconButton
                                                    variant="success-text"
                                                    icon={CheckCircleIcon}
                                                    size="lg"
                                                    onClick={() =>
                                                        onActivate(contract)
                                                    }
                                                    title="有効化"
                                                />
                                            </>
                                        )}

                                        {contract.status === "active" && (
                                            <IconButton
                                                colorClasses={ORANGE_TEXT}
                                                icon={XCircleIcon}
                                                size="lg"
                                                onClick={() =>
                                                    onCancel(contract)
                                                }
                                                title="キャンセル"
                                            />
                                        )}

                                        {contract.documents &&
                                            contract.documents.length > 0 && (
                                                <span
                                                    className="p-2 text-gray-600 dark:text-gray-400"
                                                    title={`${contract.documents.length}件の書類`}
                                                >
                                                    <DocumentTextIcon className="h-5 w-5" />
                                                </span>
                                            )}

                                        {contract.status === "draft" && (
                                            <IconButton
                                                variant="danger-text"
                                                icon={TrashIcon}
                                                size="lg"
                                                onClick={() =>
                                                    onDelete(contract)
                                                }
                                                title="削除"
                                            />
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
