import React from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    Toggle,
} from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";

const CampaignForm = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    discountTypes = {},
    servicePlans = [],
    usedCount = 0,
    isEdit = false,
}) => {
    const discountTypeOptions = Object.entries(discountTypes).map(
        ([value, label]) => ({ value, label }),
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (typeof onSubmit === "function") {
            onSubmit();
        }
    };

    const selectedPlanIds = data.service_plan_ids || [];

    const togglePlan = (planId) => {
        setData(
            "service_plan_ids",
            selectedPlanIds.includes(planId)
                ? selectedPlanIds.filter((id) => id !== planId)
                : [...selectedPlanIds, planId],
        );
    };

    // 同名プランがサービス間で重複するため、サービスごとにグルーピングして表示する
    const servicePlanGroups = Object.values(
        servicePlans.reduce((groups, plan) => {
            const key = plan.service_id || "unknown";
            if (!groups[key]) {
                groups[key] = {
                    serviceName: plan.service_name || "未分類",
                    plans: [],
                };
            }
            groups[key].plans.push(plan);
            return groups;
        }, {}),
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    {/* 基本情報 */}
                    <Card>
                        <CardHeader>基本情報</CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                <FormGroup
                                    label="キャンペーン名"
                                    htmlFor="name"
                                    required
                                    error={errors.name}
                                >
                                    <TextInput
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        disabled={processing}
                                        placeholder="夏の30%オフキャンペーン"
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="キャンペーンコード"
                                    htmlFor="code"
                                    required
                                    error={errors.code}
                                    helpText="見積もりに紐付ける識別コード。半角英数字、ハイフン、アンダースコアのみ"
                                >
                                    <TextInput
                                        id="code"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData("code", e.target.value)
                                        }
                                        disabled={processing}
                                        placeholder="SUMMER2026"
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="説明"
                                    htmlFor="description"
                                    error={errors.description}
                                >
                                    <TextArea
                                        id="description"
                                        value={data.description || ""}
                                        onChange={(e) =>
                                            setData("description", e.target.value)
                                        }
                                        disabled={processing}
                                        rows={3}
                                        placeholder="このキャンペーンの説明を入力..."
                                    />
                                </FormGroup>
                            </div>
                        </CardBody>
                    </Card>

                    {/* 割引設定 */}
                    <Card>
                        <CardHeader>割引設定</CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormGroup
                                        label="割引種別"
                                        htmlFor="discount_type"
                                        required
                                        error={errors.discount_type}
                                    >
                                        <SelectInput
                                            id="discount_type"
                                            value={data.discount_type}
                                            onChange={(e) =>
                                                setData(
                                                    "discount_type",
                                                    e.target.value,
                                                )
                                            }
                                            disabled={processing}
                                            options={discountTypeOptions}
                                        />
                                    </FormGroup>

                                    <FormGroup
                                        label={
                                            data.discount_type === "fixed"
                                                ? "割引額（円）"
                                                : "割引率（%）"
                                        }
                                        htmlFor="discount_value"
                                        required
                                        error={errors.discount_value}
                                    >
                                        <TextInput
                                            id="discount_value"
                                            type="number"
                                            min="0"
                                            max={
                                                data.discount_type === "percentage"
                                                    ? "100"
                                                    : undefined
                                            }
                                            value={data.discount_value}
                                            onChange={(e) =>
                                                setData(
                                                    "discount_value",
                                                    e.target.value,
                                                )
                                            }
                                            disabled={processing}
                                        />
                                    </FormGroup>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormGroup
                                        label="開始日時"
                                        htmlFor="starts_at"
                                        required
                                        error={errors.starts_at}
                                    >
                                        <TextInput
                                            id="starts_at"
                                            type="datetime-local"
                                            value={data.starts_at || ""}
                                            onChange={(e) =>
                                                setData("starts_at", e.target.value)
                                            }
                                            disabled={processing}
                                        />
                                    </FormGroup>

                                    <FormGroup
                                        label="終了日時"
                                        htmlFor="ends_at"
                                        required
                                        error={errors.ends_at}
                                    >
                                        <TextInput
                                            id="ends_at"
                                            type="datetime-local"
                                            value={data.ends_at || ""}
                                            onChange={(e) =>
                                                setData("ends_at", e.target.value)
                                            }
                                            disabled={processing}
                                        />
                                    </FormGroup>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            有効
                                        </label>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            期間内でも一時的に停止したい場合はオフにします
                                        </p>
                                    </div>
                                    <Toggle
                                        enabled={data.is_active || false}
                                        onChange={(value) =>
                                            setData("is_active", value)
                                        }
                                        disabled={processing}
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
                {/* 適用条件 */}
                <Card>
                    <CardHeader>適用条件</CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            <FormGroup
                                label="適用可能件数の上限"
                                htmlFor="usage_limit"
                                error={errors.usage_limit}
                                helpText="成約（契約有効化）ごとに1件消費されます。空欄の場合は無制限です"
                            >
                                <TextInput
                                    id="usage_limit"
                                    type="number"
                                    min="1"
                                    value={data.usage_limit ?? ""}
                                    onChange={(e) =>
                                        setData(
                                            "usage_limit",
                                            e.target.value === ""
                                                ? ""
                                                : e.target.value,
                                        )
                                    }
                                    disabled={processing}
                                    placeholder="例: 100"
                                />
                            </FormGroup>

                            {isEdit && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    現在の使用件数: {usedCount}件
                                    {data.usage_limit
                                        ? ` / ${data.usage_limit}件`
                                        : ""}
                                </p>
                            )}

                            <FormGroup
                                label="対象プラン"
                                htmlFor="service_plan_ids"
                                error={errors.service_plan_ids}
                                helpText="1つも選択しない場合は全プランが対象になります。選択すると、見積もりで対象プランが選ばれている場合のみこのキャンペーンを適用できます"
                            >
                                {servicePlans.length === 0 ? (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        利用可能なプランがありません
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {servicePlanGroups.map((group) => (
                                            <div key={group.serviceName}>
                                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                                    {group.serviceName}
                                                </p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {group.plans.map((plan) => (
                                                        <label
                                                            key={plan.id}
                                                            className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
                                                                checked={selectedPlanIds.includes(
                                                                    plan.id,
                                                                )}
                                                                onChange={() =>
                                                                    togglePlan(
                                                                        plan.id,
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                            />
                                                            {plan.name}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </FormGroup>
                        </div>
                    </CardBody>
                </Card>
            </div>
            {/* アクションボタン */}
            <div className="flex items-center justify-end gap-3">
                <SecondaryButton
                    type="button"
                    href={cancelRoute}
                    disabled={processing}
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    キャンセル
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={processing}>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    {isEdit ? "更新" : "作成"}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default CampaignForm;
