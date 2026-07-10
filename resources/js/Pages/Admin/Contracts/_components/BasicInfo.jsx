import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    EnvelopeIcon,
    CalendarIcon,
    CurrencyYenIcon,
    PercentBadgeIcon,
} from "@heroicons/react/24/outline";
export default function BasicInfo({ contract }) {
    const [editingDepositRate, setEditingDepositRate] = useState(false);
    const { data, setData, patch, processing, errors } = useForm({
        deposit_rate: contract.deposit_rate,
    });

    const getStatusColor = (status) => {
        const colors = {
            draft: "gray",
            pending_signature: "yellow",
            active: "green",
            cancelled: "red",
        };
        return colors[status] || "gray";
    };

    const handleSaveDepositRate = () => {
        patch(route("admin.contract.update", contract.id), {
            preserveScroll: true,
            onSuccess: () => setEditingDepositRate(false),
        });
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("ja-JP");
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardBody>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">契約番号</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {contract.contract_number}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">ステータス</p>
                            <Badge variant={getStatusColor(contract.status)}>
                                {contract.status === "draft" && "下書き"}
                                {contract.status === "pending_signature" &&
                                    "署名待ち"}
                                {contract.status === "active" && "有効"}
                                {contract.status === "cancelled" &&
                                    "キャンセル"}
                            </Badge>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">契約タイトル</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {contract.title}
                        </p>
                    </div>

                    {contract.description && (
                        <div>
                            <p className="text-sm text-gray-500">説明</p>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {contract.description}
                            </p>
                        </div>
                    )}

                    <div className="border-t pt-4">
                        <p className="text-sm font-semibold text-gray-600 mb-3">
                            契約期間
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">開始日</p>
                                <p className="text-gray-900 font-medium">
                                    {formatDate(contract.start_date)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">終了日</p>
                                <p className="text-gray-900 font-medium">
                                    {contract.end_date
                                        ? formatDate(contract.end_date)
                                        : "継続"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-sm font-semibold text-gray-600 mb-3">
                            契約金額
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">金額</p>
                                <p className="text-lg font-bold text-blue-600">
                                    {formatAmount(contract.amount)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">税率</p>
                                <p className="text-gray-900 font-medium">
                                    {contract.tax_rate}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-sm font-semibold text-gray-600 mb-3">
                            契約タイプ
                        </p>
                        <p className="text-gray-900 font-medium">
                            {contract.type === "one_time" && "一回限り"}
                            {contract.type === "monthly" && "月額"}
                            {contract.type === "annual" && "年額"}
                        </p>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                着手金比率
                            </p>
                            {!editingDepositRate && (
                                <button
                                    onClick={() => setEditingDepositRate(true)}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                                >
                                    編集
                                </button>
                            )}
                        </div>
                        {editingDepositRate ? (
                            <div className="space-y-3">
                                <div>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={data.deposit_rate}
                                        onChange={(e) =>
                                            setData(
                                                "deposit_rate",
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                                        placeholder="0-100"
                                    />
                                    {errors.deposit_rate && (
                                        <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                                            {errors.deposit_rate}
                                        </p>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <PrimaryButton
                                        onClick={handleSaveDepositRate}
                                        disabled={processing}
                                        className="text-xs"
                                    >
                                        {processing ? "保存中..." : "保存"}
                                    </PrimaryButton>
                                    <SecondaryButton
                                        onClick={() => {
                                            setEditingDepositRate(false);
                                            setData(
                                                "deposit_rate",
                                                contract.deposit_rate,
                                            );
                                        }}
                                        className="text-xs"
                                    >
                                        キャンセル
                                    </SecondaryButton>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                {data.deposit_rate}%
                            </p>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
