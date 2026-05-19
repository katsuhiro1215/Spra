import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    FormGroup,
    TextInput,
    SelectInput,
    TextArea,
    InputError,
} from "@/Components/Forms";
import {
    PlusIcon,
    TrashIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
    QUOTE_STATUS_OPTIONS,
    QUOTE_BILLING_TYPE_OPTIONS,
    QUOTE_DISCOUNT_TYPE_OPTIONS,
} from "@/Constants/SelectOptions";

export default function QuoteForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    users = [],
    serviceCategories = [],
    serviceItems = {},
    projectInquiry = null,
    isEdit = false,
}) {
    // ========================================
    // State
    // ========================================
    const [items, setItems] = useState(data.items || []);
    const [showServiceItemModal, setShowServiceItemModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    // ========================================
    // Effects
    // ========================================
    // ProjectInquiryから明細を自動生成
    useEffect(() => {
        if (
            projectInquiry &&
            projectInquiry.simulator_data &&
            items.length === 0
        ) {
            const inquiryItems = [];

            // プランのベース価格を追加
            if (projectInquiry.service_plan) {
                inquiryItems.push({
                    service_item_id: null,
                    name: `${projectInquiry.service_plan.name} (基本料金)`,
                    description: projectInquiry.service_plan.description || "",
                    item_type: "plan_base",
                    billing_type:
                        projectInquiry.service_plan.billing_cycle || "one_time",
                    quantity: 1,
                    unit_price: projectInquiry.service_plan.base_price || 0,
                    amount: projectInquiry.service_plan.base_price || 0,
                    estimated_days: 0,
                    sort_order: 0,
                });
            }

            // 追加アドオンを明細に追加
            if (projectInquiry.simulator_data.selected_addons) {
                projectInquiry.simulator_data.selected_addons.forEach(
                    (addon, index) => {
                        inquiryItems.push({
                            service_item_id: addon.id,
                            name: addon.name,
                            description: "",
                            item_type: "addon",
                            billing_type: "one_time",
                            quantity: 1,
                            unit_price: addon.price,
                            amount: addon.price,
                            estimated_days: addon.estimated_days || 0,
                            sort_order: index + 1,
                        });
                    },
                );
            }

            setItems(inquiryItems);
        }
    }, [projectInquiry]);

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
        const taxRate = parseFloat(data.tax_rate) / 100 || 0.1;
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
    // Handlers - ServiceItem Selection
    // ========================================
    const handleAddServiceItem = (serviceItem) => {
        const newItem = {
            service_item_id: serviceItem.id,
            name: serviceItem.name,
            description: serviceItem.description,
            item_type: serviceItem.item_type,
            billing_type: serviceItem.service_plan?.billing_cycle || "one_time",
            quantity: 1,
            unit_price: serviceItem.price,
            amount: serviceItem.price,
            estimated_days: serviceItem.estimated_days || 0,
            sort_order: items.length,
        };
        setItems([...items, newItem]);
        setShowServiceItemModal(false);
    };

    // ========================================
    // Handlers - Item Management
    // ========================================
    const handleAddEmptyItem = () => {
        setItems([
            ...items,
            {
                service_item_id: null,
                name: "",
                description: "",
                item_type: "custom",
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

    const getFilteredServiceItems = () => {
        if (!selectedCategory) {
            return Object.values(serviceItems).flat();
        }
        return serviceItems[selectedCategory] || [];
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* ユーザー選択 */}
            <Card>
                <CardHeader>
                    <CardTitle>クライアント情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormGroup
                            label="ユーザー"
                            htmlFor="user_id"
                            required
                            help="見積もりを作成するユーザーを選択してください"
                        >
                            <SelectInput
                                id="user_id"
                                name="user_id"
                                value={data.user_id || ""}
                                onChange={(e) =>
                                    setData("user_id", e.target.value)
                                }
                                options={[
                                    { value: "", label: "ユーザーを選択" },
                                    ...users.map((user) => ({
                                        value: user.id,
                                        label: `${user.name} (${user.email})`,
                                    })),
                                ]}
                                required
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
                                    { value: "", label: "会社を選択（任意）" },
                                ]}
                            />
                            <InputError
                                className="mt-2"
                                message={errors.company_id}
                            />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            {/* 基本情報 */}
            <Card>
                <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormGroup
                            label="件名"
                            htmlFor="subject"
                            help="見積もりの件名を入力してください"
                        >
                            <TextInput
                                id="subject"
                                name="subject"
                                value={data.subject || ""}
                                onChange={(e) =>
                                    setData("subject", e.target.value)
                                }
                                placeholder="例: Webサイト制作見積もり"
                            />
                            <InputError
                                className="mt-2"
                                message={errors.subject}
                            />
                        </FormGroup>

                        <FormGroup label="ステータス" htmlFor="status" required>
                            <SelectInput
                                id="status"
                                name="status"
                                value={data.status || "draft"}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                options={QUOTE_STATUS_OPTIONS}
                                required
                            />
                            <InputError
                                className="mt-2"
                                message={errors.status}
                            />
                        </FormGroup>

                        <div className="md:col-span-2">
                            <FormGroup label="メッセージ" htmlFor="message">
                                <TextArea
                                    id="message"
                                    name="message"
                                    value={data.message || ""}
                                    onChange={(e) =>
                                        setData("message", e.target.value)
                                    }
                                    rows={3}
                                    placeholder="見積もりに添えるメッセージを入力してください"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.message}
                                />
                            </FormGroup>
                        </div>

                        <FormGroup label="有効期限" htmlFor="valid_until">
                            <TextInput
                                id="valid_until"
                                type="date"
                                name="valid_until"
                                value={data.valid_until || ""}
                                onChange={(e) =>
                                    setData("valid_until", e.target.value)
                                }
                            />
                            <InputError
                                className="mt-2"
                                message={errors.valid_until}
                            />
                        </FormGroup>

                        <div className="md:col-span-2">
                            <FormGroup label="備考" htmlFor="notes">
                                <TextArea
                                    id="notes"
                                    name="notes"
                                    value={data.notes || ""}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    rows={3}
                                    placeholder="管理用の備考を入力してください"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.notes}
                                />
                            </FormGroup>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* 見積明細 */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>見積明細</CardTitle>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setShowServiceItemModal(true)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                                ServiceItemから選択
                            </button>
                            <button
                                type="button"
                                onClick={handleAddEmptyItem}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                手動で追加
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    {items.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="mb-4">見積明細がありません</p>
                            <p className="text-sm">
                                「ServiceItemから選択」または「手動で追加」をクリックして明細を追加してください
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-medium text-gray-700">
                                                明細 #{index + 1}
                                            </h4>
                                            {item.service_item_id && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                                    ServiceItem
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveItem(index)
                                            }
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormGroup
                                            label="品目名"
                                            htmlFor={`items[${index}].name`}
                                            required
                                        >
                                            <TextInput
                                                id={`items[${index}].name`}
                                                value={item.name}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                placeholder="例: Webサイト制作"
                                            />
                                            <InputError
                                                className="mt-2"
                                                message={
                                                    errors[
                                                        `items.${index}.name`
                                                    ]
                                                }
                                            />
                                        </FormGroup>

                                        <FormGroup
                                            label="課金タイプ"
                                            htmlFor={`items[${index}].billing_type`}
                                        >
                                            <SelectInput
                                                id={`items[${index}].billing_type`}
                                                value={item.billing_type}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "billing_type",
                                                        e.target.value,
                                                    )
                                                }
                                                options={
                                                    QUOTE_BILLING_TYPE_OPTIONS
                                                }
                                                required
                                            />
                                            <InputError
                                                className="mt-2"
                                                message={
                                                    errors[
                                                        `items.${index}.billing_type`
                                                    ]
                                                }
                                            />
                                        </FormGroup>

                                        <div className="md:col-span-2">
                                            <FormGroup
                                                label="説明"
                                                htmlFor={`items[${index}].description`}
                                            >
                                                <TextArea
                                                    id={`items[${index}].description`}
                                                    value={
                                                        item.description || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            index,
                                                            "description",
                                                            e.target.value,
                                                        )
                                                    }
                                                    rows={2}
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
                                        </div>

                                        <FormGroup
                                            label="数量"
                                            htmlFor={`items[${index}].quantity`}
                                            required
                                        >
                                            <TextInput
                                                id={`items[${index}].quantity`}
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
                                                required
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
                                            htmlFor={`items[${index}].unit_price`}
                                            required
                                        >
                                            <TextInput
                                                id={`items[${index}].unit_price`}
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
                                                required
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
                                            label="見積日数"
                                            htmlFor={`items[${index}].estimated_days`}
                                        >
                                            <TextInput
                                                id={`items[${index}].estimated_days`}
                                                type="number"
                                                min="0"
                                                value={item.estimated_days || 0}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "estimated_days",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </FormGroup>

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
                    )}

                    {/* 金額サマリー */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="space-y-4 max-w-md ml-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <FormGroup
                                    label="値引きタイプ"
                                    htmlFor="discount_type"
                                >
                                    <SelectInput
                                        id="discount_type"
                                        name="discount_type"
                                        value={data.discount_type || "fixed"}
                                        onChange={(e) =>
                                            setData(
                                                "discount_type",
                                                e.target.value,
                                            )
                                        }
                                        options={QUOTE_DISCOUNT_TYPE_OPTIONS}
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="値引き額"
                                    htmlFor="discount_amount"
                                >
                                    <TextInput
                                        id="discount_amount"
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
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.discount_amount}
                                    />
                                </FormGroup>

                                <div className="col-span-2">
                                    <FormGroup
                                        label="消費税率 (%)"
                                        htmlFor="tax_rate"
                                    >
                                        <TextInput
                                            id="tax_rate"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            value={data.tax_rate || 10}
                                            onChange={(e) =>
                                                setData(
                                                    "tax_rate",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.tax_rate}
                                        />
                                    </FormGroup>
                                </div>
                            </div>

                            <div className="space-y-2 text-right pt-4">
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
                                        消費税 ({data.tax_rate}%):
                                    </span>
                                    <span className="font-medium">
                                        {formatAmount(data.tax_amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                                    <span>合計:</span>
                                    <span className="text-indigo-600">
                                        {formatAmount(data.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
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

            {/* ServiceItem選択モーダル */}
            {showServiceItemModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setShowServiceItemModal(false)}
                        ></div>

                        <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-xl">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    ServiceItemを選択
                                </h3>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[60vh]">
                                {/* カテゴリフィルター */}
                                <div className="mb-6">
                                    <FormGroup label="カテゴリで絞り込み">
                                        <SelectInput
                                            value={selectedCategory}
                                            onChange={(e) =>
                                                setSelectedCategory(
                                                    e.target.value,
                                                )
                                            }
                                            options={[
                                                {
                                                    value: "",
                                                    label: "すべてのカテゴリ",
                                                },
                                                ...serviceCategories.map(
                                                    (cat) => ({
                                                        value: cat.id,
                                                        label: cat.name,
                                                    }),
                                                ),
                                            ]}
                                        />
                                    </FormGroup>
                                </div>

                                {/* ServiceItemリスト */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {getFilteredServiceItems().map((item) => (
                                        <div
                                            key={item.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer"
                                            onClick={() =>
                                                handleAddServiceItem(item)
                                            }
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-gray-900">
                                                    {item.name}
                                                </h4>
                                                <span className="text-lg font-semibold text-indigo-600">
                                                    {formatAmount(item.price)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">
                                                {item.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                {item.estimated_days > 0 && (
                                                    <span>
                                                        見積日数:{" "}
                                                        {item.estimated_days}日
                                                    </span>
                                                )}
                                                <span className="capitalize">
                                                    {item.item_type}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {getFilteredServiceItems().length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        <p>該当するServiceItemがありません</p>
                                    </div>
                                )}
                            </div>

                            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                                <SecondaryButton
                                    type="button"
                                    onClick={() =>
                                        setShowServiceItemModal(false)
                                    }
                                >
                                    閉じる
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
