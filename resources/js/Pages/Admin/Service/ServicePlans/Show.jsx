import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Dl, Dt, Dd } from "@/Components/Description";
import { FlashMessage } from "@/Components/Notifications";
import { EditButton, DeleteButton } from "@/Components/Buttons";
// Icons
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
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Show({ servicePlan }) {
    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.servicePlans.actions.back,
            icon: ArrowLeftIcon,
            variant: "default",
            href: route("admin.service.plan.index"),
        },
    ];
    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.servicePlans.breadcrumbs,
        PageConfig.servicePlans.pages.show.breadcrumb,
    ];

    const handleDelete = () => {
        if (confirm(`「${servicePlan.name}」を削除しますか？`)) {
            router.delete(route("admin.service.plan.destroy", servicePlan.id));
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
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.servicePlans.pages.show.title}
                    description={PageConfig.servicePlans.pages.show.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head
                title={`${PageConfig.servicePlans.pages.show.title} - ${servicePlan.name}`}
            />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="space-y-6">
                {/* 操作ボタン */}
                <div className="flex items-center justify-end space-x-3">
                    <Link
                        href={route("admin.service.plan.edit", servicePlan.id)}
                    >
                        <EditButton>編集</EditButton>
                    </Link>
                    <DeleteButton onClick={handleDelete}>削除</DeleteButton>
                </div>

                <div className="space-y-6">
                    {/* 基本情報カード */}
                    <Card>
                        <CardBody>
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
                        </CardBody>
                    </Card>

                    {/* 価格情報 */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center">
                                <CurrencyYenIcon className="w-5 h-5 mr-2" />
                                価格情報
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-blue-400 rounded-lg p-4">
                                    <Dt>基本価格</Dt>
                                    <Dd>
                                        {formatPrice(
                                            servicePlan.base_price,
                                            servicePlan.price_unit,
                                            0,
                                        )}
                                    </Dd>
                                </div>

                                <div className="bg-blue-400 rounded-lg p-4">
                                    <Dt>初期費用</Dt>
                                    <Dd>
                                        {servicePlan.setup_fee > 0
                                            ? `¥${Number(
                                                  servicePlan.setup_fee,
                                              ).toLocaleString()}`
                                            : "無料"}
                                    </Dd>
                                </div>

                                <div className="bg-blue-400 rounded-lg p-4">
                                    <Dt>請求サイクル</Dt>
                                    <Dd>
                                        {getBillingCycleLabel(
                                            servicePlan.billing_cycle,
                                        )}
                                    </Dd>
                                </div>

                                <div className="bg-blue-400 rounded-lg p-4">
                                    <Dt>標準納期</Dt>
                                    <Dd>
                                        {servicePlan.estimated_delivery_days
                                            ? `${servicePlan.estimated_delivery_days}日`
                                            : "要相談"}
                                    </Dd>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* プラン詳細情報 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 機能・特徴 */}
                        {servicePlan.features &&
                            servicePlan.features.length > 0 && (
                                <Card>
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
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </Card>
                            )}

                        {/* 含まれる項目 */}
                        {servicePlan.included_items &&
                            servicePlan.included_items.length > 0 && (
                                <Card>
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
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </Card>
                            )}

                        {/* 制限事項 */}
                        {servicePlan.limitations &&
                            servicePlan.limitations.length > 0 && (
                                <Card>
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
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </Card>
                            )}
                    </div>

                    {/* その他の情報 */}
                    <Card>
                        <CardHeader>その他の事情</CardHeader>
                        <CardBody>
                            <Dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <Dt>最大修正回数</Dt>
                                    <Dd>
                                        {servicePlan.max_revisions ||
                                            "制限なし"}
                                    </Dd>
                                </div>

                                <div>
                                    <Dt>表示順序</Dt>
                                    <Dd>{servicePlan.sort_order}</Dd>
                                </div>

                                <div>
                                    <Dt>スラッグ</Dt>
                                    <Dd>{servicePlan.slug}</Dd>
                                </div>

                                <div>
                                    <Dt>アイコン</Dt>
                                    <Dd>{servicePlan.icon || "未設定"}</Dd>
                                </div>
                            </Dl>
                        </CardBody>
                    </Card>

                    {/* 管理情報 */}
                    <Card>
                        <CardHeader>管理情報</CardHeader>
                        <CardBody>
                            <Dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Dt>作成者</Dt>
                                    <Dd>
                                        {servicePlan.creator?.name || "不明"}
                                    </Dd>
                                </div>

                                <div>
                                    <Dt>最終更新者</Dt>
                                    <Dd>
                                        {servicePlan.updater?.name || "未更新"}
                                    </Dd>
                                </div>

                                <div>
                                    <Dt>作成日時</Dt>
                                    <Dd>
                                        {new Date(
                                            servicePlan.created_at,
                                        ).toLocaleString("ja-JP")}
                                    </Dd>
                                </div>

                                <div>
                                    <Dt>最終更新日時</Dt>
                                    <Dd>
                                        {new Date(
                                            servicePlan.updated_at,
                                        ).toLocaleString("ja-JP")}
                                    </Dd>
                                </div>
                            </Dl>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
