import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    SwatchIcon,
    CurrencyYenIcon,
    ClockIcon,
    CheckIcon,
    XMarkIcon,
    StarIcon,
    TagIcon,
} from "@heroicons/react/24/outline";

export default function Show({ serviceType, servicePlan }) {
    const headerActions = [
        {
            label: "戻る",
            href: route("admin.service.plans.index", serviceType.id),
            variant: "secondary",
            icon: ArrowLeftIcon,
        },
        {
            label: "編集",
            href: route("admin.service.plans.edit", [
                serviceType.id,
                servicePlan.id,
            ]),
            variant: "primary",
            icon: PencilIcon,
        },
    ];

    const handleDelete = () => {
        if (confirm(`「${servicePlan.name}」を削除しますか？`)) {
            router.delete(
                route("admin.service.plans.destroy", [
                    serviceType.id,
                    servicePlan.id,
                ])
            );
        }
    };

    const formatPrice = (price, unit, setupFee) => {
        let priceText = price ? `¥${Number(price).toLocaleString()}` : "要相談";
        if (unit) priceText += `/${unit}`;
        if (setupFee > 0) {
            priceText += ` (初期費用: ¥${Number(setupFee).toLocaleString()})`;
        }
        return priceText;
    };

    const getBillingCycleLabel = (cycle) => {
        const labels = {
            one_time: "一回払い",
            monthly: "月額",
            quarterly: "四半期",
            yearly: "年額",
        };
        return labels[cycle] || cycle;
    };

    const StatusBadge = ({ isActive }) => (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
            }`}
        >
            {isActive ? (
                <>
                    <CheckIcon className="h-3 w-3 mr-1" />
                    アクティブ
                </>
            ) : (
                <>
                    <XMarkIcon className="h-3 w-3 mr-1" />
                    非アクティブ
                </>
            )}
        </span>
    );

    return (
        <AdminLayout>
            <Head title={`${servicePlan.name} - サービスプラン詳細`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FlashMessage />

                    <PageHeader
                        title={servicePlan.name}
                        description={`${serviceType.name}のプラン詳細`}
                        actions={headerActions}
                    />

                    <div className="mt-6 space-y-6">
                        {/* 基本情報カード */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center">
                                        {servicePlan.color && (
                                            <div
                                                className="w-4 h-4 rounded-full mr-3"
                                                style={{
                                                    backgroundColor:
                                                        servicePlan.color,
                                                }}
                                            />
                                        )}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {servicePlan.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {servicePlan.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <StatusBadge
                                            isActive={servicePlan.is_active}
                                        />
                                        {servicePlan.is_popular && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                <StarIcon className="h-3 w-3 mr-1" />
                                                人気
                                            </span>
                                        )}
                                        {servicePlan.is_recommended && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                推奨
                                            </span>
                                        )}
                                        {servicePlan.badge_text && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                <TagIcon className="h-3 w-3 mr-1" />
                                                {servicePlan.badge_text}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {servicePlan.detailed_description && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                                            詳細説明
                                        </h4>
                                        <p className="text-sm text-gray-700 whitespace-pre-line">
                                            {servicePlan.detailed_description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 価格情報 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                        <CurrencyYenIcon className="w-5 h-5 mr-2" />
                                        価格情報
                                    </h3>
                                    <Link
                                        href={route(
                                            "admin.service.plans.pricing.index",
                                            [serviceType.id, servicePlan.id]
                                        )}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <CurrencyYenIcon className="h-4 w-4 mr-2" />
                                        価格設定を管理
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <dt className="text-sm font-medium text-gray-500">
                                            基本価格
                                        </dt>
                                        <dd className="mt-1 text-lg font-semibold text-gray-900">
                                            {formatPrice(
                                                servicePlan.base_price,
                                                servicePlan.price_unit,
                                                0
                                            )}
                                        </dd>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <dt className="text-sm font-medium text-gray-500">
                                            初期費用
                                        </dt>
                                        <dd className="mt-1 text-lg font-semibold text-gray-900">
                                            {servicePlan.setup_fee > 0
                                                ? `¥${Number(
                                                      servicePlan.setup_fee
                                                  ).toLocaleString()}`
                                                : "無料"}
                                        </dd>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <dt className="text-sm font-medium text-gray-500">
                                            請求サイクル
                                        </dt>
                                        <dd className="mt-1 text-lg font-semibold text-gray-900">
                                            {getBillingCycleLabel(
                                                servicePlan.billing_cycle
                                            )}
                                        </dd>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <dt className="text-sm font-medium text-gray-500">
                                            標準納期
                                        </dt>
                                        <dd className="mt-1 text-lg font-semibold text-gray-900">
                                            {servicePlan.estimated_delivery_days
                                                ? `${servicePlan.estimated_delivery_days}日`
                                                : "要相談"}
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* プラン詳細情報 */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* 機能・特徴 */}
                            {servicePlan.features &&
                                servicePlan.features.length > 0 && (
                                    <div className="bg-white shadow rounded-lg">
                                        <div className="px-4 py-5 sm:p-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                機能・特徴
                                            </h3>
                                            <ul className="space-y-2">
                                                {servicePlan.features.map(
                                                    (feature, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex items-start"
                                                        >
                                                            <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                            <span className="text-sm text-gray-700">
                                                                {feature}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                            {/* 含まれる項目 */}
                            {servicePlan.included_items &&
                                servicePlan.included_items.length > 0 && (
                                    <div className="bg-white shadow rounded-lg">
                                        <div className="px-4 py-5 sm:p-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                含まれる項目
                                            </h3>
                                            <ul className="space-y-2">
                                                {servicePlan.included_items.map(
                                                    (item, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex items-start"
                                                        >
                                                            <SwatchIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                                            <span className="text-sm text-gray-700">
                                                                {item}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                            {/* 制限事項 */}
                            {servicePlan.limitations &&
                                servicePlan.limitations.length > 0 && (
                                    <div className="bg-white shadow rounded-lg">
                                        <div className="px-4 py-5 sm:p-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                制限事項
                                            </h3>
                                            <ul className="space-y-2">
                                                {servicePlan.limitations.map(
                                                    (limitation, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex items-start"
                                                        >
                                                            <XMarkIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                                            <span className="text-sm text-gray-700">
                                                                {limitation}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* その他の情報 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    その他の情報
                                </h3>

                                <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            最大修正回数
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {servicePlan.max_revisions ||
                                                "制限なし"}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            表示順序
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {servicePlan.sort_order}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            スラッグ
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 font-mono">
                                            {servicePlan.slug}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            アイコン
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {servicePlan.icon || "未設定"}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* 管理情報 */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    管理情報
                                </h3>

                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            作成者
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {servicePlan.creator?.name ||
                                                "不明"}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            最終更新者
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {servicePlan.updater?.name ||
                                                "未更新"}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            作成日時
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {new Date(
                                                servicePlan.created_at
                                            ).toLocaleString("ja-JP")}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            最終更新日時
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {new Date(
                                                servicePlan.updated_at
                                            ).toLocaleString("ja-JP")}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* 操作ボタン */}
                        <div className="flex items-center justify-end space-x-3">
                            <Link
                                href={route("admin.service.plans.edit", [
                                    serviceType.id,
                                    servicePlan.id,
                                ])}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <PencilIcon className="h-4 w-4 mr-2" />
                                編集
                            </Link>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                削除
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
