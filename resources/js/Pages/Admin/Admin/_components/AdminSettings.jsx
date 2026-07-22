import React from "react";
import { useForm } from "@inertiajs/react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Checkbox } from "@/Components/Forms";
import { PrimaryButton } from "@/Components/Buttons";
import { CheckIcon } from "@heroicons/react/24/outline";
import { getRoleBadge } from "@/Constants/Badges";

export default function AdminSettings({ admin, permissionOverride }) {
    return (
        <div className="space-y-6">
            {/* 設定情報 */}
            <Card>
                <CardHeader title="設定情報" />
            </Card>

            {/* 個別権限制限 */}
            {permissionOverride ? (
                <PermissionOverrideCard
                    admin={admin}
                    permissionOverride={permissionOverride}
                />
            ) : (
                <Card>
                    <CardHeader title="権限制限" />
                    <CardBody>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            オーナー・スーパー管理者ロールには個別の権限制限をかけられません。
                        </p>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}

function PermissionOverrideCard({ admin, permissionOverride }) {
    const { permissionGroups, restrictedPermissionIds } = permissionOverride;
    const { data, setData, put, processing } = useForm({
        restricted_permission_ids: restrictedPermissionIds,
    });

    const toggle = (permissionId) => {
        const current = data.restricted_permission_ids;
        setData(
            "restricted_permission_ids",
            current.includes(permissionId)
                ? current.filter((id) => id !== permissionId)
                : [...current, permissionId],
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.permissionOverrides.update", admin.id));
    };

    return (
        <Card>
            <CardHeader title="権限制限" />
            <CardBody>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    現在のロール（{getRoleBadge(admin.role).text}
                    ）が本来許可している機能のうち、この管理者個人に限り利用を制限できます。チェックを入れた項目が制限（利用不可）になります。
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-100 dark:divide-gray-800">
                        {permissionGroups.map((group) => (
                            <div key={group.group} className="p-3">
                                <div className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-2">
                                    {group.group}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {group.permissions.map((perm) => (
                                        <Checkbox
                                            key={perm.id}
                                            id={`restrict-${perm.id}`}
                                            label={perm.actionLabel}
                                            checked={data.restricted_permission_ids.includes(
                                                perm.id,
                                            )}
                                            onChange={() => toggle(perm.id)}
                                            disabled={processing}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                        {permissionGroups.length === 0 && (
                            <p className="p-4 text-sm text-gray-400">
                                このロールに割り当てられている権限がありません。
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <PrimaryButton type="submit" disabled={processing}>
                            <CheckIcon className="h-4 w-4 mr-2" />
                            制限を保存
                        </PrimaryButton>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
}
