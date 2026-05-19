import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    PlusIcon,
    TrashIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function QuoteSimulator({
    serviceCategories,
    serviceItems,
    canLogin,
    canRegister,
}) {
    // ========================================
    // State
    // ========================================
    const [items, setItems] = useState([]);
    const [showServiceItemModal, setShowServiceItemModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    // ========================================
    // 金額計算（固定税率10%、割引なし）
    // ========================================
    const taxRate = 10; // 固定税率10%
    const baseAmount = items.reduce(
        (sum, item) => sum + (parseFloat(item.amount) || 0),
        0,
    );
    const taxAmount = Math.round(baseAmount * (taxRate / 100));
    const totalAmount = baseAmount + taxAmount;

    // ========================================
    // Handlers - ServiceItem Selection
    // ========================================
    const handleAddServiceItem = (serviceItem) => {
        const newItem = {
            id: Date.now(),
            service_item_id: serviceItem.id,
            name: serviceItem.name,
            description: serviceItem.description,
            item_type: serviceItem.item_type,
            quantity: 1,
            unit_price: serviceItem.price,
            amount: serviceItem.price,
            estimated_days: serviceItem.estimated_days || 0,
        };
        setItems([...items, newItem]);
        setShowServiceItemModal(false);
    };

    // ========================================
    // Handlers - Item Management
    // ========================================
    const handleRemoveItem = (id) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const handleItemChange = (id, field, value) => {
        setItems(
            items.map((item) => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };
                    if (field === "quantity" || field === "unit_price") {
                        updatedItem.amount =
                            (parseFloat(updatedItem.quantity) || 0) *
                            (parseFloat(updatedItem.unit_price) || 0);
                    }
                    return updatedItem;
                }
                return item;
            }),
        );
    };

    // ========================================
    // Helper Functions
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

    const totalEstimatedDays = items.reduce(
        (sum, item) => sum + (parseInt(item.estimated_days) || 0),
        0,
    );

    return (
        <PublicLayout>
            <Head title="見積もりシミュレーター" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* ヒーローセクション */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">
                                見積もりシミュレーター
                            </h1>
                            <p className="text-xl text-indigo-100">
                                サービスを選択して、その場で概算金額を確認できます
                            </p>
                        </div>
                    </div>
                </div>

                {/* メインコンテンツ */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* 選択したアイテムのリスト */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                選択したサービス
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowServiceItemModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                サービスを追加
                            </button>
                        </div>

                        {items.length === 0 ? (
                            <div className="text-center py-16 text-gray-500">
                                <div className="mb-4">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <p className="text-lg mb-2">
                                    サービスが選択されていません
                                </p>
                                <p className="text-sm">
                                    「サービスを追加」ボタンをクリックして、見積もりを作成してください
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-900">
                                                    {item.name}
                                                </h3>
                                                {item.description && (
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveItem(item.id)
                                                }
                                                className="ml-4 text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    数量
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            item.id,
                                                            "quantity",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    単価
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={item.unit_price}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            item.id,
                                                            "unit_price",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    金額
                                                </label>
                                                <div className="flex items-center h-10 px-3 bg-gray-100 rounded-md">
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        {formatAmount(
                                                            item.amount,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {item.estimated_days > 0 && (
                                            <div className="mt-3 text-sm text-gray-600">
                                                見積日数: {item.estimated_days}
                                                日
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 金額サマリー */}
                    {items.length > 0 && (
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                見積もり概算
                            </h2>

                            <div className="max-w-md ml-auto space-y-4">
                                <div className="border-t border-gray-200 pt-4 space-y-3">
                                    <div className="flex justify-between text-base">
                                        <span className="text-gray-600">
                                            小計:
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            {formatAmount(baseAmount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span className="text-gray-600">
                                            消費税 ({taxRate}%):
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            {formatAmount(taxAmount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-bold pt-3 border-t border-gray-300">
                                        <span className="text-gray-900">
                                            合計:
                                        </span>
                                        <span className="text-indigo-600">
                                            {formatAmount(totalAmount)}
                                        </span>
                                    </div>
                                    {totalEstimatedDays > 0 && (
                                        <div className="flex justify-between text-sm pt-2">
                                            <span className="text-gray-600">
                                                想定納期:
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                約 {totalEstimatedDays} 日
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CTAセクション */}
                    {items.length > 0 && (
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-8 text-center text-white">
                            <h3 className="text-2xl font-bold mb-4">
                                この内容で正式な見積もりを依頼しますか？
                            </h3>
                            <p className="text-indigo-100 mb-6">
                                会員登録（無料）することで、正式な見積もりを依頼できます
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={canLogin}
                                    className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-indigo-600 transition-colors"
                                >
                                    ログイン
                                </Link>
                                <Link
                                    href={canRegister}
                                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors shadow-sm"
                                >
                                    無料会員登録
                                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ServiceItem選択モーダル */}
            {showServiceItemModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setShowServiceItemModal(false)}
                        ></div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    サービスを選択
                                </h3>
                            </div>

                            <div className="bg-white px-6 py-4 max-h-[70vh] overflow-y-auto">
                                {/* カテゴリフィルター */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        カテゴリで絞り込み
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) =>
                                            setSelectedCategory(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">
                                            すべてのカテゴリ
                                        </option>
                                        {serviceCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* ServiceItemリスト */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {getFilteredServiceItems().map((item) => (
                                        <div
                                            key={item.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer bg-white"
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
                                                <span className="px-2 py-1 bg-gray-100 rounded">
                                                    {item.item_type}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {getFilteredServiceItems().length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        <p>該当するサービスがありません</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowServiceItemModal(false)
                                    }
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                >
                                    閉じる
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
