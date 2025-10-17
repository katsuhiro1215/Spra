import React, { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import { ArrowLeftIcon, SwatchIcon } from "@heroicons/react/24/outline";
// Layouts
import AdminLayout from "@/Layouts/AdminLayout";
// Constants
import { CommonUIConstants } from "@/Constants/CommonUIConstants";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { useFieldValidation } from "@/Hooks/useFieldValidation";
// ServiceType Components
import BasicInfoSection from "./Components/BasicInfoSection";
import PricingSection from "./Components/PricingSection";
import ArrayInputSection from "./Components/ArrayInputSection";
// Features
import { ServiceTypesConstants } from "@/Features/ServiceTypes/constants";
import {
    serviceTypeCreateValidationRules,
    validateAllServiceTypeFields,
} from "@/Features/ServiceTypes/validation";

export default function ServiceTypesCreate({ serviceCategories }) {
    // フォームデータ管理
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        service_category_id: "",
        name: "",
        slug: "",
        description: "",
        detailed_description: "",
        pricing_model: "fixed",
        features: [],
        target_audience: [],
        deliverables: [],
        technologies: [],
        icon: "",
        color: "#3B82F6",
        estimated_delivery_days: "",
        base_price: "",
        price_unit: "",
        sort_order: "",
        is_active: true,
        is_featured: false,
        requires_consultation: false,
        consultation_note: "",
        published_at: "",
    });

    // フロントエンドバリデーション
    const {
        errors: validationErrors,
        touched,
        handleFieldBlur,
        validateAll,
    } = useFieldValidation();

    // バリデーションルールを使用
    const validationRules = serviceTypeCreateValidationRules;

    // 名前からスラッグを自動生成
    useEffect(() => {
        if (data.name && !data.slug) {
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

        post(route("admin.service.type.store"));
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

    // ページヘッダーのアクション設定
    const headerActions = [
        {
            label: CommonUIConstants.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.service.type.index"),
        },
    ];

    return (
        <AdminLayout>
            <Head title={ServiceTypesConstants.form.create.documentTitle} />

            <div className="space-y-6">
                {/* ヘッダー */}
                <PageHeader
                    title={ServiceTypesConstants.form.create.title}
                    description={ServiceTypesConstants.form.create.description}
                    actions={headerActions}
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
                                            ? "作成中..."
                                            : "サービスタイプを作成"}
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
