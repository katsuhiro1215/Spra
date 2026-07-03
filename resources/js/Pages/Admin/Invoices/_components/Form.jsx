import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    FormGroup,
    TextInput,
    SelectInput,
    InputError,
    FormTextarea,
} from "@/Components/Forms";
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
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormGroup
                                label="契約"
                                htmlFor="contract_id"
                                required
                            >
                                <SelectInput
                                    id="contract_id"
                                    name="contract_id"
                                    value={data.contract_id || ""}
                                    onChange={(e) =>
                                        setData("contract_id", e.target.value)
                                    }
                                    options={[
                                        {
                                            value: "",
                                            label: "選択してください",
                                        },
                                        ...contracts.map((c) => ({
                                            value: c.id,
                                            label: `${c.contract_number || c.id.substring(0, 8)} - ${c.title}`,
                                        })),
                                    ]}
                                    error={errors.contract_id}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.contract_id}
                                />
                            </FormGroup>

                            <FormGroup
                                label="発行日"
                                htmlFor="issue_date"
                                required
                            >
                                <TextInput
                                    id="issue_date"
                                    name="issue_date"
                                    type="date"
                                    value={
                                        data.issue_date ||
                                        new Date().toISOString().split("T")[0]
                                    }
                                    onChange={(e) =>
                                        setData("issue_date", e.target.value)
                                    }
                                    error={errors.issue_date}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.issue_date}
                                />
                            </FormGroup>

                            <FormGroup
                                label="請求期間（開始）"
                                htmlFor="billing_period_start"
                                required
                            >
                                <TextInput
                                    id="billing_period_start"
                                    name="billing_period_start"
                                    type="date"
                                    value={
                                        data.billing_period_start ||
                                        new Date().toISOString().split("T")[0]
                                    }
                                    onChange={(e) =>
                                        setData(
                                            "billing_period_start",
                                            e.target.value,
                                        )
                                    }
                                    error={errors.billing_period_start}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.billing_period_start}
                                />
                            </FormGroup>

                            <FormGroup
                                label="請求期間（終了）"
                                htmlFor="billing_period_end"
                                required
                            >
                                <TextInput
                                    id="billing_period_end"
                                    name="billing_period_end"
                                    type="date"
                                    value={data.billing_period_end || ""}
                                    onChange={(e) =>
                                        setData(
                                            "billing_period_end",
                                            e.target.value,
                                        )
                                    }
                                    error={errors.billing_period_end}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.billing_period_end}
                                />
                            </FormGroup>

                            <FormGroup
                                label="支払期限"
                                htmlFor="due_date"
                                required
                            >
                                <TextInput
                                    id="due_date"
                                    name="due_date"
                                    type="date"
                                    value={data.due_date || ""}
                                    onChange={(e) =>
                                        setData("due_date", e.target.value)
                                    }
                                    error={errors.due_date}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.due_date}
                                />
                            </FormGroup>

                            <FormGroup
                                label="ステータス"
                                htmlFor="status"
                                required
                            >
                                <SelectInput
                                    id="status"
                                    name="status"
                                    value={data.status || "draft"}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    options={INVOICE_STATUS_OPTIONS}
                                    error={errors.status}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.status}
                                />
                            </FormGroup>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* クライアント情報 */}
            <Card>
                <CardHeader>
                    <CardTitle>クライアント情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormGroup
                                label="ユーザー"
                                htmlFor="user_id"
                                required
                            >
                                <SelectInput
                                    id="user_id"
                                    name="user_id"
                                    value={data.user_id || ""}
                                    onChange={(e) =>
                                        setData("user_id", e.target.value)
                                    }
                                    options={[
                                        {
                                            value: "",
                                            label: "選択してください",
                                        },
                                        ...users.map((u) => ({
                                            value: u.id,
                                            label:
                                                u.profile?.full_name || u.email,
                                        })),
                                    ]}
                                    error={errors.user_id}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.user_id}
                                />
                            </FormGroup>

                            <FormGroup label="会社" htmlFor="company_id">
                                <SelectInput
                                    id="company_id"
                                    name="company_id"
                                    value={data.company_id || ""}
                                    onChange={(e) =>
                                        setData("company_id", e.target.value)
                                    }
                                    options={[
                                        {
                                            value: "",
                                            label: "選択してください",
                                        },
                                        ...companies.map((c) => ({
                                            value: c.id,
                                            label: c.name,
                                        })),
                                    ]}
                                    error={errors.company_id}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.company_id}
                                />
                            </FormGroup>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* 請求明細 */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        請求明細{" "}
                        <span className="text-red-600 font-semibold">
                            *必須
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="p-6 space-y-4">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                        明細 {index + 1}
                                    </h4>
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveItem(index)
                                            }
                                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <FormGroup
                                        label="説明/品目"
                                        htmlFor={`item_description_${index}`}
                                        required
                                    >
                                        <TextInput
                                            id={`item_description_${index}`}
                                            name={`item_description_${index}`}
                                            value={item.description || ""}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="例: システム開発費"
                                            error={
                                                errors[
                                                    `items.${index}.description`
                                                ]
                                            }
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={
                                                errors[
                                                    `items.${index}.description`
                                                ]
                                            }
                                        />
                                    </FormGroup>

                                    <div className="grid grid-cols-3 gap-4">
                                        <FormGroup
                                            label="数量"
                                            htmlFor={`item_quantity_${index}`}
                                            required
                                        >
                                            <TextInput
                                                id={`item_quantity_${index}`}
                                                name={`item_quantity_${index}`}
                                                type="number"
                                                step="1"
                                                min="0"
                                                value={item.quantity || 1}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "quantity",
                                                        e.target.value,
                                                    )
                                                }
                                                error={
                                                    errors[
                                                        `items.${index}.quantity`
                                                    ]
                                                }
                                            />
                                            <InputError
                                                className="mt-2"
                                                message={
                                                    errors[
                                                        `items.${index}.quantity`
                                                    ]
                                                }
                                            />
                                        </FormGroup>

                                        <FormGroup
                                            label="単価"
                                            htmlFor={`item_unit_price_${index}`}
                                            required
                                        >
                                            <TextInput
                                                id={`item_unit_price_${index}`}
                                                name={`item_unit_price_${index}`}
                                                type="number"
                                                step="1"
                                                min="0"
                                                value={item.unit_price || 0}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "unit_price",
                                                        e.target.value,
                                                    )
                                                }
                                                error={
                                                    errors[
                                                        `items.${index}.unit_price`
                                                    ]
                                                }
                                            />
                                            <InputError
                                                className="mt-2"
                                                message={
                                                    errors[
                                                        `items.${index}.unit_price`
                                                    ]
                                                }
                                            />
                                        </FormGroup>

                                        <FormGroup
                                            label="合計"
                                            htmlFor={`item_amount_${index}`}
                                        >
                                            <div className="pt-3 text-lg font-semibold text-gray-900 dark:text-white">
                                                {formatAmount(item.amount || 0)}
                                            </div>
                                        </FormGroup>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            明細を追加
                        </button>
                    </div>
                </CardBody>
            </Card>

            {/* 金額計算 */}
            <Card>
                <CardHeader>
                    <CardTitle>金額</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormGroup label="割引額" htmlFor="discount_amount">
                                <TextInput
                                    id="discount_amount"
                                    name="discount_amount"
                                    type="number"
                                    step="0.01"
                                    value={data.discount_amount || 0}
                                    onChange={(e) =>
                                        setData(
                                            "discount_amount",
                                            e.target.value,
                                        )
                                    }
                                    error={errors.discount_amount}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.discount_amount}
                                />
                            </FormGroup>

                            <FormGroup label="消費税率（%）" htmlFor="tax_rate">
                                <TextInput
                                    id="tax_rate"
                                    name="tax_rate"
                                    type="number"
                                    step="0.01"
                                    value={data.tax_rate || 10}
                                    onChange={(e) =>
                                        setData("tax_rate", e.target.value)
                                    }
                                    error={errors.tax_rate}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.tax_rate}
                                />
                            </FormGroup>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg space-y-3">
                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                <span>小計:</span>
                                <span>{formatAmount(data.subtotal)}</span>
                            </div>
                            {data.discount_amount > 0 && (
                                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                    <span>割引:</span>
                                    <span>
                                        -{formatAmount(data.discount_amount)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                <span>消費税:</span>
                                <span>{formatAmount(data.tax_amount)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white border-t border-gray-300 dark:border-gray-600 pt-3">
                                <span>合計:</span>
                                <span>{formatAmount(data.total_amount)}</span>
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
                    <div className="p-6">
                        <FormGroup label="備考" htmlFor="notes">
                            <FormTextarea
                                id="notes"
                                name="notes"
                                value={data.notes || ""}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                rows={4}
                                placeholder="その他の備考があればこちらに記入してください"
                                error={errors.notes}
                            />
                            <InputError
                                className="mt-2"
                                message={errors.notes}
                            />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            {/* フォームボタン */}
            <div className="flex justify-end gap-4">
                <SecondaryButton href={cancelRoute}>キャンセル</SecondaryButton>
                <PrimaryButton type="submit" disabled={processing}>
                    {isEdit ? "更新する" : "作成する"}
                </PrimaryButton>
            </div>
        </form>
    );
}
