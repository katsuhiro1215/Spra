import React, { useState, useCallback } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import UploadModal from "./UploadModal";
import {
    FolderIcon,
    PhotoIcon,
    VideoCameraIcon,
    DocumentIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    PlusIcon,
    TrashIcon,
    PencilIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";
import {
    PhotoIcon as PhotoSolidIcon,
    VideoCameraIcon as VideoSolidIcon,
    DocumentIcon as DocumentSolidIcon,
} from "@heroicons/react/24/solid";

const MediaIndex = ({ media, folders, filters, flash }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get } = useForm({
        search: filters.search || "",
        type: filters.type || "",
        folder: filters.folder || "",
    });

    // 検索・フィルタリング
    const handleFilter = useCallback(
        (key, value) => {
            setData(key, value);
            get(route("admin.media.index"), {
                preserveState: true,
                preserveScroll: true,
            });
        },
        [setData, get]
    );

    // 一括選択
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedItems(media.data.map((item) => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id, checked) => {
        if (checked) {
            setSelectedItems((prev) => [...prev, id]);
        } else {
            setSelectedItems((prev) => prev.filter((item) => item !== id));
        }
    };

    // 一括削除
    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return;

        if (
            confirm(
                `選択した${selectedItems.length}件のアイテムを削除しますか？`
            )
        ) {
            router.delete(route("admin.media.bulk-destroy"), {
                data: { ids: selectedItems },
                onSuccess: () => setSelectedItems([]),
            });
        }
    };

    // ファイルタイプのアイコン
    const getTypeIcon = (type) => {
        switch (type) {
            case "image":
                return <PhotoSolidIcon className="w-5 h-5 text-blue-500" />;
            case "video":
                return <VideoSolidIcon className="w-5 h-5 text-purple-500" />;
            default:
                return <DocumentSolidIcon className="w-5 h-5 text-gray-500" />;
        }
    };

    // ファイルサイズの表示
    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <AdminLayout>
            <Head title="メディア管理" />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            メディア管理
                        </h1>
                        <p className="text-gray-600">
                            画像、動画、ドキュメントを管理
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <FunnelIcon className="w-4 h-4 mr-2" />
                            フィルター
                        </button>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            ファイルアップロード
                        </button>
                    </div>
                </div>

                {/* フィルターパネル */}
                {showFilters && (
                    <div className="bg-white p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* 検索 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    検索
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={data.search}
                                        onChange={(e) =>
                                            handleFilter(
                                                "search",
                                                e.target.value
                                            )
                                        }
                                        placeholder="ファイル名で検索..."
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            {/* ファイルタイプ */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ファイルタイプ
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) =>
                                        handleFilter("type", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">すべて</option>
                                    <option value="image">画像</option>
                                    <option value="video">動画</option>
                                    <option value="document">
                                        ドキュメント
                                    </option>
                                </select>
                            </div>

                            {/* フォルダ */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    フォルダ
                                </label>
                                <select
                                    value={data.folder}
                                    onChange={(e) =>
                                        handleFilter("folder", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">すべて</option>
                                    {folders.map((folder) => (
                                        <option key={folder} value={folder}>
                                            {folder}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 表示モード */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    表示モード
                                </label>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                                            viewMode === "grid"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        グリッド
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                                            viewMode === "list"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        リスト
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 一括操作バー */}
                {selectedItems.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-blue-800 font-medium">
                                {selectedItems.length}件選択中
                            </span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleBulkDelete}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                                >
                                    <TrashIcon className="w-4 h-4 mr-1" />
                                    削除
                                </button>
                                <button
                                    onClick={() => setSelectedItems([])}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    選択解除
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* メディア一覧 */}
                <div className="bg-white shadow rounded-lg">
                    {viewMode === "grid" ? (
                        // グリッド表示
                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                {media.data.map((item) => (
                                    <div
                                        key={item.id}
                                        className="relative group"
                                    >
                                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                            {item.type === "image" ? (
                                                <img
                                                    src={item.url}
                                                    alt={
                                                        item.alt_text ||
                                                        item.filename
                                                    }
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    {getTypeIcon(item.type)}
                                                </div>
                                            )}

                                            {/* オーバーレイ */}
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            router.get(
                                                                route(
                                                                    "admin.media.show",
                                                                    item.id
                                                                )
                                                            )
                                                        }
                                                        className="p-2 bg-white rounded-full hover:bg-gray-100"
                                                    >
                                                        <EyeIcon className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            router.get(
                                                                route(
                                                                    "admin.media.edit",
                                                                    item.id
                                                                )
                                                            )
                                                        }
                                                        className="p-2 bg-white rounded-full hover:bg-gray-100"
                                                    >
                                                        <PencilIcon className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* 選択チェックボックス */}
                                            <div className="absolute top-2 left-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(
                                                        item.id
                                                    )}
                                                    onChange={(e) =>
                                                        handleSelectItem(
                                                            item.id,
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-2">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item.title || item.filename}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(item.file_size)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // リスト表示
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedItems.length ===
                                                        media.data.length &&
                                                    media.data.length > 0
                                                }
                                                onChange={(e) =>
                                                    handleSelectAll(
                                                        e.target.checked
                                                    )
                                                }
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ファイル
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            タイプ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            サイズ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            フォルダ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            アップロード日
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            操作
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {media.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(
                                                        item.id
                                                    )}
                                                    onChange={(e) =>
                                                        handleSelectItem(
                                                            item.id,
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 w-10 h-10">
                                                        {item.type ===
                                                        "image" ? (
                                                            <img
                                                                src={item.url}
                                                                alt={
                                                                    item.alt_text ||
                                                                    item.filename
                                                                }
                                                                className="w-10 h-10 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                                                {getTypeIcon(
                                                                    item.type
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.title ||
                                                                item.filename}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {item.filename}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getTypeIcon(item.type)}
                                                    <span className="ml-2 text-sm text-gray-900 capitalize">
                                                        {item.type}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatFileSize(item.file_size)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.folder || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(
                                                    item.created_at
                                                ).toLocaleDateString("ja-JP")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            router.get(
                                                                route(
                                                                    "admin.media.show",
                                                                    item.id
                                                                )
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            router.get(
                                                                route(
                                                                    "admin.media.edit",
                                                                    item.id
                                                                )
                                                            )
                                                        }
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ページネーション */}
                    {media.links && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    {media.from} - {media.to} 件目 (全{" "}
                                    {media.total} 件中)
                                </div>
                                <div className="flex space-x-1">
                                    {media.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                link.url && router.get(link.url)
                                            }
                                            disabled={!link.url}
                                            className={`px-3 py-2 text-sm font-medium border rounded-md ${
                                                link.active
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : link.url
                                                    ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    : "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
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
                </div>

                {/* メディアが空の場合 */}
                {media.data.length === 0 && (
                    <div className="text-center py-12">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            メディアがありません
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            ファイルをアップロードして開始しましょう。
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                ファイルアップロード
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* アップロードモーダル */}
            <UploadModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                folders={folders}
            />
        </AdminLayout>
    );
};

export default MediaIndex;
