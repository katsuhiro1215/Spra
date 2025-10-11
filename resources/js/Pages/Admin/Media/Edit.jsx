import React from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ArrowLeftIcon,
    PhotoIcon,
    VideoCameraIcon,
    DocumentIcon,
} from "@heroicons/react/24/outline";

const MediaEdit = ({ media, folders = [] }) => {
    const { data, setData, patch, processing, errors } = useForm({
        title: media.title || "",
        description: media.description || "",
        folder: media.folder || "",
        tags: media.tags || [],
        alt_text: media.alt_text || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route("admin.media.update", media.id), {
            onSuccess: () => router.get(route("admin.media.show", media.id)),
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "image":
                return <PhotoIcon className="w-6 h-6 text-blue-500" />;
            case "video":
                return <VideoCameraIcon className="w-6 h-6 text-purple-500" />;
            default:
                return <DocumentIcon className="w-6 h-6 text-gray-500" />;
        }
    };

    return (
        <AdminLayout>
            <Head title={`メディア編集 - ${media.title || media.filename}`} />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() =>
                            router.get(route("admin.media.show", media.id))
                        }
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        詳細に戻る
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            メディア編集
                        </h1>
                        <p className="text-gray-600">
                            {media.title || media.filename}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* プレビュー */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    プレビュー
                                </h3>
                                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                                    {media.type === "image" ? (
                                        <img
                                            src={media.url}
                                            alt={
                                                media.alt_text || media.filename
                                            }
                                            className="max-w-full max-h-full object-contain rounded"
                                        />
                                    ) : media.type === "video" ? (
                                        <video
                                            src={media.url}
                                            controls
                                            className="max-w-full max-h-full rounded"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            {getTypeIcon(media.type)}
                                            <p className="mt-2 text-gray-500 text-sm">
                                                {media.filename}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ファイル情報 */}
                            <div className="px-4 pb-4 border-t border-gray-200">
                                <dl className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">
                                            ファイルサイズ:
                                        </dt>
                                        <dd className="text-gray-900">
                                            {formatFileSize(media.file_size)}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">
                                            タイプ:
                                        </dt>
                                        <dd className="text-gray-900 capitalize">
                                            {media.type}
                                        </dd>
                                    </div>
                                    {media.dimensions && (
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500">
                                                サイズ:
                                            </dt>
                                            <dd className="text-gray-900">
                                                {media.dimensions.width} ×{" "}
                                                {media.dimensions.height}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>
                    </div>

                    {/* 編集フォーム */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* タイトル */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            タイトル
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="メディアのタイトルを入力..."
                                        />
                                        {errors.title && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.title}
                                            </div>
                                        )}
                                    </div>

                                    {/* 説明 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            説明
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="メディアの説明を入力..."
                                        />
                                        {errors.description && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.description}
                                            </div>
                                        )}
                                    </div>

                                    {/* Altテキスト（画像の場合のみ） */}
                                    {media.type === "image" && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Altテキスト
                                            </label>
                                            <input
                                                type="text"
                                                value={data.alt_text}
                                                onChange={(e) =>
                                                    setData(
                                                        "alt_text",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="画像の代替テキストを入力..."
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                アクセシビリティのための画像説明テキスト
                                            </p>
                                            {errors.alt_text && (
                                                <div className="text-red-600 text-sm mt-1">
                                                    {errors.alt_text}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* フォルダ */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            フォルダ
                                        </label>
                                        <select
                                            value={data.folder}
                                            onChange={(e) =>
                                                setData(
                                                    "folder",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">
                                                ルートフォルダ
                                            </option>
                                            {folders.map((folder) => (
                                                <option
                                                    key={folder}
                                                    value={folder}
                                                >
                                                    {folder}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                placeholder="または新しいフォルダ名を入力"
                                                value={data.folder}
                                                onChange={(e) =>
                                                    setData(
                                                        "folder",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            />
                                        </div>
                                        {errors.folder && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.folder}
                                            </div>
                                        )}
                                    </div>

                                    {/* タグ */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            タグ
                                        </label>
                                        <input
                                            type="text"
                                            value={data.tags.join(", ")}
                                            onChange={(e) =>
                                                setData(
                                                    "tags",
                                                    e.target.value
                                                        .split(",")
                                                        .map((tag) =>
                                                            tag.trim()
                                                        )
                                                        .filter((tag) => tag)
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="写真, 商品, バナー... (カンマ区切り)"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            複数のタグをカンマで区切って入力してください
                                        </p>
                                        {errors.tags && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.tags}
                                            </div>
                                        )}
                                    </div>

                                    {/* 現在のタグ表示 */}
                                    {data.tags.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                現在のタグ
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {data.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                                    >
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setData(
                                                                    "tags",
                                                                    data.tags.filter(
                                                                        (
                                                                            _,
                                                                            i
                                                                        ) =>
                                                                            i !==
                                                                            index
                                                                    )
                                                                )
                                                            }
                                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* アクションボタン */}
                                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.get(
                                                    route(
                                                        "admin.media.show",
                                                        media.id
                                                    )
                                                )
                                            }
                                            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            キャンセル
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            {processing
                                                ? "保存中..."
                                                : "変更を保存"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default MediaEdit;
