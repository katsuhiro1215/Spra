import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import {
    PrimaryButton,
    SecondaryButton,
    DangerButton,
} from "@/Components/Buttons";
import { FormField, FormSelect, FormTextarea } from "@/Components/Forms";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { INVOICE_STATUS_OPTIONS } from "@/Constants/SelectOptions";

export default function InvoiceForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    isEdit = false,
    contracts = [],
    users = [],
    companies = [],
}) {
    // ========================================
    // State
    // ========================================
    const [items, setItems] = useState(
        data.items || [
            {
                name: "",
                description: "",
                quantity: 1,
                unit_price: 0,
                amount: 0,
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
        const subtotal = items.reduce(
            (sum, item) => sum + (parseFloat(item.amount) || 0),
            0,
        );
        const discountAmount = parseFloat(data.discount_amount) || 0;
        const taxRate = parseFloat(data.tax_rate) || 0.1;
        const taxAmount = (subtotal - discountAmount) * taxRate;
        const totalAmount = subtotal - discountAmount + taxAmount;

        setData((prev) => ({
            ...prev,
            subtotal: subtotal,
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
                quantity: 1,
                unit_price: 0,
                amount: 0,
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
                            label="件名"
                            name="title"
                            value={data.title || ""}
                            onChange={(e) => setData("title", e.target.value)}
                            error={errors.title}
                            required
                        />

                        <FormSelect
                            label="契約"
                            name="contract_id"
                            value={data.contract_id || ""}
                            onChange={(e) =>
                                setData("contract_id", e.target.value)
                            }
                            error={errors.contract_id}
                            options={[
                                { value: "", label: "選択してください" },
                                ...contracts.map((c) => ({
                                    value: c.id,
                                    label: `${c.contract_number || c.id.substring(0, 8)} - ${c.title}`,
                                })),
                            ]}
                        />

                        <FormField
                            label="請求期間（開始）"
                            type="date"
                            name="billing_period_start"
                            value={data.billing_period_start || ""}
                            onChange={(e) =>
                                setData("billing_period_start", e.target.value)
                            }
                            error={errors.billing_period_start}
                        />

                        <FormField
                            label="請求期間（終了）"
                            type="date"
                            name="billing_period_end"
                            value={data.billing_period_end || ""}
                            onChange={(e) =>
                                setData("billing_period_end", e.target.value)
                            }
                            error={errors.billing_period_end}
                        />

                        <FormField
                            label="支払期限"
                            type="date"
                            name="due_date"
                            value={data.due_date || ""}
                            onChange={(e) =>
                                setData("due_date", e.target.value)
                            }
                            error={errors.due_date}
                            required
                        />

                        <FormSelect
                            label="ステータス"
                            name="status"
                            value={data.status || "draft"}
                            onChange={(e) => setData("status", e.target.value)}
                            error={errors.status}
                            options={INVOICE_STATUS_OPTIONS}
                            required
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
                        <FormSelect
                            label="ユーザー"
                            name="user_id"
                            value={data.user_id || ""}
                            onChange={(e) => setData("user_id", e.target.value)}
                            error={errors.user_id}
                            options={[
                                { value: "", label: "選択してください" },
                                ...users.map((u) => ({
                                    value: u.id,
                                    label: u.profile?.full_name || u.email,
                                })),
                            ]}
                        />

                        <FormSelect
                            label="会社"
                            name="company_id"
                            value={data.company_id || ""}
                            onChange={(e) =>
                                setData("company_id", e.target.value)
                            }
                            error={errors.company_id}
                            options={[
                                { value: "", label: "選択してください" },
                                ...companies.map((c) => ({
                                    value: c.id,
                                    label: c.name,
                                })),
                            ]}
                        />
                    </div>
                </CardBody>
            </Card>

            {/* 請求明細 */}
            <Card>
                <CardHeader>
                    <CardTitle>請求明細</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-medium text-gray-900">
                                        明細 {index + 1}
                                    </h4>
                                    {items.length > 1 && (
                                        <DangerButton
                                            type="button"
                                            onClick={() =>
                                                handleRemoveItem(index)
                                            }
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </DangerButton>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        label="品目名"
                                        name={`items.${index}.name`}
                                        value={item.name || ""}
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
                                    <FormField
                                        label="数量"
                                        type="number"
                                        name={`items.${index}.quantity`}
                                        value={item.quantity || 0}
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
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                    <FormField
                                        label="単価"
                                        type="number"
                                        name={`items.${index}.unit_price`}
                                        value={item.unit_price || 0}
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
                                        min="0"
                                        step="1"
                                        required
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            金額
                                        </label>
                                        <div className="px-3 py-2 bg-gray-100 rounded-md text-right font-semibold">
                                            {formatAmount(item.amount)}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <FormTextarea
                                            label="説明"
                                            name={`items.${index}.description`}
                                            value={item.description || ""}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            error={
                                                errors[
                                                    `items.${index}.description`
                                                ]
                                            }
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <SecondaryButton type="button" onClick={handleAddItem}>
                            <PlusIcon className="h-4 w-4 mr-2" />
                            明細を追加
                        </SecondaryButton>
                    </div>
                </CardBody>
            </Card>

            {/* 金額設定 */}
            <Card>
                <CardHeader>
                    <CardTitle>金額設定</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    小計
                                </label>
                                <div className="px-3 py-2 bg-gray-100 rounded-md text-right font-semibold">
                                    {formatAmount(data.subtotal)}
                                </div>
                            </div>

                            <FormField
                                label="値引き額"
                                type="number"
                                name="discount_amount"
                                value={data.discount_amount || 0}
                                onChange={(e) =>
                                    setData("discount_amount", e.target.value)
                                }
                                error={errors.discount_amount}
                                min="0"
                                step="1"
                            />

                            <FormField
                                label="消費税率（%）"
                                type="number"
                                name="tax_rate"
                                value={(data.tax_rate || 0.1) * 100}
                                onChange={(e) =>
                                    setData("tax_rate", e.target.value / 100)
                                }
                                error={errors.tax_rate}
                                min="0"
                                max="100"
                                step="0.1"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    消費税額
                                </label>
                                <div className="px-3 py-2 bg-gray-100 rounded-md text-right font-semibold">
                                    {formatAmount(data.tax_amount)}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">
                                    合計金額
                                </span>
                                <span className="text-2xl font-bold text-blue-600">
                                    {formatAmount(data.total_amount)}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* 備考 */}
            <Card>
                <CardHeader>
                    <CardTitle>備考</CardTitle>
                </CardHeader>
                <CardBody>
                    <FormTextarea
                        label="備考"
                        name="notes"
                        value={data.notes || ""}
                        onChange={(e) => setData("notes", e.target.value)}
                        error={errors.notes}
                        rows={4}
                        placeholder="請求書に関する備考を入力してください"
                    />
                </CardBody>
            </Card>

            {/* アクションボタン */}
            <div className="flex justify-end space-x-3">
                <SecondaryButton
                    type="button"
                    onClick={() => (window.location.href = cancelRoute)}
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
