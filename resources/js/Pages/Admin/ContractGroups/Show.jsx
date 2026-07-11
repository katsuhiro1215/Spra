import React, { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { TextButton, PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { ConfirmAlert } from "@/Components/Alerts";
import { FlashMessage } from "@/Components/Notifications";
import {
    ArrowLeftIcon,
    EyeIcon,
    XMarkIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

const STATUS_LABELS = {
    active: "すべて有効",
    partially_active: "一部有効",
    completed: "完了",
    cancelled: "キャンセル",
};

const CONTRACT_STATUS_LABELS = {
    draft: "下書き",
    pending_signature: "署名待ち",
    active: "契約中",
    suspended: "一時停止",
    completed: "完了",
    cancelled: "キャンセル",
};

const formatAmount = (amount) =>
    new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(amount || 0);

export default function Show({ group, stats, availableContracts = [] }) {
    const [showSendConfirm, setShowSendConfirm] = useState(false);
    const [removeTarget, setRemoveTarget] = useState(null);
    const { data, setData, post, processing, reset } = useForm({
        contract_id: "",
    });

    const handleSend = () => setShowSendConfirm(true);

    const handleConfirmSend = () => {
        router.post(
            route("admin.contract-group.send", group.id),
            {},
            { onFinish: () => setShowSendConfirm(false) },
        );
    };

    const handleAddContract = (e) => {
        e.preventDefault();
        if (!data.contract_id) return;
        post(route("admin.contract-group.add-contract", group.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const handleConfirmRemove = () => {
        if (removeTarget) {
            router.delete(
                route("admin.contract-group.remove-contract", [
                    group.id,
                    removeTarget.id,
                ]),
                { onFinish: () => setRemoveTarget(null) },
            );
        }
    };

    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contract-group.index"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "契約一覧", href: route("admin.contract.index") },
        { label: "契約グループ", href: route("admin.contract-group.index") },
        { label: group.group_number, href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`契約グループ: ${group.title}`}
                    description={group.group_number}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`契約グループ: ${group.title}`} />
            <FlashMessage />

            <ConfirmAlert
                isOpen={showSendConfirm}
                onClose={() => setShowSendConfirm(false)}
                onCancel={() => setShowSendConfirm(false)}
                onConfirm={handleConfirmSend}
                title="グループ内の全契約書を送信しますか？"
                message={`「${group.title}」に含まれる${group.contracts?.length ?? 0}件の契約書をまとめてクライアントに送信します。`}
                confirmText="送信する"
                cancelText="キャンセル"
            />

            <ConfirmAlert
                isOpen={!!removeTarget}
                onClose={() => setRemoveTarget(null)}
                onCancel={() => setRemoveTarget(null)}
                onConfirm={handleConfirmRemove}
                title="グループから契約書を除外しますか？"
                message={`「${removeTarget?.title}」をこのグループから除外します。契約書自体は削除されません。`}
                confirmText="除外する"
                cancelText="キャンセル"
                type="warning"
            />

            <div className="max-w-6xl space-y-6">
                {/* グループ基本情報 */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>グループ情報</CardTitle>
                            <Badge
                                variant={
                                    group.status === "active"
                                        ? "success"
                                        : group.status === "cancelled"
                                          ? "danger"
                                          : "warning"
                                }
                            >
                                {STATUS_LABELS[group.status] || group.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    クライアント
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {group.user?.profile?.full_name ||
                                        group.user?.email}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    説明
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {group.description || "-"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    作成者
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {group.creator?.profile?.full_name ||
                                        group.creator?.email ||
                                        "-"}
                                </dd>
                            </div>
                        </dl>
                    </CardBody>
                </Card>

                {/* 統計情報 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardBody className="text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {stats.total_contracts}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                契約数
                            </div>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody className="text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {stats.signed_contracts}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                署名済み
                            </div>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody className="text-center">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {stats.pending_contracts}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                署名待ち
                            </div>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody className="text-center">
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {formatAmount(stats.total_amount)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                合計金額
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* 配下の契約一覧 */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>
                                配下の契約書 ({group.contracts?.length ?? 0}件)
                            </CardTitle>
                            <PrimaryButton
                                size="sm"
                                onClick={handleSend}
                                disabled={
                                    !group.contracts ||
                                    group.contracts.length === 0
                                }
                            >
                                <PaperAirplaneIcon className="h-4 w-4 mr-1" />
                                グループ内を一括送信
                            </PrimaryButton>
                        </div>
                    </CardHeader>
                    <Table>
                        <THead>
                            <Tr hover={false}>
                                <Th>契約番号</Th>
                                <Th>タイトル</Th>
                                <Th>金額</Th>
                                <Th>ステータス</Th>
                                <Th className="text-right">操作</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {group.contracts && group.contracts.length > 0 ? (
                                group.contracts.map((contract) => (
                                    <Tr key={contract.id}>
                                        <Td>
                                            <span className="font-mono text-sm">
                                                {contract.contract_number}
                                            </span>
                                        </Td>
                                        <Td>{contract.title}</Td>
                                        <Td>
                                            {formatAmount(
                                                contract.current_version
                                                    ?.total_amount,
                                            )}
                                        </Td>
                                        <Td>
                                            <Badge variant="secondary" size="xs">
                                                {CONTRACT_STATUS_LABELS[
                                                    contract.status
                                                ] || contract.status}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <div className="flex justify-end items-center gap-1">
                                                <TextButton
                                                    href={route(
                                                        "admin.contract.show",
                                                        contract.id,
                                                    )}
                                                    variant="info"
                                                    size="sm"
                                                    title="詳細"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </TextButton>
                                                <TextButton
                                                    variant="danger"
                                                    size="sm"
                                                    title="グループから除外"
                                                    onClick={() =>
                                                        setRemoveTarget(
                                                            contract,
                                                        )
                                                    }
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </TextButton>
                                            </div>
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td colSpan="5" className="text-center py-4">
                                        契約書がありません
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                </Card>

                {/* 契約を追加 */}
                <Card>
                    <CardHeader>
                        <CardTitle>グループに契約を追加</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {availableContracts.length === 0 ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                追加できる下書き契約（同じクライアント・未グループ）はありません。
                            </p>
                        ) : (
                            <form
                                onSubmit={handleAddContract}
                                className="flex flex-col sm:flex-row gap-3"
                            >
                                <select
                                    value={data.contract_id}
                                    onChange={(e) =>
                                        setData("contract_id", e.target.value)
                                    }
                                    className="flex-1 rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-sm"
                                >
                                    <option value="">
                                        追加する契約を選択...
                                    </option>
                                    {availableContracts.map((contract) => (
                                        <option
                                            key={contract.id}
                                            value={contract.id}
                                        >
                                            {contract.contract_number} -{" "}
                                            {contract.title}
                                        </option>
                                    ))}
                                </select>
                                <SecondaryButton
                                    type="submit"
                                    disabled={processing || !data.contract_id}
                                >
                                    追加
                                </SecondaryButton>
                            </form>
                        )}
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
