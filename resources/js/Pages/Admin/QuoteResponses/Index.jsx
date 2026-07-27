import React, { useEffect, useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import { Badge } from "@/Components/Badges";
import { SecondaryButton, TextButton } from "@/Components/Buttons";
import { ConfirmAlert } from "@/Components/Alerts";
import { XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function Index({ quoteResponses, filters, responseTypes }) {
    const [showFilters, setShowFilters] = useState(false);
    const [declineTarget, setDeclineTarget] = useState(null);

    const handleConfirmDecline = () => {
        if (!declineTarget) return;
        router.post(
            route("admin.quote-response.mark-declined", declineTarget.id),
            {},
            { preserveScroll: true, onFinish: () => setDeclineTarget(null) },
        );
    };
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
            return <Badge variant="warning">未返信</Badge>;
        }
        return <Badge variant="success">返信済み</Badge>;
    };

    const getElapsedDays = (response) => {
        const diffMs = Date.now() - new Date(response.created_at).getTime();
        return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    };

    const responseTypeVariants = {
        request: "success",
        decline: "danger",
        revision_request: "warning",
        other: "secondary",
    };

    const getResponseTypeLabel = (responseType) => {
        const labels = {
            request: "承認",
            decline: "拒否",
            revision_request: "見直し依頼",
            other: "その他",
        };
        return labels[responseType] || responseType;
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.quoteResponses.title}
                    description={PageConfig.quoteResponses.description}
                    breadcrumbs={PageConfig.quoteResponses.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.quoteResponses.documentTitle} />

            <FlashMessage />

            <div className="space-y-4">
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
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                            <FunnelIcon className="w-4 h-4" />
                            フィルター
                            {activeFilterCount > 0 && (
                                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 dark:bg-blue-500 rounded-full">
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
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg space-y-3">
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

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        メールアドレス
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        見積番号
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        返信タイプ
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        返信状態
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        確認
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        返信日時
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        経過日数
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {quoteResponses.data.map((response) => (
                                    <tr
                                        key={response.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                            {response.email}
                                        </td>
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                            {response.quote?.quote_number ||
                                                "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant={
                                                    responseTypeVariants[
                                                        response
                                                            .response_type
                                                    ] || "secondary"
                                                }
                                            >
                                                {getResponseTypeLabel(
                                                    response.response_type,
                                                )}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            {getStatusBadge(response)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {response.admin_reviewed_at ? (
                                                <Badge variant="success">
                                                    確認済み
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    未確認
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                            {response.responded_at
                                                ? new Date(
                                                      response.responded_at,
                                                  ).toLocaleString("ja-JP")
                                                : "-"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                            {!response.responded_at
                                                ? `${getElapsedDays(response)}日`
                                                : "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
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
                                                {!response.responded_at && (
                                                    <TextButton
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() =>
                                                            setDeclineTarget(
                                                                response,
                                                            )
                                                        }
                                                    >
                                                        NG判定
                                                    </TextButton>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {quoteResponses.data.length === 0 && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                返信がまだありません
                            </div>
                        )}
                    </div>
                </Card>

                {quoteResponses.data.length > 0 && (
                    <Pagination paginationData={quoteResponses} />
                )}
            </div>

            <ConfirmAlert
                isOpen={!!declineTarget}
                onClose={() => setDeclineTarget(null)}
                onCancel={() => setDeclineTarget(null)}
                onConfirm={handleConfirmDecline}
                title="未回答をNGとして処理しますか？"
                message={`「${declineTarget?.email}」への見積は送信から${declineTarget ? getElapsedDays(declineTarget) : 0}日間返答がありません。見送り(NG)として記録します。この操作はクライアントからの回答ではなく、管理者による手動判定として記録されます。`}
                confirmText="NGとして処理"
                cancelText="キャンセル"
                type="warning"
            />
        </AdminAuthenticatedLayout>
    );
}
