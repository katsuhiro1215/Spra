import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import {
    PrimaryButton,
    SecondaryButton,
    DangerButton,
} from "@/Components/Buttons";
import { FormField, FormSelect, FormTextarea } from "@/Components/Forms";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
    QUOTE_STATUS_OPTIONS,
    QUOTE_BILLING_TYPE_OPTIONS,
} from "@/Constants/SelectOptions";

export default function QuoteForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    isEdit = false,
}) {
    // ========================================
    // State
    // ========================================
    const [items, setItems] = useState(
        data.items || [
            {
                name: "",
                description: "",
                item_type: "service",
                billing_type: "one_time",
                quantity: 1,
                unit_price: 0,
                amount: 0,
                estimated_days: 0,
                sort_order: 0,
            },
        ],
    );

    // ========================================
    // Effects
    // ========================================
    // 明細の金額を自動計算
    useEffect(() => {
        const updatedItems = items.map((item) => ({
            ...item,
            amount:
                (parseFloat(item.quantity) || 0) *
                (parseFloat(item.unit_price) || 0),
        }));
        setItems(updatedItems);
        setData("items", updatedItems);
    }, [items.map((i) => `${i.quantity}-${i.unit_price}`).join(",")]);

    // 合計金額を自動計算
    useEffect(() => {
        const baseAmount = items.reduce(
            (sum, item) => sum + (parseFloat(item.amount) || 0),
            0,
        );
        const discountAmount = parseFloat(data.discount_amount) || 0;
        const taxRate = parseFloat(data.tax_rate) || 0.1;
        const taxAmount = (baseAmount - discountAmount) * taxRate;
        const totalAmount = baseAmount - discountAmount + taxAmount;

        setData((prev) => ({
            ...prev,
            base_amount: baseAmount,
            tax_amount: taxAmount,
            total_amount: totalAmount,
        }));
    }, [items, data.discount_amount, data.tax_rate]);

    // ========================================
    // Handlers
    // ========================================
    const handleAddItem = () => {
        setItems([
            ...items,
            {
                name: "",
                description: "",
                item_type: "service",
                billing_type: "one_time",
                quantity: 1,
                unit_price: 0,
                amount: 0,
                estimated_days: 0,
                sort_order: items.length,
            },
        ]);
    };

    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index] = {
            ...newItems[index],
            [field]: value,
        };
        setItems(newItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    // ========================================
    // Render - Helper Functions
    // ========================================
    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
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
                        <FormField
                            label="見積タイトル"
                            name="title"
                            value={data.title || ""}
                            onChange={(e) => setData("title", e.target.value)}
                            error={errors.title}
                            required
                        />

                        <FormSelect
                            label="ステータス"
                            name="status"
                            value={data.status || "draft"}
                            onChange={(e) => setData("status", e.target.value)}
                            error={errors.status}
                            options={QUOTE_STATUS_OPTIONS}
                            required
                        />

                        <FormField
                            label="有効期限"
                            type="date"
                            name="expires_at"
                            value={data.expires_at || ""}
                            onChange={(e) =>
                                setData("expires_at", e.target.value)
                            }
                            error={errors.expires_at}
                        />
                    </div>
                </CardBody>
            </Card>

            {/* クライアント情報 */}
            <Card>
                <CardHeader>
                    <CardTitle>クライアント情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            label="クライアント名"
                            name="client_name"
                            value={data.client_name || ""}
                            onChange={(e) =>
                                setData("client_name", e.target.value)
                            }
                            error={errors.client_name}
                            required
                        />

                        <FormField
                            label="会社名"
                            name="client_company"
                            value={data.client_company || ""}
                            onChange={(e) =>
                                setData("client_company", e.target.value)
                            }
                            error={errors.client_company}
                        />

                        <FormField
                            label="メールアドレス"
                            type="email"
                            name="client_email"
                            value={data.client_email || ""}
                            onChange={(e) =>
                                setData("client_email", e.target.value)
                            }
                            error={errors.client_email}
                            required
                        />

                        <FormField
                            label="電話番号"
                            type="tel"
                            name="client_phone"
                            value={data.client_phone || ""}
                            onChange={(e) =>
                                setData("client_phone", e.target.value)
                            }
                            error={errors.client_phone}
                        />

                        <div className="md:col-span-2">
                            <FormTextarea
                                label="住所"
                                name="client_address"
                                value={data.client_address || ""}
                                onChange={(e) =>
                                    setData("client_address", e.target.value)
                                }
                                error={errors.client_address}
                                rows={3}
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* 見積明細 */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>見積明細</CardTitle>
                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            明細を追加
                        </button>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="p-4 border border-gray-200 rounded-lg"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-sm font-medium text-gray-700">
                                        明細 #{index + 1}
                                    </h4>
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveItem(index)
                                            }
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        label="品目名"
                                        value={item.name}
                                        onChange={(e) =>
                                            handleItemChange(
                                                index,
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                        error={errors[`items.${index}.name`]}
                                        required
                                    />

                                    <FormSelect
                                        label="課金形態"
                                        value={item.billing_type}
                                        onChange={(e) =>
                                            handleItemChange(
                                                index,
                                                "billing_type",
                                                e.target.value,
                                            )
                                        }
                                        options={QUOTE_BILLING_TYPE_OPTIONS}
                                        error={
                                            errors[
                                                `items.${index}.billing_type`
                                            ]
                                        }
                                        required
                                    />

                                    <div className="md:col-span-2">
                                        <FormTextarea
                                            label="説明"
                                            value={item.description}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            rows={2}
                                        />
                                    </div>

                                    <FormField
                                        label="数量"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleItemChange(
                                                index,
                                                "quantity",
                                                e.target.value,
                                            )
                                        }
                                        error={
                                            errors[`items.${index}.quantity`]
                                        }
                                        required
                                    />

                                    <FormField
                                        label="単価"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={item.unit_price}
                                        onChange={(e) =>
                                            handleItemChange(
                                                index,
                                                "unit_price",
                                                e.target.value,
                                            )
                                        }
                                        error={
                                            errors[`items.${index}.unit_price`]
                                        }
                                        required
                                    />

                                    <FormField
                                        label="見積日数"
                                        type="number"
                                        min="0"
                                        value={item.estimated_days}
                                        onChange={(e) =>
                                            handleItemChange(
                                                index,
                                                "estimated_days",
                                                e.target.value,
                                            )
                                        }
                                    />

                                    <div className="flex items-center">
                                        <div className="w-full">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                金額
                                            </label>
                                            <div className="text-lg font-semibold text-gray-900">
                                                {formatAmount(item.amount)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 金額サマリー */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="space-y-4 max-w-md ml-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    label="値引き額"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.discount_amount || 0}
                                    onChange={(e) =>
                                        setData(
                                            "discount_amount",
                                            e.target.value,
                                        )
                                    }
                                    error={errors.discount_amount}
                                />

                                <FormField
                                    label="消費税率"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={data.tax_rate || 0.1}
                                    onChange={(e) =>
                                        setData("tax_rate", e.target.value)
                                    }
                                    error={errors.tax_rate}
                                />
                            </div>

                            <div className="space-y-2 text-right">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">小計:</span>
                                    <span className="font-medium">
                                        {formatAmount(data.base_amount)}
                                    </span>
                                </div>
                                {data.discount_amount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            値引き:
                                        </span>
                                        <span className="font-medium text-green-600">
                                            -
                                            {formatAmount(data.discount_amount)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        消費税 (
                                        {(
                                            parseFloat(data.tax_rate) * 100
                                        ).toFixed(0)}
                                        %):
                                    </span>
                                    <span className="font-medium">
                                        {formatAmount(data.tax_amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                                    <span>合計:</span>
                                    <span className="text-blue-600">
                                        {formatAmount(data.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* 要件・仕様 */}
            <Card>
                <CardHeader>
                    <CardTitle>要件・仕様</CardTitle>
                </CardHeader>
                <CardBody>
                    <FormTextarea
                        label="要件"
                        name="requirements"
                        value={data.requirements || ""}
                        onChange={(e) =>
                            setData("requirements", e.target.value)
                        }
                        error={errors.requirements}
                        rows={5}
                        placeholder="見積もりの要件や詳細な説明を入力してください"
                    />
                </CardBody>
            </Card>

            {/* アクションボタン */}
            <div className="flex justify-end space-x-4">
                <SecondaryButton
                    type="button"
                    onClick={() => (window.location.href = cancelRoute)}
                    disabled={processing}
                >
                    キャンセル
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={processing}>
                    {processing ? "処理中..." : isEdit ? "更新" : "作成"}
                </PrimaryButton>
            </div>
        </form>
    );
}
