import React from "react";
import { Card, CardTitle, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    NumberInput,
    Checkbox,
} from "@/Components/Forms";

const ServiceItemForm = ({
    data,
    setData,
    errors,
    statuses,
    itemTypes,
    services,
    servicePlans,
    mode = "create",
}) => {
    // item_typeがaddonの場合、service_plan_idを自動的にNULLに設定
    const handleItemTypeChange = (e) => {
        const type = e.target.value;
        setData("item_type", type);

        if (type === "addon") {
            setData("service_plan_id", "");
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 項目名 */}
                        <div className="md:col-span-2">
                            <FormGroup
                                label="項目名"
                                required
                                error={errors.name}
                            >
                                <TextInput
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="例: 追加ページ制作"
                                />
                            </FormGroup>
                        </div>

                        {/* サービス選択 */}
                        <FormGroup
                            label="サービス"
                            required
                            error={errors.service_id}
                        >
                            <SelectInput
                                value={data.service_id}
                                onChange={(e) =>
                                    setData("service_id", e.target.value)
                                }
                                options={services.map((service) => ({
                                    value: service.id,
                                    label: service.name,
                                }))}
                                placeholder="選択してください"
                            />
                        </FormGroup>

                        {/* プラン選択 */}
                        <FormGroup
                            label="サービスプラン"
                            hint="addon選択時は不要"
                            error={errors.service_plan_id}
                        >
                            <SelectInput
                                value={data.service_plan_id}
                                onChange={(e) =>
                                    setData("service_plan_id", e.target.value)
                                }
                                options={servicePlans.map((plan) => ({
                                    value: plan.id,
                                    label: plan.name,
                                }))}
                                placeholder="選択なし"
                                disabled={data.item_type === "addon"}
                            />
                        </FormGroup>

                        {/* 項目タイプ */}
                        <FormGroup
                            label="項目タイプ"
                            required
                            error={errors.item_type}
                        >
                            <SelectInput
                                value={data.item_type}
                                onChange={handleItemTypeChange}
                                options={itemTypes.map((type) => ({
                                    value: type.value,
                                    label: type.label,
                                }))}
                            />
                        </FormGroup>

                        {/* ステータス */}
                        <FormGroup
                            label="ステータス"
                            required
                            error={errors.status}
                        >
                            <SelectInput
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                options={statuses.map((status) => ({
                                    value: status.value,
                                    label: status.label,
                                }))}
                            />
                        </FormGroup>
                    </div>

                    <div className="mt-6">
                        {/* 説明 */}
                        <FormGroup label="説明" error={errors.description}>
                            <TextArea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows={4}
                                placeholder="項目の詳細説明"
                            />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>料金・納期設定</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 価格 */}
                        <FormGroup
                            label="価格 (円)"
                            required
                            error={errors.price}
                        >
                            <NumberInput
                                value={data.price}
                                onChange={(value) => setData("price", value)}
                                min={0}
                                step={100}
                                placeholder="10000"
                            />
                        </FormGroup>

                        {/* 作業日数目安 */}
                        <FormGroup
                            label="作業日数目安 (日)"
                            error={errors.estimated_days}
                        >
                            <NumberInput
                                value={data.estimated_days}
                                onChange={(value) =>
                                    setData("estimated_days", value)
                                }
                                min={0}
                                step={1}
                                placeholder="5"
                            />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>表示設定</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 表示順 */}
                        <FormGroup label="表示順" error={errors.sort_order}>
                            <NumberInput
                                value={data.sort_order}
                                onChange={(value) =>
                                    setData("sort_order", value)
                                }
                                min={0}
                                step={1}
                                placeholder="0"
                            />
                        </FormGroup>

                        {/* 必須項目 */}
                        <div>
                            <label className="flex items-center mt-6">
                                <Checkbox
                                    checked={data.is_required}
                                    onChange={(e) =>
                                        setData("is_required", e.target.checked)
                                    }
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                    必須項目
                                </span>
                            </label>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default ServiceItemForm;
