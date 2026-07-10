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

export default function ProjectItemForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    version,
    milestones = [],
    serviceItems = [],
    contractItems = [],
}) {
    const [items, setItems] = useState(data.items || []);
    const [showContractItemModal, setShowContractItemModal] = useState(false);
    const [selectedContractItems, setSelectedContractItems] = useState([]);

    // items が変更されたら data.items を更新
    useEffect(() => {
        setData("items", items);
    }, [JSON.stringify(items)]);

    const handleAddEmptyItem = () => {
        const today = new Date().toISOString().split("T")[0];
        const endDate = version?.estimated_end_date
            ? new Date(version.estimated_end_date).toISOString().split("T")[0]
            : today;

        setItems([
            ...items,
            {
                title: "",
                description: "",
                service_item_id: "",
                milestone_id: "",
                start_date: today,
                end_date: endDate,
                estimated_hours: "",
                status: "not_started",
                priority: "medium",
                assigned_to: "",
            },
        ]);
    };

    const handleAddContractItems = (selectedIds) => {
        const newItems = selectedIds.map((itemId) => {
            const contractItem = contractItems.find(
                (item) => item.id === itemId,
            );
            const today = new Date().toISOString().split("T")[0];
            const endDate = version?.estimated_end_date
                ? new Date(version.estimated_end_date)
                      .toISOString()
                      .split("T")[0]
                : today;

            return {
                title: contractItem.name,
                description: contractItem.description || "",
                service_item_id: contractItem.service_item_id || "",
                milestone_id: "",
                start_date: today,
                end_date: endDate,
                estimated_hours: "",
                status: "not_started",
                priority: "medium",
                assigned_to: "",
            };
        });

        setItems([...items, ...newItems]);
        setShowContractItemModal(false);
        setSelectedContractItems([]);
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

    const handleContractItemToggle = (itemId) => {
        if (selectedContractItems.includes(itemId)) {
            setSelectedContractItems(
                selectedContractItems.filter((id) => id !== itemId),
            );
        } else {
            setSelectedContractItems([...selectedContractItems, itemId]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 契約アイテムから取り込み */}
            {contractItems.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>契約アイテムから取り込み</CardTitle>
                            {!showContractItemModal ? (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowContractItemModal(true)
                                    }
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                                    契約アイテムを選択
                                </button>
                            ) : null}
                        </div>
                    </CardHeader>
                    {showContractItemModal && (
                        <CardBody>
                            <div className="space-y-2 mb-4">
                                {contractItems.map((item) => (
                                    <label
                                        key={item.id}
                                        className="flex items-start p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedContractItems.includes(
                                                item.id,
                                            )}
                                            onChange={() =>
                                                handleContractItemToggle(
                                                    item.id,
                                                )
                                            }
                                            className="mt-1 mr-3"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                                {item.name}
                                            </h4>
                                            {item.description && (
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                    {item.description}
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                数量: {item.quantity} × ¥
                                                {item.unit_price?.toLocaleString() ||
                                                    "0"}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAddContractItems(
                                            selectedContractItems,
                                        )
                                    }
                                    disabled={
                                        selectedContractItems.length === 0
                                    }
                                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
                                >
                                    選択したアイテムを適用 (
                                    {selectedContractItems.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowContractItemModal(false);
                                        setSelectedContractItems([]);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    キャンセル
                                </button>
                            </div>
                        </CardBody>
                    )}
                </Card>
            )}

            {/* プロジェクトアイテム一覧 */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>プロジェクトアイテム</CardTitle>
                        <button
                            type="button"
                            onClick={handleAddEmptyItem}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            手動で追加
                        </button>
                    </div>
                </CardHeader>
                <CardBody>
                    {items.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <p className="mb-4">
                                プロジェクトアイテムがありません
                            </p>
                            <p className="text-sm">
                                「契約アイテムを選択」または「手動で追加」をクリックしてアイテムを追加してください
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
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                アイテム {index + 1}
                                            </h4>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveItem(index)
                                            }
                                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {/* タイトル */}
                                        <FormGroup
                                            label="タイトル"
                                            htmlFor={`title-${index}`}
                                            required
                                        >
                                            <TextInput
                                                id={`title-${index}`}
                                                type="text"
                                                value={item.title}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "title",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="例：フロントエンド開発"
                                            />
                                        </FormGroup>

                                        {/* 説明 */}
                                        <FormGroup
                                            label="説明"
                                            htmlFor={`description-${index}`}
                                        >
                                            <TextArea
                                                id={`description-${index}`}
                                                rows="2"
                                                value={item.description}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "description",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="このアイテムについて説明してください"
                                            />
                                        </FormGroup>

                                        {/* サービスアイテム */}
                                        <FormGroup
                                            label="サービスアイテム"
                                            htmlFor={`service-${index}`}
                                        >
                                            <SelectInput
                                                id={`service-${index}`}
                                                value={item.service_item_id}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "service_item_id",
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    サービスアイテムを選択
                                                </option>
                                                {serviceItems.map((service) => (
                                                    <option
                                                        key={service.id}
                                                        value={service.id}
                                                    >
                                                        {service.name} (¥
                                                        {(
                                                            service.standard_price ||
                                                            0
                                                        ).toLocaleString()}
                                                        )
                                                    </option>
                                                ))}
                                            </SelectInput>
                                        </FormGroup>

                                        {/* 日付とその他フィールド */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <FormGroup
                                                label="開始日"
                                                htmlFor={`start-date-${index}`}
                                                required
                                            >
                                                <TextInput
                                                    id={`start-date-${index}`}
                                                    type="date"
                                                    value={item.start_date}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            index,
                                                            "start_date",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </FormGroup>

                                            <FormGroup
                                                label="終了日"
                                                htmlFor={`end-date-${index}`}
                                                required
                                            >
                                                <TextInput
                                                    id={`end-date-${index}`}
                                                    type="date"
                                                    value={item.end_date}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            index,
                                                            "end_date",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </FormGroup>

                                            <FormGroup
                                                label="マイルストーン"
                                                htmlFor={`milestone-${index}`}
                                            >
                                                <SelectInput
                                                    id={`milestone-${index}`}
                                                    value={item.milestone_id}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            index,
                                                            "milestone_id",
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        マイルストーンを選択
                                                    </option>
                                                    {milestones.map((m) => (
                                                        <option
                                                            key={m.id}
                                                            value={m.id}
                                                        >
                                                            {m.title}
                                                        </option>
                                                    ))}
                                                </SelectInput>
                                            </FormGroup>
                                        </div>

                                        {/* ステータスと優先度 */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormGroup
                                                label="ステータス"
                                                htmlFor={`status-${index}`}
                                                required
                                            >
                                                <SelectInput
                                                    id={`status-${index}`}
                                                    value={item.status}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            index,
                                                            "status",
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    <option value="not_started">
                                                        未着手
                                                    </option>
                                                    <option value="in_progress">
                                                        進行中
                                                    </option>
                                                    <option value="completed">
                                                        完了
                                                    </option>
                                                    <option value="on_hold">
                                                        保留
                                                    </option>
                                                    <option value="cancelled">
                                                        キャンセル
                                                    </option>
                                                </SelectInput>
                                            </FormGroup>

                                            <FormGroup
                                                label="優先度"
                                                htmlFor={`priority-${index}`}
                                            >
                                                <SelectInput
                                                    id={`priority-${index}`}
                                                    value={item.priority}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            index,
                                                            "priority",
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    <option value="low">
                                                        低
                                                    </option>
                                                    <option value="medium">
                                                        中
                                                    </option>
                                                    <option value="high">
                                                        高
                                                    </option>
                                                    <option value="urgent">
                                                        緊急
                                                    </option>
                                                </SelectInput>
                                            </FormGroup>
                                        </div>

                                        {/* 見積もり時間 */}
                                        <FormGroup
                                            label="見積もり時間"
                                            htmlFor={`hours-${index}`}
                                        >
                                            <TextInput
                                                id={`hours-${index}`}
                                                type="number"
                                                value={item.estimated_hours}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "estimated_hours",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="時間単位"
                                            />
                                        </FormGroup>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* 送信ボタン */}
            <div className="flex justify-end gap-3">
                <SecondaryButton
                    onClick={() => {
                        if (cancelRoute) window.location.href = cancelRoute;
                    }}
                >
                    キャンセル
                </SecondaryButton>
                <PrimaryButton
                    type="submit"
                    disabled={processing || items.length === 0}
                >
                    {processing ? "処理中..." : "アイテムを保存"}
                </PrimaryButton>
            </div>
        </form>
    );
}
