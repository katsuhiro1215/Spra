import React, { useMemo, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { TextInput, Checkbox } from "@/Components/Forms";
import { PrimaryButton } from "@/Components/Buttons";
// Icons
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

const EDITABLE_ROLES = ["admin", "editor"];

export default function Index({ permissionGroups, roles }) {
    const [search, setSearch] = useState("");

    const { data, setData, put, processing } = useForm({
        admin: roles.admin?.permissionIds ?? [],
        editor: roles.editor?.permissionIds ?? [],
    });

    const roleOrder = ["owner", "super_admin", "admin", "editor"];

    const filteredGroups = useMemo(() => {
        if (!search.trim()) return permissionGroups;
        const keyword = search.trim().toLowerCase();
        return permissionGroups
            .map((g) => ({
                ...g,
                permissions: g.permissions.filter(
                    (p) =>
                        g.group.toLowerCase().includes(keyword) ||
                        p.name.toLowerCase().includes(keyword) ||
                        (p.actionLabel || "").toLowerCase().includes(keyword),
                ),
            }))
            .filter((g) => g.permissions.length > 0);
    }, [permissionGroups, search]);

    const toggle = (role, permissionId) => {
        const current = data[role];
        setData(
            role,
            current.includes(permissionId)
                ? current.filter((id) => id !== permissionId)
                : [...current, permissionId],
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.permissions.update"));
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.permissions.title}
                    description={PageConfig.permissions.description}
                    breadcrumbs={PageConfig.permissions.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.permissions.documentTitle} />

            <FlashMessage />

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                            <span>ロール別 権限マトリクス</span>
                            <div className="relative w-72">
                                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <TextInput
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="画面名・権限名で検索..."
                                    className="pl-9 w-full"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            オーナー・スーパー管理者は常に全権限を保持します（変更不可）。管理者・編集者の権限のみここで調整できます。
                        </p>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
                                        <th className="py-2 pr-4">画面 / 操作</th>
                                        {roleOrder.map((role) => (
                                            <th
                                                key={role}
                                                className="py-2 px-3 text-center whitespace-nowrap"
                                            >
                                                {roles[role]?.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredGroups.map((group) => (
                                        <React.Fragment key={group.group}>
                                            <tr className="bg-gray-50 dark:bg-gray-800/60">
                                                <td
                                                    colSpan={
                                                        roleOrder.length + 1
                                                    }
                                                    className="py-1.5 px-2 font-semibold text-gray-700 dark:text-gray-200"
                                                >
                                                    {group.group}
                                                </td>
                                            </tr>
                                            {group.permissions.map((perm) => (
                                                <tr
                                                    key={perm.id}
                                                    className="border-b border-gray-100 dark:border-gray-800"
                                                >
                                                    <td className="py-2 pr-4">
                                                        <div className="text-gray-800 dark:text-gray-100">
                                                            {perm.actionLabel}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {perm.name}
                                                        </div>
                                                    </td>
                                                    {roleOrder.map((role) => (
                                                        <td
                                                            key={role}
                                                            className="py-2 px-3 text-center"
                                                        >
                                                            {EDITABLE_ROLES.includes(
                                                                role,
                                                            ) ? (
                                                                <Checkbox
                                                                    checked={data[
                                                                        role
                                                                    ].includes(
                                                                        perm.id,
                                                                    )}
                                                                    onChange={() =>
                                                                        toggle(
                                                                            role,
                                                                            perm.id,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                />
                                                            ) : (
                                                                <Checkbox
                                                                    checked
                                                                    disabled
                                                                />
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                    {filteredGroups.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={roleOrder.length + 1}
                                                className="py-6 text-center text-gray-400"
                                            >
                                                該当する権限が見つかりませんでした。
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>

                <div className="flex items-center justify-end">
                    <PrimaryButton type="submit" disabled={processing}>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        保存
                    </PrimaryButton>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
