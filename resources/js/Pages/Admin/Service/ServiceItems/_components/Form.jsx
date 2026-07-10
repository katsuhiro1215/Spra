import React, { useState } from "react";
import { Card, CardTitle, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    NumberInput,
} from "@/Components/Forms";
import { StoreButton, SecondaryButton } from "@/Components/Buttons";

const ServiceItemForm = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    statuses,
    itemTypes,
    services,
    mode = "create",
}) => {
    const [autoSlug, setAutoSlug] = useState(mode === "create");

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim("-");
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setData("name", name);
        if (autoSlug && name) {
            setData("slug", generateSlug(name));
        }
    };

    const handleAutoGenerateSlug = () => {
        setAutoSlug(true);
        setData("slug", generateSlug(data.name));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    // オプション処理関数
    const getStatusOptions = () => {
        if (!statuses) return [];
        if (Array.isArray(statuses)) return statuses;
        return Object.entries(statuses).map(([key, value]) => ({
            value: key,
            label: value,
        }));
    };

    const getItemTypeOptions = () => {
        if (!itemTypes) return [];
        if (Array.isArray(itemTypes)) return itemTypes;
        return Object.entries(itemTypes).map(([key, value]) => ({
            value: key,
            label: value,
        }));
    };

    const getServiceOptions = () => {
        if (!services) return [];
        return services.map((service) => ({
            value: service.id,
            label: service.name,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報 */}
            <Card>
                <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 項目名 */}
                        <FormGroup
                            label="項目名"
                            required
                            error={errors.name}
                            className="md:col-span-2"
                        >
                            <TextInput
                                value={data.name}
                                onChange={handleNameChange}
                                placeholder="例: 追加ページ制作"
                                disabled={processing}
                            />
                        </FormGroup>

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
                                options={getServiceOptions()}
                                disabled={processing}
                            >
                                <option value="">選択してください</option>
                            </SelectInput>
                        </FormGroup>

                        {/* スラッグ */}
                        <FormGroup label="スラッグ" error={errors.slug}>
                            <div className="flex items-center gap-2">
                                <TextInput
                                    value={data.slug}
                                    onChange={(e) =>
                                        setData("slug", e.target.value)
                                    }
                                    placeholder="自動生成"
                                    disabled={processing}
                                />
                                <button
                                    type="button"
                                    onClick={handleAutoGenerateSlug}
                                    className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                    disabled={processing}
                                >
                                    自動生成
                                </button>
                            </div>
                        </FormGroup>

                        {/* 項目タイプ */}
                        <FormGroup
                            label="項目タイプ"
                            required
                            error={errors.item_type}
                        >
                            <SelectInput
                                value={data.item_type}
                                onChange={(e) =>
                                    setData("item_type", e.target.value)
                                }
                                options={getItemTypeOptions()}
                                disabled={processing}
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
                                options={getStatusOptions()}
                                disabled={processing}
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
                                disabled={processing}
                            />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            {/* 価格・納期設定 */}
            <Card>
                <CardHeader>
                    <CardTitle>価格・納期設定</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 標準価格 */}
                        <FormGroup
                            label="標準価格（円）"
                            required
                            error={errors.standard_price}
                        >
                            <NumberInput
                                value={data.standard_price}
                                onChange={(value) => setData("standard_price", value)}
                                min={0}
                                step={100}
                                placeholder="10000"
                                disabled={processing}
                            />
                        </FormGroup>

                        {/* 原価 */}
                        <FormGroup
                            label="原価（円）"
                            required
                            error={errors.internal_cost}
                        >
                            <NumberInput
                                value={data.internal_cost}
                                onChange={(value) => setData("internal_cost", value)}
                                min={0}
                                step={100}
                                placeholder="10000"
                                disabled={processing}
                            />
                        </FormGroup>

                        {/* 作業日数目安 */}
                        <FormGroup
                            label="作業日数目安（日）"
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
                                disabled={processing}
                            />
                        </FormGroup>

                        {/* 作業時間目安 */}
                        <FormGroup
                            label="作業時間目安（時間）"
                            error={errors.estimated_hours}
                        >
                            <NumberInput
                                value={data.estimated_hours}
                                onChange={(value) =>
                                    setData("estimated_hours", value)
                                }
                                min={0}
                                step={0.5}
                                placeholder="10"
                                disabled={processing}
                            />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            {/* 表示設定 */}
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
                                disabled={processing}
                            />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            {/* アクション */}
            <div className="flex items-center justify-end gap-4">
                <SecondaryButton href={cancelRoute} disabled={processing}>
                    キャンセル
                </SecondaryButton>
                <StoreButton type="submit" processing={processing}>
                    {mode === "edit" ? "更新" : "作成"}
                </StoreButton>
            </div>
        </form>
    );
};

export default ServiceItemForm;
