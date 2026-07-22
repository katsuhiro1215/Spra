import React from "react";
import { useForm } from "@inertiajs/react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Checkbox, FormGroup, SelectInput, TextInput } from "@/Components/Forms";
import { PrimaryButton } from "@/Components/Buttons";
import { CheckIcon } from "@heroicons/react/24/outline";
import { getRoleBadge } from "@/Constants/Badges";

export default function AdminSettings({
    admin,
    permissionOverride,
    employmentTypes = [],
    payTypes = [],
}) {
    return (
        <div className="space-y-6">
            {/* 設定情報 */}
            <Card>
                <CardHeader title="設定情報" />
            </Card>

            {/* 雇用条件・給与 */}
            <EmploymentCard
                admin={admin}
                employmentTypes={employmentTypes}
                payTypes={payTypes}
            />

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

function EmploymentCard({ admin, employmentTypes, payTypes }) {
    const employment = admin.employment;
    const { data, setData, put, processing, errors } = useForm({
        employment_type: employment?.employment_type || "full_time",
        pay_type: employment?.pay_type || "monthly",
        base_salary: employment?.base_salary || "",
        hourly_wage: employment?.hourly_wage || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.employment.update", admin.id));
    };

    return (
        <Card>
            <CardHeader title="雇用条件・給与" />
            <CardBody>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    給与計算（勤怠管理から算出）に使用されます。税・社会保険料の控除には対応していません。
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormGroup label="雇用形態" htmlFor="employment_type">
                            <SelectInput
                                id="employment_type"
                                value={data.employment_type}
                                onChange={(e) =>
                                    setData(
                                        "employment_type",
                                        e.target.value,
                                    )
                                }
                                options={employmentTypes}
                                disabled={processing}
                            />
                        </FormGroup>
                        <FormGroup label="給与体系" htmlFor="pay_type">
                            <SelectInput
                                id="pay_type"
                                value={data.pay_type}
                                onChange={(e) =>
                                    setData("pay_type", e.target.value)
                                }
                                options={payTypes}
                                disabled={processing}
                            />
                        </FormGroup>

                        {data.pay_type === "monthly" ? (
                            <FormGroup
                                label="基本給（円）"
                                htmlFor="base_salary"
                                error={errors.base_salary}
                            >
                                <TextInput
                                    id="base_salary"
                                    type="number"
                                    min="0"
                                    value={data.base_salary}
                                    onChange={(e) =>
                                        setData(
                                            "base_salary",
                                            e.target.value,
                                        )
                                    }
                                    disabled={processing}
                                />
                            </FormGroup>
                        ) : (
                            <FormGroup
                                label="時給（円）"
                                htmlFor="hourly_wage"
                                error={errors.hourly_wage}
                            >
                                <TextInput
                                    id="hourly_wage"
                                    type="number"
                                    min="0"
                                    value={data.hourly_wage}
                                    onChange={(e) =>
                                        setData(
                                            "hourly_wage",
                                            e.target.value,
                                        )
                                    }
                                    disabled={processing}
                                />
                            </FormGroup>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <PrimaryButton type="submit" disabled={processing}>
                            <CheckIcon className="h-4 w-4 mr-2" />
                            保存
                        </PrimaryButton>
                    </div>
                </form>
            </CardBody>
        </Card>
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
