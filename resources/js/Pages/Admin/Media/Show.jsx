import React from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    ClipboardDocumentIcon,
    PhotoIcon,
    VideoCameraIcon,
    DocumentIcon,
} from "@heroicons/react/24/outline";

const MediaShow = ({ media }) => {
    const handleCopyUrl = () => {
        navigator.clipboard.writeText(media.url);
        // TODO: トーストメッセージ表示
    };

    const handleDelete = () => {
        if (
            confirm(
                "このメディアファイルを削除しますか？この操作は取り消せません。"
            )
        ) {
            router.delete(route("admin.media.destroy", media.id), {
                onSuccess: () => router.get(route("admin.media.index")),
            });
        }
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
            <Head title={`メディア詳細 - ${media.title || media.filename}`} />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() =>
                                router.get(route("admin.media.index"))
                            }
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            メディア一覧に戻る
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {media.title || media.filename}
                            </h1>
                            <p className="text-gray-600">メディア詳細</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() =>
                                router.get(route("admin.media.edit", media.id))
                            }
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            編集
                        </button>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            削除
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* メディアプレビュー */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                {media.type === "image" ? (
                                    <img
                                        src={media.url}
                                        alt={media.alt_text || media.filename}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                ) : media.type === "video" ? (
                                    <video
                                        src={media.url}
                                        controls
                                        className="max-w-full max-h-full"
                                    />
                                ) : (
                                    <div className="text-center">
                                        {getTypeIcon(media.type)}
                                        <p className="mt-2 text-gray-500">
                                            プレビューできません
                                        </p>
                                        <a
                                            href={media.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            ファイルを開く
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* URL複写 */}
                            <div className="p-4 border-t border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ファイルURL
                                </label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={media.url}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                                    />
                                    <button
                                        onClick={handleCopyUrl}
                                        className="px-3 py-2 bg-blue-600 text-white border border-blue-600 rounded-r-md hover:bg-blue-700 text-sm"
                                    >
                                        <ClipboardDocumentIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* メディア情報 */}
                    <div className="space-y-6">
                        {/* 基本情報 */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                基本情報
                            </h3>
                            <dl className="space-y-3">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        ファイル名
                                    </dt>
                                    <dd className="text-sm text-gray-900 break-all">
                                        {media.filename}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        ファイルタイプ
                                    </dt>
                                    <dd className="flex items-center">
                                        {getTypeIcon(media.type)}
                                        <span className="ml-2 text-sm text-gray-900 capitalize">
                                            {media.type}
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        MIMEタイプ
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {media.mime_type}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        ファイルサイズ
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {formatFileSize(media.file_size)}
                                    </dd>
                                </div>
                                {media.dimensions && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            サイズ
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {media.dimensions.width} ×{" "}
                                            {media.dimensions.height} px
                                        </dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        フォルダ
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {media.folder || "ルートフォルダ"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        アップロード日
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {new Date(
                                            media.created_at
                                        ).toLocaleString("ja-JP")}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        更新日
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {new Date(
                                            media.updated_at
                                        ).toLocaleString("ja-JP")}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* メタデータ */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                メタデータ
                            </h3>
                            <dl className="space-y-3">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        タイトル
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {media.title || "-"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        説明
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {media.description || "-"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Altテキスト
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {media.alt_text || "-"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        タグ
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {media.tags && media.tags.length > 0 ? (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {media.tags.map(
                                                    (tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                        >
                                                            {tag}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            "-"
                                        )}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* アップロード者情報 */}
                        {media.uploaded_by && (
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    アップロード者
                                </h3>
                                <dl className="space-y-3">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            名前
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {media.uploaded_by.name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            メールアドレス
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {media.uploaded_by.email}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default MediaShow;
