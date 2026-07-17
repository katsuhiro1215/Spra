import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { ConfirmAlert } from "@/Components/Alerts";
import { GiftIcon } from "@heroicons/react/24/outline";

const STATUS_BADGE_VARIANTS = {
    pending: "info",
    approved: "success",
    rejected: "danger",
};

const STATUS_LABELS = {
    pending: "申請中",
    approved: "承認済み",
    rejected: "却下",
};

export default function Index({ catalogItems, membership, redemptions }) {
    const [requestTarget, setRequestTarget] = useState(null);

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/dashboard" },
        { label: "ポイント交換", href: null },
    ];

    const balance = membership?.points_balance || 0;

    const handleRequest = () => {
        if (!requestTarget) return;
        router.post(
            route("user.point-redemptions.store"),
            { point_catalog_item_id: requestTarget.id },
            { onFinish: () => setRequestTarget(null) },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="ポイント交換"
                    description="貯まったポイントをサービスと交換できます"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="ポイント交換" />
            <FlashMessage />

            <ConfirmAlert
                isOpen={!!requestTarget}
                onClose={() => setRequestTarget(null)}
                onConfirm={handleRequest}
                title="交換申請の確認"
                message={`「${requestTarget?.name}」（${requestTarget?.points_cost}pt）と交換を申請します。承認され次第、担当者よりご案内いたします。よろしいですか？`}
                confirmText="申請する"
                type="confirm"
            />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8 space-y-8">
                <Card>
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                現在のポイント残高
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {balance.toLocaleString()}pt
                            </p>
                        </div>
                    </CardBody>
                </Card>

                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        交換カタログ
                    </h2>
                    {catalogItems.length === 0 ? (
                        <Card>
                            <CardBody>
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                    現在交換できる商品はありません
                                </div>
                            </CardBody>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {catalogItems.map((item) => {
                                const insufficient = balance < item.points_cost;
                                return (
                                    <Card key={item.id}>
                                        <CardBody>
                                            <div className="flex items-start gap-3">
                                                <GiftIcon className="h-8 w-8 text-emerald-600 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {item.name}
                                                    </p>
                                                    {item.description && (
                                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                    <p className="mt-2 text-lg font-bold text-emerald-600">
                                                        {item.points_cost.toLocaleString()}
                                                        pt
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setRequestTarget(item)
                                                }
                                                disabled={insufficient}
                                                className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >
                                                {insufficient
                                                    ? "ポイントが不足しています"
                                                    : "交換する"}
                                            </button>
                                        </CardBody>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        交換申請の履歴
                    </h2>
                    {redemptions.length === 0 ? (
                        <Card>
                            <CardBody>
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                    交換申請の履歴はまだありません
                                </div>
                            </CardBody>
                        </Card>
                    ) : (
                        <div className="grid gap-3">
                            {redemptions.map((redemption) => (
                                <Card key={redemption.id}>
                                    <CardBody>
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {redemption.item_name}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(
                                                        redemption.created_at,
                                                    ).toLocaleString("ja-JP")}
                                                </p>
                                                {redemption.status ===
                                                    "rejected" &&
                                                    redemption.rejection_reason && (
                                                        <p className="mt-1 text-xs text-red-500">
                                                            却下理由:{" "}
                                                            {
                                                                redemption.rejection_reason
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {redemption.points_used}pt
                                                </p>
                                                <Badge
                                                    variant={
                                                        STATUS_BADGE_VARIANTS[
                                                            redemption.status
                                                        ] || "secondary"
                                                    }
                                                    size="xs"
                                                >
                                                    {STATUS_LABELS[
                                                        redemption.status
                                                    ] || redemption.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
