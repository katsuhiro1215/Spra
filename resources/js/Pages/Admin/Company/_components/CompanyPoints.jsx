import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { SelectInput } from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    SparklesIcon,
    TrophyIcon,
    GiftIcon,
} from "@heroicons/react/24/outline";

const TYPE_LABELS = {
    purchase: "通常ポイント",
    bonus: "ボーナスポイント",
    referral: "紹介ポイント",
    adjustment: "調整",
    redemption: "ポイント交換",
};

const TYPE_BADGE_VARIANTS = {
    purchase: "primary",
    bonus: "purple",
    referral: "pink",
    adjustment: "secondary",
    redemption: "orange",
};

export default function CompanyPoints({
    company,
    membership = {},
    pointTransactions = [],
    activePointRewards = [],
}) {
    const [showGrantForm, setShowGrantForm] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        reward_code: "",
    });

    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleGrant = (e) => {
        e.preventDefault();
        post(route("admin.company.points.grant", company.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowGrantForm(false);
            },
        });
    };

    const rewardOptions = [
        { value: "", label: "特典を選択してください" },
        ...activePointRewards.map((reward) => ({
            value: reward.code,
            label: `${reward.name}（+${reward.points}pt）`,
        })),
    ];

    return (
        <div className="space-y-6">
            {/* 残高・ランク */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <Card>
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    現在のポイント残高
                                </p>
                                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {(
                                        membership.points_balance || 0
                                    ).toLocaleString()}
                                    pt
                                </p>
                            </div>
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                                <SparklesIcon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    累計獲得ポイント
                                </p>
                                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {(
                                        membership.lifetime_points || 0
                                    ).toLocaleString()}
                                    pt
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                                <TrophyIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                現在のランク
                            </p>
                            <p className="mt-2">
                                {membership.current_rank ? (
                                    <Badge variant="warning" size="md">
                                        {membership.current_rank.name}
                                    </Badge>
                                ) : (
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        未判定
                                    </span>
                                )}
                            </p>
                            {membership.rank_calculated_at && (
                                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                    {new Date(
                                        membership.rank_calculated_at,
                                    ).toLocaleDateString("ja-JP")}
                                    時点
                                </p>
                            )}
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                今年のご利用額
                            </p>
                            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {new Intl.NumberFormat("ja-JP", {
                                    style: "currency",
                                    currency: "JPY",
                                }).format(membership.annual_usage_amount || 0)}
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* 手動付与 */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <GiftIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                ポイントを手動付与
                            </h2>
                        </div>
                        {!showGrantForm && (
                            <SecondaryButton
                                size="sm"
                                onClick={() => setShowGrantForm(true)}
                            >
                                付与する
                            </SecondaryButton>
                        )}
                    </div>
                </CardHeader>
                {showGrantForm && (
                    <CardBody>
                        <form
                            onSubmit={handleGrant}
                            className="flex flex-col sm:flex-row items-start sm:items-end gap-3"
                        >
                            <div className="w-full sm:w-80">
                                <SelectInput
                                    value={data.reward_code}
                                    onChange={(e) =>
                                        setData(
                                            "reward_code",
                                            e.target.value,
                                        )
                                    }
                                    disabled={processing}
                                    options={rewardOptions}
                                />
                            </div>
                            <div className="flex gap-2">
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing || !data.reward_code}
                                >
                                    付与する
                                </PrimaryButton>
                                <SecondaryButton
                                    type="button"
                                    onClick={() => setShowGrantForm(false)}
                                    disabled={processing}
                                >
                                    キャンセル
                                </SecondaryButton>
                            </div>
                        </form>
                    </CardBody>
                )}
            </Card>

            {/* 履歴 */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                            ポイント履歴
                        </h2>
                        <Badge variant="secondary" size="sm">
                            {pointTransactions.length}件
                        </Badge>
                    </div>
                </CardHeader>
                <CardBody>
                    {pointTransactions && pointTransactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            日時
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            内容
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            種別
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            ポイント
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            残高
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                    {pointTransactions.map((transaction) => (
                                        <tr
                                            key={transaction.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                {formatDateTime(
                                                    transaction.created_at,
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100">
                                                {transaction.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge
                                                    variant={
                                                        TYPE_BADGE_VARIANTS[
                                                            transaction.type
                                                        ] || "secondary"
                                                    }
                                                    size="xs"
                                                >
                                                    {TYPE_LABELS[
                                                        transaction.type
                                                    ] || transaction.type}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <span
                                                    className={
                                                        transaction.points >=
                                                        0
                                                            ? "text-green-600 dark:text-green-400"
                                                            : "text-red-600 dark:text-red-400"
                                                    }
                                                >
                                                    {transaction.points >= 0
                                                        ? "+"
                                                        : ""}
                                                    {transaction.points}pt
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500 dark:text-slate-400">
                                                {transaction.balance_after}pt
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <SparklesIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
                            <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                                ポイント履歴がありません
                            </h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                入金確認や特典付与が行われると、ここに表示されます。
                            </p>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
