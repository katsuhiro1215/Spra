import React, { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { PlusIcon } from "@heroicons/react/24/outline";

// 定数
import { ServiceTypesConstants } from "@/Constants/ServiceTypesConstants";
import { CommonUIConstants } from "@/Constants/CommonUIConstants";

// 汎用コンポーネント
import Pagination from "@/Components/Pagination";
import SearchFilter from "@/Components/SearchFilter";
import PageHeader from "@/Components/PageHeader";

// 画面専用コンポーネント
import ServiceTypesBulkActions from "./Components/ServiceTypesBulkActions";
import ServiceTypesTable from "./Components/ServiceTypesTable";

const ServiceTypesIndex = ({
    serviceTypes,
    serviceCategories,
    pricingModels,
    filters,
    sort,
}) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [bulkAction, setBulkAction] = useState("");

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        category_id: filters.category_id || "",
        pricing_model: filters.pricing_model || "",
        status: filters.status || "",
        sort: sort.field,
        direction: sort.direction,
    });

    // 検索実行
    const handleSearch = () => {
        get(route("admin.service.service-types.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ソート処理
    const handleSort = (field) => {
        const direction =
            data.sort === field && data.direction === "asc" ? "desc" : "asc";
        setData("sort", field);
        setData("direction", direction);

        // 即座にソート実行
        get(route("admin.service.service-types.index"), {
            data: { ...data, sort: field, direction },
            preserveState: true,
            preserveScroll: true,
        });
    };

    // 全選択/全解除
    const toggleSelectAll = () => {
        if (selectedItems.length === serviceTypes.data.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(serviceTypes.data.map((item) => item.id));
        }
    };

    // 個別選択
    const toggleSelectItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    // 一括操作実行
    const handleBulkAction = (action) => {
        if (selectedItems.length === 0) return;

        const confirmed = confirm(
            ServiceTypesConstants.confirmMessages.bulkAction(
                selectedItems.length,
                action
            )
        );

        if (confirmed) {
            router.post(
                route("admin.service.service-types.bulk-action"),
                {
                    action,
                    ids: selectedItems,
                },
                {
                    onSuccess: () => {
                        setSelectedItems([]);
                        setBulkAction("");
                    },
                }
            );
        }
    };

    // 削除処理
    const handleDelete = (id) => {
        const confirmed = confirm(ServiceTypesConstants.confirmMessages.delete);
        if (confirmed) {
            router.delete(route("admin.service.service-types.destroy", id));
        }
    };

    // フィルター設定を作成
    const searchFilterConfig = [
        {
            key: "category_id",
            label: ServiceTypesConstants.filters.category.label,
            placeholder: ServiceTypesConstants.filters.category.placeholder,
            options: serviceCategories.map((category) => ({
                value: category.id,
                label: category.name,
            })),
        },
        {
            key: "pricing_model",
            label: ServiceTypesConstants.filters.pricingModel.label,
            placeholder: ServiceTypesConstants.filters.pricingModel.placeholder,
            options: Object.entries(pricingModels).map(([key, label]) => ({
                value: key,
                label: label,
            })),
        },
        {
            key: "status",
            label: ServiceTypesConstants.filters.status.label,
            placeholder: ServiceTypesConstants.filters.status.placeholder,
            options: [
                {
                    value: "active",
                    label: ServiceTypesConstants.filters.status.options.active,
                },
                {
                    value: "inactive",
                    label: ServiceTypesConstants.filters.status.options
                        .inactive,
                },
                {
                    value: "featured",
                    label: ServiceTypesConstants.filters.status.options
                        .featured,
                },
            ],
        },
    ];

    // ページヘッダーのアクション設定
    const headerActions = [
        {
            label: ServiceTypesConstants.actions.create,
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.service.service-types.create"),
        },
    ];

    return (
        <AdminLayout>
            <Head title={ServiceTypesConstants.page.documentTitle} />

            <div className="space-y-6">
                {/* ヘッダー */}
                <PageHeader
                    title={ServiceTypesConstants.page.title}
                    description={ServiceTypesConstants.page.description}
                    actions={headerActions}
                />

                {/* 検索・フィルター */}
                <SearchFilter
                    data={data}
                    setData={setData}
                    onSearch={handleSearch}
                    processing={processing}
                    searchPlaceholder={ServiceTypesConstants.search.placeholder}
                    filters={searchFilterConfig}
                />

                {/* 一括操作 */}
                <ServiceTypesBulkActions
                    selectedItems={selectedItems}
                    bulkAction={bulkAction}
                    setBulkAction={setBulkAction}
                    onBulkAction={handleBulkAction}
                    serviceTypesCount={serviceTypes.data?.length || 0}
                />

                {/* テーブル */}
                <ServiceTypesTable
                    serviceTypes={serviceTypes}
                    selectedItems={selectedItems}
                    onToggleSelectAll={toggleSelectAll}
                    onToggleSelectItem={toggleSelectItem}
                    data={data}
                    onSort={handleSort}
                    pricingModels={pricingModels}
                    onDelete={handleDelete}
                />

                {/* ページネーション */}
                <Pagination paginationData={serviceTypes} />
            </div>
        </AdminLayout>
    );
};

export default ServiceTypesIndex;
