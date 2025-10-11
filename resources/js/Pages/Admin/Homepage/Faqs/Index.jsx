import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import {
    TrashIcon,
    PencilIcon,
    EyeIcon,
    PlusIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    CheckCircleIcon,
    XCircleIcon,
    StarIcon,
} from "@heroicons/react/24/outline";

export default function Index({ faqs, categories, filters }) {
    const [selectedFaqs, setSelectedFaqs] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [showBulkActions, setShowBulkActions] = useState(false);

    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        category: filters.category || "",
        status: filters.status || "",
        featured: filters.featured || "",
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route("admin.homepage.faqs.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setData({
            search: "",
            category: "",
            status: "",
            featured: "",
        });
        router.get(route("admin.homepage.faqs.index"));
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedFaqs(faqs.data.map((faq) => faq.id));
        } else {
            setSelectedFaqs([]);
        }
    };

    const handleSelectFaq = (faqId) => {
        setSelectedFaqs((prev) =>
            prev.includes(faqId)
                ? prev.filter((id) => id !== faqId)
                : [...prev, faqId]
        );
    };

    const handleBulkDelete = () => {
        if (confirm("選択されたFAQを削除してもよろしいですか？")) {
            router.delete(route("admin.homepage.faqs.bulk-destroy"), {
                data: { ids: selectedFaqs },
                onSuccess: () => setSelectedFaqs([]),
            });
        }
    };

    const handleBulkStatusUpdate = (isPublished) => {
        const action = isPublished ? "公開" : "非公開";
        if (confirm(`選択されたFAQを${action}にしてもよろしいですか？`)) {
            router.patch(
                route("admin.homepage.faqs.bulk-status"),
                {
                    ids: selectedFaqs,
                    is_published: isPublished,
                },
                {
                    onSuccess: () => setSelectedFaqs([]),
                }
            );
        }
    };

    const deleteFaq = (faq) => {
        if (confirm(`「${faq.question}」を削除してもよろしいですか？`)) {
            router.delete(route("admin.homepage.faqs.destroy", faq.id));
        }
    };

    const getStatusBadge = (faq) => {
        if (faq.is_published) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                    公開
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    下書き
                </span>
            );
        }
    };

    const getCategoryBadge = (category) => {
        if (!category) return null;

        return (
            <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: category.color }}
            >
                {category.name}
            </span>
        );
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        FAQ管理
                    </h2>
                    <Link
                        href={route("admin.homepage.faqs.create")}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        新規作成
                    </Link>
                </div>
            }
        >
            <Head title="FAQ管理" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* 検索・フィルター */}
                        <div className="p-6 border-b border-gray-200">
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="質問や回答で検索..."
                                                value={data.search}
                                                onChange={(e) =>
                                                    setData(
                                                        "search",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowFilters(!showFilters)
                                            }
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <FunnelIcon className="w-4 h-4 mr-2" />
                                            フィルター
                                            <ChevronDownIcon
                                                className={`w-4 h-4 ml-1 transform transition-transform ${
                                                    showFilters
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            検索
                                        </button>
                                        {(data.search ||
                                            data.category ||
                                            data.status ||
                                            data.featured) && (
                                            <button
                                                type="button"
                                                onClick={clearFilters}
                                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                クリア
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* 詳細フィルター */}
                                {showFilters && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                カテゴリ
                                            </label>
                                            <select
                                                value={data.category}
                                                onChange={(e) =>
                                                    setData(
                                                        "category",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">
                                                    全てのカテゴリ
                                                </option>
                                                {categories.map((category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                公開状態
                                            </label>
                                            <select
                                                value={data.status}
                                                onChange={(e) =>
                                                    setData(
                                                        "status",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">
                                                    全ての状態
                                                </option>
                                                <option value="published">
                                                    公開中
                                                </option>
                                                <option value="draft">
                                                    下書き
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                よくある質問
                                            </label>
                                            <select
                                                value={data.featured}
                                                onChange={(e) =>
                                                    setData(
                                                        "featured",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">全て</option>
                                                <option value="true">
                                                    よくある質問のみ
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* 一括操作 */}
                        {selectedFaqs.length > 0 && (
                            <div className="bg-blue-50 px-6 py-3 border-b border-blue-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-blue-800">
                                        {selectedFaqs.length}件選択中
                                    </span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleBulkStatusUpdate(true)
                                            }
                                            className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                        >
                                            一括公開
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleBulkStatusUpdate(false)
                                            }
                                            className="text-sm bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
                                        >
                                            一括非公開
                                        </button>
                                        <button
                                            onClick={handleBulkDelete}
                                            className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                        >
                                            一括削除
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* テーブル */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    faqs.data.length > 0 &&
                                                    selectedFaqs.length ===
                                                        faqs.data.length
                                                }
                                                onChange={handleSelectAll}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            質問
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            カテゴリ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            状態
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            よくある質問
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            表示順序
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            更新日
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            操作
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {faqs.data.map((faq) => (
                                        <tr
                                            key={faq.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFaqs.includes(
                                                        faq.id
                                                    )}
                                                    onChange={() =>
                                                        handleSelectFaq(faq.id)
                                                    }
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {faq.question}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {faq.answer.substring(
                                                            0,
                                                            80
                                                        )}
                                                        ...
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getCategoryBadge(
                                                    faq.faq_category
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(faq)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {faq.is_featured && (
                                                    <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {faq.sort_order}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(
                                                    faq.updated_at
                                                ).toLocaleDateString("ja-JP")}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium space-x-2">
                                                <Link
                                                    href={route(
                                                        "admin.homepage.faqs.show",
                                                        faq.id
                                                    )}
                                                    className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "admin.homepage.faqs.edit",
                                                        faq.id
                                                    )}
                                                    className="text-green-600 hover:text-green-900 inline-flex items-center"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        deleteFaq(faq)
                                                    }
                                                    className="text-red-600 hover:text-red-900 inline-flex items-center"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ページネーション */}
                        {faqs.links && (
                            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-700">
                                        {faqs.from}〜{faqs.to}件を表示 (全
                                        {faqs.total}件)
                                    </div>
                                    <div className="flex space-x-1">
                                        {faqs.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || "#"}
                                                className={`px-3 py-2 text-sm rounded ${
                                                    link.active
                                                        ? "bg-blue-500 text-white"
                                                        : link.url
                                                        ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* データなしの場合 */}
                        {faqs.data.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    FAQが見つかりませんでした。
                                </p>
                                <Link
                                    href={route("admin.homepage.faqs.create")}
                                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    最初のFAQを作成
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
