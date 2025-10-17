import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    ArrowLeftIcon,
    SwatchIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";
// Layouts
import AdminLayout from "@/Layouts/AdminLayout";
// Constants
import { CommonUIConstants } from "@/Constants/CommonUIConstants";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import { useFieldValidation } from "@/Hooks/useFieldValidation";
// ServiceType Components
import BasicInfoSection from "./Components/BasicInfoSection";
import PricingSection from "./Components/PricingSection";
import ArrayInputSection from "./Components/ArrayInputSection";
// Features
import { ServiceTypesConstants } from "@/Features/ServiceTypes/constants";
import {
    serviceTypeEditValidationRules,
    validateAllServiceTypeFields,
} from "@/Features/ServiceTypes/validation";

export default function ServiceTypesEdit({ serviceType, serviceCategories }) {
    const [showPreview, setShowPreview] = useState(false);

    // フォームデータ管理
    const { data, setData, patch, processing, errors, clearErrors } = useForm({
        service_category_id:
            serviceType.data?.service_category_id ||
            serviceType.service_category_id ||
            "",
        name: serviceType.data?.name || serviceType.name || "",
        slug: serviceType.data?.slug || serviceType.slug || "",
        description:
            serviceType.data?.description || serviceType.description || "",
        detailed_description:
            serviceType.data?.detailed_description ||
            serviceType.detailed_description ||
            "",
        pricing_model:
            serviceType.data?.pricing_model ||
            serviceType.pricing_model ||
            "fixed",
        features: serviceType.data?.features || serviceType.features || [],
        target_audience:
            serviceType.data?.target_audience ||
            serviceType.target_audience ||
            [],
        deliverables:
            serviceType.data?.deliverables || serviceType.deliverables || [],
        technologies:
            serviceType.data?.technologies || serviceType.technologies || [],
        icon: serviceType.data?.icon || serviceType.icon || "",
        color: serviceType.data?.color || serviceType.color || "#3B82F6",
        estimated_delivery_days:
            serviceType.data?.estimated_delivery_days ||
            serviceType.estimated_delivery_days ||
            "",
        base_price:
            serviceType.data?.base_price || serviceType.base_price || "",
        price_unit:
            serviceType.data?.price_unit || serviceType.price_unit || "",
        sort_order:
            serviceType.data?.sort_order || serviceType.sort_order || "",
        is_active: serviceType.data?.is_active ?? serviceType.is_active ?? true,
        is_featured:
            serviceType.data?.is_featured ?? serviceType.is_featured ?? false,
        requires_consultation:
            serviceType.data?.requires_consultation ??
            serviceType.requires_consultation ??
            false,
        consultation_note:
            serviceType.data?.consultation_note ||
            serviceType.consultation_note ||
            "",
        published_at:
            serviceType.data?.published_at || serviceType.published_at
                ? new Date(
                      serviceType.data?.published_at || serviceType.published_at
                  )
                      .toISOString()
                      .slice(0, 16)
                : "",
    });

    // フロントエンドバリデーション
    const {
        errors: validationErrors,
        touched,
        handleFieldBlur,
        validateAll,
    } = useFieldValidation();

    // バリデーションルールを使用
    const validationRules = serviceTypeEditValidationRules; // 名前変更時のスラッグ自動更新（既存のスラッグがある場合は更新しない）
    useEffect(() => {
        const originalName = serviceType.data?.name || serviceType.name;
        if (data.name && data.name !== originalName && !data.slug) {
            const slug = data.name
                .toLowerCase()
                .replace(
                    /[^a-z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g,
                    "-"
                )
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");
            setData("slug", slug);
        }
    }, [data.name]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // フロントエンドバリデーション実行
        const frontendValidationErrors = validateAllServiceTypeFields(
            data,
            validationRules
        );
        if (Object.keys(frontendValidationErrors).length > 0) {
            console.log("Validation errors:", frontendValidationErrors);
            return;
        }

        // バックエンドエラーをクリア
        clearErrors();

        const serviceTypeId = serviceType.data?.id || serviceType.id;
        patch(
            route("admin.service.type.update", { serviceType: serviceTypeId })
        );
    };

    const addArrayItem = (field, item) => {
        setData(field, [...data[field], item]);
    };

    const removeArrayItem = (field, index) => {
        setData(
            field,
            data[field].filter((_, i) => i !== index)
        );
    };

    // 共有定数を使用
    const { commonIcons } = CommonUIConstants;

    const formatPrice = (price, unit) => {
        if (!price) return "要相談";
        return `¥${Number(price).toLocaleString()}${unit ? `/${unit}` : ""}`;
    };

    const PreviewCard = () => (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
                {data.color && (
                    <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: data.color }}
                    ></div>
                )}
                {data.icon && <i className={`${data.icon} mr-3 text-lg`}></i>}
                <h3 className="text-lg font-medium text-gray-900">
                    {data.name || "サービス名"}
                </h3>
            </div>

            {data.description && (
                <p className="text-gray-600 mb-4">{data.description}</p>
            )}

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">価格:</span>
                    <span className="font-medium">
                        {formatPrice(data.base_price, data.price_unit)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">納期:</span>
                    <span className="font-medium">
                        {data.estimated_delivery_days
                            ? `${data.estimated_delivery_days}日`
                            : "要相談"}
                    </span>
                </div>
            </div>

            {data.features && data.features.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">特徴:</p>
                    <div className="flex flex-wrap gap-1">
                        {data.features.slice(0, 3).map((feature, index) => (
                            <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                                {feature}
                            </span>
                        ))}
                        {data.features.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                +{data.features.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <AdminLayout>
            <Head
                title={`${ServiceTypesConstants.pages.edit.title} - ${
                    serviceType.data?.name || serviceType.name
                }`}
            />

            <FlashMessage />

            <div className="space-y-6">
                <PageHeader
                    title={ServiceTypesConstants.pages.edit.title}
                    subtitle={serviceType.data?.name || serviceType.name}
                    breadcrumbs={[
                        {
                            label: ServiceTypesConstants.pages.index.title,
                            href: route("admin.service.type.index"),
                        },
                        {
                            label: serviceType.data?.name || serviceType.name,
                            href: route("admin.service.type.show", {
                                serviceType:
                                    serviceType.data?.id || serviceType.id,
                            }),
                        },
                        {
                            label: ServiceTypesConstants.pages.edit.title,
                            current: true,
                        },
                    ]}
                    actions={[
                        {
                            label: ServiceTypesConstants.form.buttons
                                .backToDetail,
                            href: route("admin.service.type.show", {
                                serviceType:
                                    serviceType.data?.id || serviceType.id,
                            }),
                            variant: "secondary",
                            icon: ArrowLeftIcon,
                        },
                        {
                            label: showPreview
                                ? "プレビューを隠す"
                                : "プレビュー",
                            onClick: () => setShowPreview(!showPreview),
                            variant: "secondary",
                            icon: EyeIcon,
                        },
                    ]}
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* メインコンテンツ */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* 基本情報 */}
                            <BasicInfoSection
                                data={data}
                                setData={setData}
                                errors={errors}
                                validationErrors={validationErrors}
                                handleFieldBlur={handleFieldBlur}
                                serviceCategories={serviceCategories}
                                ServiceTypesConstants={ServiceTypesConstants}
                            />

                            {/* 価格・納期設定 */}
                            <PricingSection
                                data={data}
                                setData={setData}
                                errors={errors}
                                validationErrors={validationErrors}
                                handleFieldBlur={handleFieldBlur}
                                ServiceTypesConstants={ServiceTypesConstants}
                            />

                            {/* 配列データ入力セクション */}
                            <ArrayInputSection
                                title="特徴・機能"
                                items={data.features}
                                onAdd={(item) => addArrayItem("features", item)}
                                onRemove={(index) =>
                                    removeArrayItem("features", index)
                                }
                                placeholder="レスポンシブデザイン"
                                badgeColorClass="bg-blue-100 text-blue-800"
                            />

                            <ArrayInputSection
                                title="対象顧客"
                                items={data.target_audience}
                                onAdd={(item) =>
                                    addArrayItem("target_audience", item)
                                }
                                onRemove={(index) =>
                                    removeArrayItem("target_audience", index)
                                }
                                placeholder="中小企業"
                                badgeColorClass="bg-green-100 text-green-800"
                            />

                            <ArrayInputSection
                                title="成果物"
                                items={data.deliverables}
                                onAdd={(item) =>
                                    addArrayItem("deliverables", item)
                                }
                                onRemove={(index) =>
                                    removeArrayItem("deliverables", index)
                                }
                                placeholder="Webサイト"
                                badgeColorClass="bg-purple-100 text-purple-800"
                            />

                            <ArrayInputSection
                                title="使用技術"
                                items={data.technologies}
                                onAdd={(item) =>
                                    addArrayItem("technologies", item)
                                }
                                onRemove={(index) =>
                                    removeArrayItem("technologies", index)
                                }
                                placeholder="Laravel"
                                badgeColorClass="bg-indigo-100 text-indigo-800"
                            />

                            {/* プレビュー */}
                            {showPreview && (
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            プレビュー
                                        </h3>
                                        <PreviewCard />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* サイドバー */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* ビジュアル設定 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <SwatchIcon className="w-5 h-5 mr-2" />
                                        ビジュアル設定
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                アイコン
                                            </label>
                                            <input
                                                type="text"
                                                value={data.icon}
                                                onChange={(e) =>
                                                    setData(
                                                        "icon",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="fas fa-globe"
                                            />
                                            <div className="mt-2 grid grid-cols-3 gap-2">
                                                {commonIcons.map((icon) => (
                                                    <button
                                                        key={icon}
                                                        type="button"
                                                        onClick={() =>
                                                            setData(
                                                                "icon",
                                                                icon
                                                            )
                                                        }
                                                        className="p-2 text-center border border-gray-300 rounded hover:bg-gray-50 text-sm"
                                                    >
                                                        <i className={icon}></i>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                テーマカラー
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={data.color}
                                                    onChange={(e) =>
                                                        setData(
                                                            "color",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.color}
                                                    onChange={(e) =>
                                                        setData(
                                                            "color",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="#3B82F6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 公開設定 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        公開設定
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                表示順序
                                            </label>
                                            <input
                                                type="number"
                                                value={data.sort_order}
                                                onChange={(e) =>
                                                    setData(
                                                        "sort_order",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0"
                                                min="0"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                公開日時
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={data.published_at}
                                                onChange={(e) =>
                                                    setData(
                                                        "published_at",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.is_active}
                                                    onChange={(e) =>
                                                        setData(
                                                            "is_active",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">
                                                    アクティブ
                                                </span>
                                            </label>

                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.is_featured}
                                                    onChange={(e) =>
                                                        setData(
                                                            "is_featured",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">
                                                    おすすめサービス
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 保存ボタン */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {processing
                                            ? "更新中..."
                                            : "サービスタイプを更新"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
