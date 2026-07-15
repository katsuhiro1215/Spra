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
import { CONTRACT_BILLING_TYPE_OPTIONS } from "@/Constants/SelectOptions";

export default function ContractItemForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    serviceCategories = [],
    services = [],
    serviceItems = {},
    servicePlans = [],
    quoteItems = [],
    fromQuote = false,
    isEdit = false,
}) {
    const [items, setItems] = useState(data.items || []);
    const [showServiceItemModal, setShowServiceItemModal] = useState(false);
    const [showServicePlanModal, setShowServicePlanModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const [selectedPlanCategory, setSelectedPlanCategory] = useState("");
    const [selectedPlanService, setSelectedPlanService] = useState("");

    // items が変更されたら data.items を更新
    useEffect(() => {
        // 明細の金額を自動計算
        const updatedItems = items.map((item) => ({
            ...item,
            amount:
                (parseFloat(item.quantity) || 0) *
                (parseFloat(item.unit_price) || 0),
        }));
        setData("items", updatedItems);
    }, [JSON.stringify(items)]);

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    const handleAddEmptyItem = () => {
        setItems([
            ...items,
            {
                service_id: null,
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
                selected: true,
            },
        ]);
    };

    const handleAddServiceItem = (serviceItem) => {
        const unitPrice =
            serviceItem.item_type === "included"
                ? 0
                : serviceItem.standard_price || 0;

        const newItem = {
            service_id: serviceItem.service_id,
            service_item_id: serviceItem.id,
            name: serviceItem.name,
            description: serviceItem.description,
            item_type: serviceItem.item_type,
            billing_type: "one_time",
            quantity: 1,
            unit_price: unitPrice,
            amount: unitPrice,
            estimated_days: serviceItem.estimated_days || 0,
            sort_order: items.length,
            selected: true,
        };
        setItems([...items, newItem]);
        setShowServiceItemModal(false);
    };

    const handleAddServicePlan = (servicePlan) => {
        if (
            !servicePlan.service_items ||
            servicePlan.service_items.length === 0
        ) {
            alert("このプランに含まれるServiceItemがありません");
            return;
        }

        const newItems = servicePlan.service_items.map((serviceItem, index) => {
            const unitPrice =
                serviceItem.item_type === "included"
                    ? 0
                    : serviceItem.standard_price || 0;

            return {
                service_id: servicePlan.service_id,
                service_item_id: serviceItem.id,
                name: serviceItem.name,
                description: serviceItem.description || "",
                item_type: serviceItem.item_type,
                billing_type: "one_time",
                quantity: serviceItem.quantity || 1,
                unit_price: unitPrice,
                amount: unitPrice * (serviceItem.quantity || 1),
                estimated_days: serviceItem.estimated_days || 0,
                sort_order: items.length + index,
                selected: true,
            };
        });

        setItems([...items, ...newItems]);
        setShowServicePlanModal(false);
    };

    const handleAddQuoteItems = (selectedQuoteItems) => {
        const newItems = selectedQuoteItems.map((quoteItem, index) => ({
            service_id: quoteItem.service_id,
            service_item_id: quoteItem.service_item_id,
            name: quoteItem.name,
            description: quoteItem.description || "",
            item_type: quoteItem.item_type,
            billing_type: quoteItem.billing_type,
            quantity: quoteItem.quantity,
            unit_price: quoteItem.unit_price,
            amount: quoteItem.amount,
            estimated_days: quoteItem.estimated_days || 0,
            sort_order: items.length + index,
            selected: true,
        }));
        setItems([...items, ...newItems]);
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

    const getFilteredServiceItems = () => {
        let filtered = selectedCategory
            ? serviceItems[selectedCategory] || []
            : Object.values(serviceItems).flat();

        if (selectedService) {
            filtered = filtered.filter(
                (item) => item.service_id === selectedService,
            );
        }

        return filtered;
    };

    const getFilteredServicePlans = () => {
        let filtered = servicePlans;

        if (selectedPlanCategory) {
            const servicesInCategory = services.filter(
                (service) =>
                    service.service_category_id === selectedPlanCategory,
            );
            const serviceIdsInCategory = servicesInCategory.map(
                (service) => service.id,
            );
            filtered = filtered.filter((plan) =>
                serviceIdsInCategory.includes(plan.service_id),
            );
        }

        if (selectedPlanService) {
            filtered = filtered.filter(
                (plan) => plan.service_id === selectedPlanService,
            );
        }

        return filtered;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    // 合計金額計算（selectedがtrueの明細のみ）
    const totalAmount = items
        .filter((item) => item.selected !== false)
        .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    // ContractVersion用の金額計算
    useEffect(() => {
        const baseAmount = totalAmount;
        const discountAmount = parseFloat(data.discount_amount) || 0;
        const taxRate = parseFloat(data.tax_rate) / 100 || 0.1;
        const taxAmount = (baseAmount - discountAmount) * taxRate;
        const calculatedTotalAmount = baseAmount - discountAmount + taxAmount;

        setData((prev) => ({
            ...prev,
            base_amount: baseAmount,
            tax_amount: taxAmount,
            total_amount: calculatedTotalAmount,
        }));
    }, [totalAmount, data.discount_amount, data.tax_rate]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>契約明細</CardTitle>
                        <div className="flex gap-2">
                            {fromQuote && quoteItems.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAddQuoteItems(quoteItems)
                                    }
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                                >
                                    <PlusIcon className="h-4 w-4 mr-2" />
                                    見積明細から適用
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowServiceItemModal(true)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                            >
                                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                                ServiceItemから選択
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowServicePlanModal(true)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                            >
                                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                                ServicePlanから選択
                            </button>
                            <button
                                type="button"
                                onClick={handleAddEmptyItem}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                手動で追加
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    {items.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <p className="mb-4">契約明細がありません</p>
                            <p className="text-sm">
                                {fromQuote
                                    ? "「見積明細から適用」または「ServiceItemから選択」をクリックして明細を追加してください"
                                    : "「ServiceItemから選択」または「手動で追加」をクリックして明細を追加してください"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                明細 #{index + 1}
                                            </h4>
                                            {item.service_item_id && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                                    ServiceItem
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveItem(index)
                                            }
                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
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
                                                    CONTRACT_BILLING_TYPE_OPTIONS
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
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                                    金額
                                                </label>
                                                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {formatAmount(item.amount)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="dark:text-gray-200">
                                        合計:
                                    </span>
                                    <span className="text-indigo-600 dark:text-indigo-400">
                                        {formatAmount(totalAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* 金額サマリー */}
            <Card>
                <CardHeader>
                    <CardTitle>金額サマリー</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="space-y-4 max-w-md ml-auto">
                        <div className="grid grid-cols-2 gap-4">
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
                                            setData("tax_rate", e.target.value)
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
                                <span className="text-gray-600 dark:text-gray-300">
                                    小計:
                                </span>
                                <span className="font-medium dark:text-gray-200">
                                    {formatAmount(data.base_amount)}
                                </span>
                            </div>
                            {data.discount_amount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">
                                        値引き:
                                    </span>
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                        -{formatAmount(data.discount_amount)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-300">
                                    消費税 ({data.tax_rate}%):
                                </span>
                                <span className="font-medium dark:text-gray-200">
                                    {formatAmount(data.tax_amount)}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span className="dark:text-gray-200">
                                    合計:
                                </span>
                                <span className="text-indigo-600 dark:text-indigo-400">
                                    {formatAmount(data.total_amount)}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* カスタム仕様 */}
            <Card>
                <CardHeader>
                    <CardTitle>カスタム仕様</CardTitle>
                </CardHeader>
                <CardBody>
                    <FormGroup
                        label="カスタム仕様"
                        htmlFor="custom_specifications"
                    >
                        <TextArea
                            id="custom_specifications"
                            value={data.custom_specifications || ""}
                            onChange={(e) =>
                                setData("custom_specifications", e.target.value)
                            }
                            rows={3}
                            placeholder="カスタム仕様やメモを入力してください"
                        />
                        <InputError
                            className="mt-2"
                            message={errors.custom_specifications}
                        />
                    </FormGroup>
                </CardBody>
            </Card>

            {/* アクションボタン */}
            <div className="flex justify-end space-x-4">
                <SecondaryButton
                    type="button"
                    href={cancelRoute}
                    disabled={processing}
                >
                    キャンセル
                </SecondaryButton>
                <PrimaryButton
                    type="submit"
                    disabled={processing || items.length === 0}
                >
                    {processing ? "処理中..." : isEdit ? "更新" : "明細を保存"}
                </PrimaryButton>
            </div>

            {/* ServiceItemから選択モーダル */}
            {showServiceItemModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
                            onClick={() => setShowServiceItemModal(false)}
                        ></div>

                        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-xl">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    ServiceItemを選択
                                </h3>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[60vh]">
                                {/* カテゴリフィルター */}
                                <div className="mb-6">
                                    <FormGroup label="カテゴリで絞り込み">
                                        <SelectInput
                                            value={selectedCategory}
                                            onChange={(e) => {
                                                setSelectedCategory(
                                                    e.target.value,
                                                );
                                                setSelectedService("");
                                            }}
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

                                {/* サービスフィルター */}
                                <div className="mb-6">
                                    <FormGroup label="サービスで絞り込み">
                                        <SelectInput
                                            value={selectedService}
                                            onChange={(e) =>
                                                setSelectedService(
                                                    e.target.value,
                                                )
                                            }
                                            options={[
                                                {
                                                    value: "",
                                                    label: "すべてのサービス",
                                                },
                                                ...services
                                                    .filter((service) => {
                                                        if (!selectedCategory) {
                                                            return true;
                                                        }
                                                        return (
                                                            service.service_category_id ===
                                                            selectedCategory
                                                        );
                                                    })
                                                    .map((service) => ({
                                                        value: service.id,
                                                        label: service.name,
                                                    })),
                                            ]}
                                        />
                                    </FormGroup>
                                </div>

                                {/* ServiceItemリスト */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {getFilteredServiceItems().map((item) => (
                                        <div
                                            key={item.id}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md dark:hover:shadow-indigo-500/20 transition-all cursor-pointer bg-white dark:bg-gray-700"
                                            onClick={() =>
                                                handleAddServiceItem(item)
                                            }
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    {item.name}
                                                </h4>
                                                <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                                                    {formatAmount(
                                                        item.standard_price,
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                                {item.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
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
                                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                        <p>該当するServiceItemがありません</p>
                                    </div>
                                )}
                            </div>

                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 dark:bg-gray-700 flex justify-end">
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

            {/* ServicePlanから選択モーダル */}
            {showServicePlanModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
                            onClick={() => setShowServicePlanModal(false)}
                        ></div>

                        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-xl">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    ServicePlanを選択
                                </h3>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[60vh]">
                                {/* カテゴリフィルター */}
                                <div className="mb-6">
                                    <FormGroup label="カテゴリで絞り込み">
                                        <SelectInput
                                            value={selectedPlanCategory}
                                            onChange={(e) => {
                                                setSelectedPlanCategory(
                                                    e.target.value,
                                                );
                                                setSelectedPlanService("");
                                            }}
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

                                {/* サービスフィルター */}
                                <div className="mb-6">
                                    <FormGroup label="サービスで絞り込み">
                                        <SelectInput
                                            value={selectedPlanService}
                                            onChange={(e) =>
                                                setSelectedPlanService(
                                                    e.target.value,
                                                )
                                            }
                                            options={[
                                                {
                                                    value: "",
                                                    label: "すべてのサービス",
                                                },
                                                ...services
                                                    .filter((service) => {
                                                        if (
                                                            !selectedPlanCategory
                                                        ) {
                                                            return true;
                                                        }
                                                        return (
                                                            service.service_category_id ===
                                                            selectedPlanCategory
                                                        );
                                                    })
                                                    .map((service) => ({
                                                        value: service.id,
                                                        label: service.name,
                                                    })),
                                            ]}
                                        />
                                    </FormGroup>
                                </div>

                                {/* ServicePlanリスト */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {getFilteredServicePlans().map((plan) => (
                                        <div
                                            key={plan.id}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-green-500 dark:hover:border-green-400 hover:shadow-md dark:hover:shadow-green-500/20 transition-all cursor-pointer bg-white dark:bg-gray-700"
                                            onClick={() =>
                                                handleAddServicePlan(plan)
                                            }
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    {plan.name}
                                                </h4>
                                                <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                    {formatAmount(
                                                        plan.base_price,
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                                {plan.description}
                                            </p>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                <p className="font-medium">
                                                    含まれるItem:
                                                </p>
                                                <ul className="list-disc list-inside mt-1">
                                                    {plan.service_items
                                                        ?.slice(0, 3)
                                                        .map((item) => (
                                                            <li
                                                                key={item.id}
                                                                className="truncate"
                                                            >
                                                                {item.name}
                                                                {item.item_type ===
                                                                    "included" && (
                                                                    <span className="text-green-600 dark:text-green-400">
                                                                        {" "}
                                                                        (含)
                                                                    </span>
                                                                )}
                                                            </li>
                                                        ))}
                                                </ul>
                                                {plan.service_items?.length >
                                                    3 && (
                                                    <p className="mt-1">
                                                        他{" "}
                                                        {plan.service_items
                                                            .length - 3}{" "}
                                                        件
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {getFilteredServicePlans().length === 0 && (
                                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                        <p>該当するServicePlanがありません</p>
                                    </div>
                                )}
                            </div>

                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 dark:bg-gray-700 flex justify-end">
                                <SecondaryButton
                                    type="button"
                                    onClick={() =>
                                        setShowServicePlanModal(false)
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
