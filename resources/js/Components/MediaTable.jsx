import { Link } from "@inertiajs/react";
import {
    PhotoIcon,
    EyeIcon,
    TrashIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import Pagination from "@/Components/Layout/Pagination";

export default function MediaTable({ mediaList, onDelete }) {
    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
        );
    };

    if (mediaList.data.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 shadow-sm rounded-lg p-12 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    メディアがありません
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    最初のファイルをアップロードしてください
                </p>
                <Link
                    href={route("admin.media.create")}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 transition-colors"
                >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    アップロード
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
                {mediaList.data.map((media) => (
                    <div
                        key={media.id}
                        className="group relative bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all"
                    >
                        {/* 画像プレビュー */}
                        <div className="aspect-square bg-slate-100 dark:bg-slate-900">
                            {media.type === "image" ? (
                                <img
                                    src={media.original_url}
                                    alt={media.alt_text || media.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display =
                                            "flex";
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <PhotoIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                                </div>
                            )}
                            {/* エラー時の代替表示 */}
                            <div
                                style={{ display: "none" }}
                                className="w-full h-full items-center justify-center bg-slate-200 dark:bg-slate-800"
                            >
                                <PhotoIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                            </div>
                        </div>

                        {/* ホバー時のオーバーレイ */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex space-x-2">
                                <Link
                                    href={route("admin.media.show", media.id)}
                                    className="p-2 bg-white rounded-full hover:bg-slate-100 transition-colors"
                                >
                                    <EyeIcon className="w-5 h-5 text-slate-700" />
                                </Link>
                                <button
                                    onClick={() => onDelete(media)}
                                    className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                                >
                                    <TrashIcon className="w-5 h-5 text-red-600" />
                                </button>
                            </div>
                        </div>

                        {/* ファイル情報 */}
                        <div className="p-2 bg-white dark:bg-slate-900">
                            <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                                {media.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {formatFileSize(media.original_file_size)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ページネーション */}
            {mediaList.last_page > 1 && (
                <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4">
                    <Pagination links={mediaList.links} />
                </div>
            )}
        </div>
    );
}
