import React from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { Card, CardHeader, CardTitle } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { TextButton, DeleteButton, CreateButton } from "@/Components/Buttons";
import { FlashMessage } from "@/Components/Notifications";
import DeleteAlert from "@/Components/Alerts/DeleteAlert";
import { PlusIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";

const STATUS_LABELS = {
    active: "すべて有効",
    partially_active: "一部有効",
    completed: "完了",
    cancelled: "キャンセル",
};

const STATUS_VARIANTS = {
    active: "success",
    partially_active: "warning",
    completed: "info",
    cancelled: "secondary",
};

export default function Index({ groups }) {
    const [deleteTarget, setDeleteTarget] = React.useState(null);

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            router.delete(
                route("admin.contract-group.destroy", deleteTarget.id),
                { onFinish: () => setDeleteTarget(null) },
            );
        }
    };

    const headerActions = [
        {
            label: "グループを作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.contract-group.create"),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "契約一覧", href: route("admin.contract.index") },
        { label: "契約グループ", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="契約グループ一覧"
                    description="複数の契約書をまとめて管理するグループの一覧です"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="契約グループ一覧" />
            <FlashMessage />

            <DeleteAlert
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                itemName={deleteTarget?.title}
                customMessage="このグループを削除しますか？配下の契約書自体は削除されず、グループの紐付けのみ解除されます。"
            />

            <div className="w-full space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>契約グループ ({groups.total}件)</CardTitle>
                    </CardHeader>
                    <Table>
                        <THead>
                            <Tr hover={false}>
                                <Th>グループ番号</Th>
                                <Th>タイトル</Th>
                                <Th>クライアント</Th>
                                <Th>契約数</Th>
                                <Th>ステータス</Th>
                                <Th className="text-right">操作</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {groups.data && groups.data.length > 0 ? (
                                groups.data.map((group) => (
                                    <Tr key={group.id}>
                                        <Td>
                                            <span className="font-mono text-sm text-slate-900 dark:text-slate-100">
                                                {group.group_number}
                                            </span>
                                        </Td>
                                        <Td>
                                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {group.title}
                                            </div>
                                        </Td>
                                        <Td>
                                            <div className="text-sm text-slate-700 dark:text-slate-300">
                                                {group.user?.profile
                                                    ?.full_name ||
                                                    group.user?.email ||
                                                    "-"}
                                            </div>
                                        </Td>
                                        <Td>
                                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                                {group.contracts?.length ?? 0}
                                                件
                                            </span>
                                        </Td>
                                        <Td>
                                            <Badge
                                                variant={
                                                    STATUS_VARIANTS[
                                                        group.status
                                                    ] || "secondary"
                                                }
                                                size="xs"
                                            >
                                                {STATUS_LABELS[
                                                    group.status
                                                ] || group.status}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <div className="flex justify-end items-center gap-1">
                                                <TextButton
                                                    href={route(
                                                        "admin.contract-group.show",
                                                        group.id,
                                                    )}
                                                    variant="info"
                                                    size="sm"
                                                    title="詳細"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </TextButton>
                                                <DeleteButton
                                                    onClick={() =>
                                                        setDeleteTarget(group)
                                                    }
                                                    title="削除"
                                                    size="sm"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </DeleteButton>
                                            </div>
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td colSpan="6" className="text-center py-8">
                                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                                            契約グループはまだありません。
                                        </p>
                                        <CreateButton
                                            href={route(
                                                "admin.contract-group.create",
                                            )}
                                        >
                                            最初のグループを作成
                                        </CreateButton>
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                </Card>
                {groups.links && <Pagination paginationData={groups} />}
            </div>
        </AdminAuthenticatedLayout>
    );
}
