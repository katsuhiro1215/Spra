import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { SecondaryButton } from "@/Components/Buttons";
import {
    PencilIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    ArrowsPointingOutIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";

export default function Show({ media }) {
    const handleDelete = () => {
        if (
            confirm(
                `「${media.title || media.original_filename}」を削除してもよろしいですか？`,
            )
        ) {
            router.delete(route("admin.media.destroy", media.id));
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("ja-JP");
    };

    const headerActions = [
        {
            label: "編集",
            icon: PencilIcon,
            variant: "primary",
            route: route("admin.media.edit", media.id),
        },
        {
            label: "削除",
            icon: TrashIcon,
            variant: "danger",
            onClick: handleDelete,
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="メディア詳細"
                    description={`ID: ${media.id}`}
                    actions={headerActions}
                    breadcrumbs={[
                        {
                            name: "メディア管理",
                            href: route("admin.media.index"),
                        },
                        { name: "詳細" },
                    ]}
                />
            }
        >
            <Head
                title={`メディア詳細 - ${media.title || media.original_filename}`}
            />
            <FlashMessage />

            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 左カラム: プレビューとアクション */}
                <div className="lg:col-span-2 space-y-6">
                    {/* プレビュー */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                プレビュー
                            </h3>
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center min-h-[400px]">
                                {media.type === "image" ? (
                                    <img
                                        src={media.original_url}
                                        alt={media.alt_text || media.title}
                                        className="max-w-full max-h-[600px] object-contain rounded"
                                    />
                                ) : media.type === "video" ? (
                                    <video
                                        src={media.original_url}
                                        controls
                                        className="max-w-full max-h-[600px] rounded"
                                    >
                                        お使いのブラウザは動画タグをサポートしていません。
                                    </video>
                                ) : (
                                    <div className="text-center text-slate-500 dark:text-slate-400">
                                        <ArrowsPointingOutIcon className="mx-auto h-16 w-16 mb-2" />
                                        <p>プレビュー非対応</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* アクション */}
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
                            <a
                                href={media.original_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md font-semibold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-widest shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition ease-in-out duration-150"
                            >
                                <ArrowsPointingOutIcon className="h-4 w-4 mr-2" />
                                別タブで開く
                            </a>
                            <a
                                href={media.original_url}
                                download={media.original_filename}
                                className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md font-semibold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-widest shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition ease-in-out duration-150"
                            >
                                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                                ダウンロード
                            </a>
                        </div>
                    </div>

                    {/* バリアント（TODO: 実装予定） */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                バリアント
                            </h3>
                            <SecondaryButton
                                onClick={() =>
                                    alert(
                                        "バリアント追加機能は近日実装予定です",
                                    )
                                }
                            >
                                バリアントを追加
                            </SecondaryButton>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            異なるサイズや形式のバリアント画像を生成・管理できます（近日実装予定）
                        </p>
                    </div>

                    {/* 設定（TODO: 実装予定） */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                メディア設定
                            </h3>
                            <SecondaryButton
                                onClick={() =>
                                    alert("設定追加機能は近日実装予定です")
                                }
                            >
                                設定を追加
                            </SecondaryButton>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            このメディアに関連する設定を管理できます（近日実装予定）
                        </p>
                    </div>
                </div>

                {/* 右カラム: 詳細情報 */}
                <div className="space-y-6">
                    {/* 基本情報 */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            基本情報
                        </h3>
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                    タイトル
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                    {media.title || "-"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                    説明
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                    {media.description || "-"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                    代替テキスト
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                    {media.alt_text || "-"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                    ファイル名
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-white font-mono truncate">
                                    {media.original_filename}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* ファイル情報 */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            ファイル情報
                        </h3>
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                    タイプ
                                </dt>
                                <dd className="mt-1">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                                        {media.type}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                    MIMEタイプ
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-white font-mono">
                                    {media.mime_type}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                    ファイルサイズ
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                    {formatFileSize(media.original_file_size)}
                                </dd>
                            </div>
                            {media.original_width && media.original_height && (
                                <div>
                                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                        サイズ
                                    </dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                        {media.original_width} ×{" "}
                                        {media.original_height} px
                                    </dd>
                                </div>
                            )}
                            {media.duration && (
                                <div>
                                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                        再生時間
                                    </dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                        {Math.floor(media.duration / 60)}:
                                        {String(media.duration % 60).padStart(
                                            2,
                                            "0",
                                        )}
                                    </dd>
                                </div>
                            )}
                            <div>
                                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                    ハッシュ値
                                </dt>
                                <dd className="mt-1 text-xs text-slate-900 dark:text-white font-mono break-all">
                                    {media.original_hash}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* 使用状況 */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            使用状況
                        </h3>
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                    使用回数
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                    {media.usage_count || 0} 回
                                </dd>
                            </div>
                            {media.last_used_at && (
                                <div>
                                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                        最終使用日時
                                    </dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                        {formatDate(media.last_used_at)}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    {/* メタ情報 */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            メタ情報
                        </h3>
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase flex items-center">
                                    <ClockIcon className="h-4 w-4 mr-1" />
                                    作成日時
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                    {formatDate(media.created_at)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase flex items-center">
                                    <ClockIcon className="h-4 w-4 mr-1" />
                                    更新日時
                                </dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                    {formatDate(media.updated_at)}
                                </dd>
                            </div>
                            {media.creator && (
                                <div>
                                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                        作成者
                                    </dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                        {media.creator.name ||
                                            media.creator.email}
                                    </dd>
                                </div>
                            )}
                            {media.updater && (
                                <div>
                                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                        更新者
                                    </dt>
                                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">
                                        {media.updater.name ||
                                            media.updater.email}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
