import React, { useEffect, useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import { Badge } from "@/Components/Badges";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";

export default function Index({ quoteResponses, filters, responseTypes }) {
    const [showFilters, setShowFilters] = useState(false);
    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        status: filters.status || "",
        response_type: filters.response_type || "",
    });

    // フィルターが変更されたときに検索を実行
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch();
        }, 300);

        return () => clearTimeout(timer);
    }, [data.status, data.response_type]);

    const handleSearch = () => {
        get(route("admin.quote-response.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setData({
            search: "",
            status: "",
            response_type: "",
        });
        router.get(
            route("admin.quote-response.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // アクティブフィルター数
    const activeFilterCount = [data.status, data.response_type].filter(
        (v) => v,
    ).length;

    const statusOptions = [
        { value: "pending", label: "未返信" },
        { value: "responded", label: "返信済み" },
    ];

    const responseTypeOptions = Object.entries(responseTypes).map(
        ([key, label]) => ({
            value: key,
            label: label,
        }),
    );

    const getStatusBadge = (response) => {
        if (!response.responded_at) {
            return <Badge variant="yellow">未返信</Badge>;
        }
        return <Badge variant="green">返信済み</Badge>;
    };

    const getResponseTypeBadge = (responseType) => {
        const labels = {
            request: "承認",
            decline: "拒否",
            revision_request: "見直し依頼",
            other: "その他",
        };
        return labels[responseType] || responseType;
    };

    const pageConfig = {
        title: "見積返信管理",
        description: "クライアントからの見積返信内容を管理します",
        breadcrumbs: [
            { label: "ダッシュボード", href: route("admin.dashboard") },
            {
                label: "見積返信管理",
                href: route("admin.quote-response.index"),
            },
        ],
    };

    return (
        <AdminAuthenticatedLayout header={<PageHeader {...pageConfig} />}>
            <Head title="見積返信管理" />

            <FlashMessage />

            <div className="space-y-4">
                <Card>
                    <div className="flex flex-col gap-4">
                        <SearchBar
                            value={data.search}
                            onChange={(value) => setData("search", value)}
                            onSearch={handleSearch}
                            placeholder="メールアドレスまたは見積番号で検索..."
                            disabled={processing}
                        />

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                <FunnelIcon className="w-4 h-4" />
                                フィルター
                                {activeFilterCount > 0 && (
                                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>

                            {activeFilterCount > 0 && (
                                <SecondaryButton
                                    onClick={handleClearFilters}
                                    disabled={processing}
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                    フィルターをクリア
                                </SecondaryButton>
                            )}
                        </div>

                        {showFilters && (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                                <FilterSelect
                                    label="返信状態"
                                    value={data.status}
                                    onChange={(value) =>
                                        setData("status", value)
                                    }
                                    options={statusOptions}
                                />

                                <FilterSelect
                                    label="返信タイプ"
                                    value={data.response_type}
                                    onChange={(value) =>
                                        setData("response_type", value)
                                    }
                                    options={responseTypeOptions}
                                />
                            </div>
                        )}
                    </div>
                </Card>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                        メールアドレス
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                        見積番号
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                        返信タイプ
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                        返信状態
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                        返信日時
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {quoteResponses.data.map((response) => (
                                    <tr
                                        key={response.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 text-gray-900">
                                            {response.email}
                                        </td>
                                        <td className="px-4 py-3 text-gray-900">
                                            {response.quote?.quote_number ||
                                                "-"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-900">
                                            {getResponseTypeBadge(
                                                response.response_type,
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {getStatusBadge(response)}
                                        </td>
                                        <td className="px-4 py-3 text-gray-900">
                                            {response.responded_at
                                                ? new Date(
                                                      response.responded_at,
                                                  ).toLocaleString("ja-JP")
                                                : "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={route(
                                                    "admin.quote-response.show",
                                                    response.id,
                                                )}
                                            >
                                                <SecondaryButton>
                                                    詳細
                                                </SecondaryButton>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {quoteResponses.data.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                返信がまだありません
                            </div>
                        )}
                    </div>
                </Card>

                <Pagination links={quoteResponses.links} />
            </div>
        </AdminAuthenticatedLayout>
    );
}
