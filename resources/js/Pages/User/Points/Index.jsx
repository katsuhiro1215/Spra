import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import UserPagination from "@/Components/Layout/UserPagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import {
    SparklesIcon,
    TrophyIcon,
    StarIcon,
    GiftIcon,
} from "@heroicons/react/24/outline";

const TYPE_LABELS = {
    purchase: "通常ポイント",
    bonus: "ボーナスポイント",
    referral: "紹介ポイント",
    adjustment: "調整",
    redemption: "ポイント交換",
};

const formatAmount = (amount) =>
    new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(amount || 0);

export default function Index({ membership, pointTransactions }) {
    const breadcrumbs = [
        { label: "ダッシュボード", href: "/dashboard" },
        { label: "ポイント", href: null },
    ];

    const transactions = pointTransactions?.data || [];

    const headerActions = [
        {
            label: "ポイントを交換する",
            icon: GiftIcon,
            variant: "primary",
            route: route("user.point-redemptions.index"),
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="ポイント"
                    description="ご利用状況に応じたポイント残高・会員ランクを確認できます"
                    breadcrumbs={breadcrumbs}
                    actions={headerActions}
                />
            }
        >
            <Head title="ポイント" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8 space-y-6">
                {!membership ? (
                    <Card>
                        <CardBody>
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400">
                                    まだポイントの記録がありません
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                ) : (
                    <>
                        {/* 残高・ランク */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardBody>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                現在のポイント残高
                                            </p>
                                            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                                                {(
                                                    membership.points_balance ||
                                                    0
                                                ).toLocaleString()}
                                                pt
                                            </p>
                                        </div>
                                        <SparklesIcon className="h-8 w-8 text-amber-500" />
                                    </div>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                累計獲得ポイント
                                            </p>
                                            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                                                {(
                                                    membership.lifetime_points ||
                                                    0
                                                ).toLocaleString()}
                                                pt
                                            </p>
                                        </div>
                                        <StarIcon className="h-8 w-8 text-purple-500" />
                                    </div>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                現在のランク
                                            </p>
                                            <p className="mt-2">
                                                {membership.current_rank ? (
                                                    <Badge
                                                        variant="warning"
                                                        size="md"
                                                    >
                                                        {
                                                            membership
                                                                .current_rank
                                                                .name
                                                        }
                                                    </Badge>
                                                ) : (
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        未判定
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <TrophyIcon className="h-8 w-8 text-emerald-500" />
                                    </div>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        今年のご利用額
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatAmount(
                                            membership.annual_usage_amount,
                                        )}
                                    </p>
                                </CardBody>
                            </Card>
                        </div>

                        {/* 履歴 */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                ポイント履歴
                            </h2>
                            {transactions.length === 0 ? (
                                <Card>
                                    <CardBody>
                                        <div className="text-center py-12">
                                            <p className="text-gray-500 dark:text-gray-400">
                                                ポイント履歴はまだありません
                                            </p>
                                        </div>
                                    </CardBody>
                                </Card>
                            ) : (
                                <div className="grid gap-3">
                                    {transactions.map((transaction) => (
                                        <Card key={transaction.id}>
                                            <CardBody>
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {
                                                                transaction.description
                                                            }
                                                        </p>
                                                        <div className="mt-1 flex items-center gap-2">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                {new Date(
                                                                    transaction.created_at,
                                                                ).toLocaleString(
                                                                    "ja-JP",
                                                                )}
                                                            </span>
                                                            <Badge
                                                                variant="secondary"
                                                                size="xs"
                                                            >
                                                                {TYPE_LABELS[
                                                                    transaction
                                                                        .type
                                                                ] ||
                                                                    transaction.type}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <p
                                                        className={`text-lg font-bold ${
                                                            transaction.points >=
                                                            0
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        {transaction.points >= 0
                                                            ? "+"
                                                            : ""}
                                                        {transaction.points}pt
                                                    </p>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {pointTransactions?.links && (
                                <div className="mt-6">
                                    <UserPagination
                                        links={pointTransactions.links}
                                        meta={pointTransactions}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
