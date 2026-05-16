import { Head, Link, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { TextInput, TextArea, InputLabel, InputError } from "@/Components/Form";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    PhotoIcon,
    VideoCameraIcon,
    ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";

export default function Edit({ media }) {
    const { data, setData, patch, processing, errors } = useForm({
        title: media.title || "",
        description: media.description || "",
        alt_text: media.alt_text || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route("admin.media.update", media.id), {
            onSuccess: () => router.get(route("admin.media.show", media.id)),
        });
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

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="メディア編集"
                    description={media.title || media.original_filename}
                    breadcrumbs={[
                        {
                            name: "メディア管理",
                            href: route("admin.media.index"),
                        },
                        {
                            name: "詳細",
                            href: route("admin.media.show", media.id),
                        },
                        { name: "編集" },
                    ]}
                />
            }
        >
            <Head
                title={`メディア編集 - ${media.title || media.original_filename}`}
            />
            <FlashMessage />

            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 左カラム: プレビュー */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        プレビュー
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center min-h-[300px]">
                        {media.type === "image" ? (
                            <img
                                src={media.original_url}
                                alt={media.alt_text || media.title}
                                className="max-w-full max-h-[400px] object-contain rounded"
                            />
                        ) : media.type === "video" ? (
                            <video
                                src={media.original_url}
                                controls
                                className="max-w-full max-h-[400px] rounded"
                            >
                                お使いのブラウザは動画タグをサポートしていません。
                            </video>
                        ) : (
                            <div className="text-center text-slate-500 dark:text-slate-400">
                                <ArrowsPointingOutIcon className="mx-auto h-16 w-16 mb-2" />
                                <p className="text-sm font-mono truncate max-w-[200px]">
                                    {media.original_filename}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ファイル情報 */}
                    <dl className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-slate-500 dark:text-slate-400">
                                タイプ:
                            </dt>
                            <dd className="text-slate-900 dark:text-white">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                                    {media.type}
                                </span>
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500 dark:text-slate-400">
                                サイズ:
                            </dt>
                            <dd className="text-slate-900 dark:text-white">
                                {formatFileSize(media.original_file_size)}
                            </dd>
                        </div>
                        {media.original_width && media.original_height && (
                            <div className="flex justify-between">
                                <dt className="text-slate-500 dark:text-slate-400">
                                    寸法:
                                </dt>
                                <dd className="text-slate-900 dark:text-white">
                                    {media.original_width} ×{" "}
                                    {media.original_height} px
                                </dd>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <dt className="text-slate-500 dark:text-slate-400">
                                MIME:
                            </dt>
                            <dd className="text-slate-900 dark:text-white font-mono text-xs">
                                {media.mime_type}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* 右カラム: 編集フォーム */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                        メディア情報
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* タイトル */}
                        <div>
                            <InputLabel htmlFor="title" value="タイトル" />
                            <TextInput
                                id="title"
                                name="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                placeholder="メディアのタイトルを入力..."
                                className="mt-1 block w-full"
                            />
                            <InputError
                                message={errors.title}
                                className="mt-2"
                            />
                        </div>

                        {/* 説明 */}
                        <div>
                            <InputLabel htmlFor="description" value="説明" />
                            <TextArea
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="メディアの説明を入力..."
                                rows={4}
                                className="mt-1 block w-full"
                            />
                            <InputError
                                message={errors.description}
                                className="mt-2"
                            />
                        </div>

                        {/* Altテキスト（画像の場合のみ） */}
                        {media.type === "image" && (
                            <div>
                                <InputLabel
                                    htmlFor="alt_text"
                                    value="代替テキスト (Alt)"
                                />
                                <TextInput
                                    id="alt_text"
                                    name="alt_text"
                                    value={data.alt_text}
                                    onChange={(e) =>
                                        setData("alt_text", e.target.value)
                                    }
                                    placeholder="画像の代替テキストを入力..."
                                    className="mt-1 block w-full"
                                />
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    アクセシビリティのための画像説明テキスト
                                </p>
                                <InputError
                                    message={errors.alt_text}
                                    className="mt-2"
                                />
                            </div>
                        )}

                        {/* アクションボタン */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <SecondaryButton
                                type="button"
                                onClick={() =>
                                    router.get(
                                        route("admin.media.show", media.id),
                                    )
                                }
                            >
                                キャンセル
                            </SecondaryButton>
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? "保存中..." : "変更を保存"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
