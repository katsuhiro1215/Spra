import React, { useState, useEffect } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { SecondaryButton, PrimaryButton } from "@/Components/Buttons";
import { Card } from "@/Components/Card";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
// Icons
import { XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
// Component
import Badge from "@/Components/Badge";

// Page Config
const PageConfig = {
    title: "返答テンプレート管理",
    description: "よく使う返答内容をテンプレートとして管理します",
    breadcrumbs: [
        { label: "ダッシュボード", href: route("admin.dashboard") },
        {
            label: "返答テンプレート",
            href: route("admin.responseTemplate.index"),
        },
    ],
};

export default function Index({
    templates = {},
    filters = {},
    categories = [],
}) {
    // ========================================
    // State & Form
    // ========================================
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        status: filters.status || "",
        category: filters.category || "",
    });

    // ========================================
    // Effects
    // ========================================
    // フィルターがアクティブな場合は自動的に開く
    useEffect(() => {
        if (data.status || data.category) {
            setShowFilters(true);
        }
    }, [data.status, data.category]);

    // フィルター変更時に自動検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                data.status !== filters.status ||
                data.category !== filters.category
            ) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [data.status, data.category]);

    // ========================================
    // Handlers - Search & Filter
    // ========================================
    const handleSearch = () => {
        get(route("admin.responseTemplate.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // フィルタークリア
    const handleClearFilters = () => {
        setData({
            search: "",
            status: "",
            category: "",
        });
        setShowFilters(false);
        get(route("admin.response-templates.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // 削除確認
    const handleDelete = (template) => {
        if (
            window.confirm(`「${template.name}」を削除してもよろしいですか？`)
        ) {
            router.delete(
                route("admin.response-templates.destroy", template.id),
            );
        }
    };

    // ========================================
    // Constants - Options & Config
    // ========================================
    const statusOptions = [
        { value: "active", label: "アクティブ" },
        { value: "inactive", label: "無効" },
    ];

    // const categoryOptions = categories.map((cat) => ({
    //     value: cat,
    //     label: cat,
    // }));

    const hasActiveFilters = data.status || data.category;
    const activeFilterCount = [data.status, data.category].filter(
        Boolean,
    ).length;

    // ステータスバッジの取得
    const getStatusBadge = (status) => {
        return status === "active"
            ? { label: "アクティブ", color: "green" }
            : { label: "無効", color: "slate" };
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.title}
                    description={PageConfig.description}
                    breadcrumbs={PageConfig.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.title} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 検索・フィルターカード */}
                <Card>
                    <div className="p-4 space-y-3">
                        {/* 検索バー + フィルタートグル + 作成ボタン */}
                        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                            {/* 検索バー */}
                            <div className="flex-1 max-w-md">
                                <SearchBar
                                    value={data.search}
                                    onChange={(value) =>
                                        setData("search", value)
                                    }
                                    onSearch={handleSearch}
                                    placeholder="テンプレート名で検索..."
                                    disabled={processing}
                                />
                            </div>

                            {/* フィルター・作成ボタン */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                                        hasActiveFilters
                                            ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400"
                                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                                    }`}
                                >
                                    <FunnelIcon className="h-4 w-4 mr-2" />
                                    フィルター
                                    {activeFilterCount > 0 && (
                                        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>

                                <Link
                                    href={route(
                                        "admin.responseTemplate.create",
                                    )}
                                >
                                    <PrimaryButton>
                                        新規テンプレート
                                    </PrimaryButton>
                                </Link>
                            </div>
                        </div>

                        {/* フィルター展開エリア */}
                        {showFilters && (
                            <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <FilterSelect
                                        label="ステータス"
                                        value={data.status}
                                        onChange={(value) =>
                                            setData("status", value)
                                        }
                                        options={statusOptions}
                                    />
                                    {categoryOptions.length > 0 && (
                                        <FilterSelect
                                            label="カテゴリ"
                                            value={data.category}
                                            onChange={(value) =>
                                                setData("category", value)
                                            }
                                            options={categoryOptions}
                                        />
                                    )}
                                    <div className="flex items-end">
                                        <SecondaryButton
                                            onClick={handleClearFilters}
                                            className="w-full"
                                        >
                                            <XMarkIcon className="h-4 w-4 mr-2" />
                                            フィルターをクリア
                                        </SecondaryButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* 一覧テーブル */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">
                                        テンプレート名
                                    </th>
                                    <th className="px-6 py-3 font-semibold">
                                        カテゴリ
                                    </th>
                                    <th className="px-6 py-3 font-semibold">
                                        ステータス
                                    </th>
                                    <th className="px-6 py-3 font-semibold">
                                        作成日
                                    </th>
                                    <th className="px-6 py-3 font-semibold">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {templates.data && templates.data.length > 0 ? (
                                    templates.data.map((template) => {
                                        const statusBadge = getStatusBadge(
                                            template.status,
                                        );
                                        return (
                                            <tr
                                                key={template.id}
                                                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                            >
                                                <td className="px-6 py-4 font-medium">
                                                    {template.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {template.category || "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        color={
                                                            statusBadge.color
                                                        }
                                                    >
                                                        {statusBadge.label}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(
                                                        template.created_at,
                                                    ).toLocaleDateString(
                                                        "ja-JP",
                                                        {
                                                            year: "numeric",
                                                            month: "2-digit",
                                                            day: "2-digit",
                                                        },
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.responseTemplate.show",
                                                                template.id,
                                                            )}
                                                        >
                                                            <SecondaryButton>
                                                                表示
                                                            </SecondaryButton>
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "admin.responseTemplate.edit",
                                                                template.id,
                                                            )}
                                                        >
                                                            <PrimaryButton>
                                                                編集
                                                            </PrimaryButton>
                                                        </Link>
                                                        <SecondaryButton
                                                            onClick={() =>
                                                                handleDelete(
                                                                    template,
                                                                )
                                                            }
                                                            className="!text-red-600 dark:!text-red-400"
                                                        >
                                                            削除
                                                        </SecondaryButton>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            テンプレートが見つかりません
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ページネーション */}
                    {templates.links && templates.links.length > 0 && (
                        <Pagination links={templates.links} />
                    )}
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
