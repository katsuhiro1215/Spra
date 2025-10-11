import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import RichTextEditor from "@/Components/RichTextEditor";
import {
    ArrowLeftIcon,
    PhotoIcon,
    PlusIcon,
    XMarkIcon,
    EyeIcon,
    TagIcon,
    CalendarIcon,
    DocumentTextIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const BlogCreate = ({ categories, media }) => {
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState([]);
    const [previewMode, setPreviewMode] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        status: "draft",
        published_at: "",
        featured_media_id: null,
        categories: [],
        meta_title: "",
        meta_description: "",
        gallery_media_ids: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.homepage.blogs.store"));
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setData("title", title);

        // 自動でスラッグを生成
        if (!data.slug || data.slug === generateSlug(data.title)) {
            setData("slug", generateSlug(title));
        }
    };

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim("-");
    };

    const handleCategoryToggle = (categoryId) => {
        const newCategories = data.categories.includes(categoryId)
            ? data.categories.filter((id) => id !== categoryId)
            : [...data.categories, categoryId];

        setData("categories", newCategories);
        setSelectedCategories(newCategories);
    };

    const handleFeaturedMediaSelect = (mediaItem) => {
        setData("featured_media_id", mediaItem.id);
        setShowMediaModal(false);
    };

    const handleGalleryMediaToggle = (mediaId) => {
        const newGallery = data.gallery_media_ids.includes(mediaId)
            ? data.gallery_media_ids.filter((id) => id !== mediaId)
            : [...data.gallery_media_ids, mediaId];

        setData("gallery_media_ids", newGallery);
        setSelectedMedia(newGallery);
    };

    const getFeaturedMedia = () => {
        return media.find((m) => m.id === data.featured_media_id);
    };

    const getSelectedGalleryMedia = () => {
        return media.filter((m) => data.gallery_media_ids.includes(m.id));
    };

    return (
        <AdminLayout>
            <Head title="ブログ作成" />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() =>
                                router.get(route("admin.homepage.blogs.index"))
                            }
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            ブログ一覧に戻る
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                ブログ作成
                            </h1>
                            <p className="text-gray-600">
                                新しいブログ記事を作成します
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setPreviewMode(!previewMode)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            {previewMode ? "エディタに戻る" : "プレビュー"}
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* メインコンテンツ */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* タイトル */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        タイトル{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={handleTitleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="ブログのタイトルを入力..."
                                        required
                                    />
                                    {errors.title && (
                                        <div className="text-red-600 text-sm mt-1">
                                            {errors.title}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        スラッグ
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                            /blog/
                                        </span>
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) =>
                                                setData("slug", e.target.value)
                                            }
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="blog-title"
                                        />
                                    </div>
                                    {errors.slug && (
                                        <div className="text-red-600 text-sm mt-1">
                                            {errors.slug}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 抜粋 */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    抜粋
                                </label>
                                <textarea
                                    value={data.excerpt}
                                    onChange={(e) =>
                                        setData("excerpt", e.target.value)
                                    }
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="ブログの概要を入力..."
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    一覧ページやSNSシェア時に表示される短い説明文
                                </p>
                                {errors.excerpt && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.excerpt}
                                    </div>
                                )}
                            </div>

                            {/* コンテンツ */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    コンテンツ{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                {previewMode ? (
                                    <div className="min-h-[400px] p-4 border border-gray-300 rounded-md bg-gray-50">
                                        <div className="prose max-w-none">
                                            {data.content ? (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: data.content.replace(
                                                            /\n/g,
                                                            "<br>"
                                                        ),
                                                    }}
                                                />
                                            ) : (
                                                <p className="text-gray-500">
                                                    コンテンツを入力してください
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <RichTextEditor
                                        value={data.content}
                                        onChange={(content) =>
                                            setData("content", content)
                                        }
                                        placeholder="ブログの内容を入力..."
                                        height={400}
                                    />
                                )}
                                {errors.content && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.content}
                                    </div>
                                )}
                            </div>

                            {/* SEO設定 */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    SEO設定
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            メタタイトル
                                        </label>
                                        <input
                                            type="text"
                                            value={data.meta_title}
                                            onChange={(e) =>
                                                setData(
                                                    "meta_title",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="検索エンジン用のタイトル..."
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            空の場合、ブログタイトルが使用されます
                                        </p>
                                        {errors.meta_title && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.meta_title}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            メタディスクリプション
                                        </label>
                                        <textarea
                                            value={data.meta_description}
                                            onChange={(e) =>
                                                setData(
                                                    "meta_description",
                                                    e.target.value
                                                )
                                            }
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="検索エンジン用の説明文..."
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            空の場合、抜粋が使用されます
                                        </p>
                                        {errors.meta_description && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.meta_description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* サイドバー */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* 公開設定 */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    公開設定
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            ステータス
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="draft">
                                                下書き
                                            </option>
                                            <option value="published">
                                                公開
                                            </option>
                                            <option value="scheduled">
                                                予約投稿
                                            </option>
                                        </select>
                                        {errors.status && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.status}
                                            </div>
                                        )}
                                    </div>

                                    {(data.status === "published" ||
                                        data.status === "scheduled") && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                公開日時
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={data.published_at}
                                                onChange={(e) =>
                                                    setData(
                                                        "published_at",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            {errors.published_at && (
                                                <div className="text-red-600 text-sm mt-1">
                                                    {errors.published_at}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* カテゴリ */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <TagIcon className="w-5 h-5 mr-2" />
                                    カテゴリ
                                </h3>

                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {categories.map((category) => (
                                        <label
                                            key={category.id}
                                            className="flex items-center"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.categories.includes(
                                                    category.id
                                                )}
                                                onChange={() =>
                                                    handleCategoryToggle(
                                                        category.id
                                                    )
                                                }
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div className="ml-2 flex items-center">
                                                <div
                                                    className="w-3 h-3 rounded-full mr-2"
                                                    style={{
                                                        backgroundColor:
                                                            category.color,
                                                    }}
                                                ></div>
                                                <span className="text-sm text-gray-900">
                                                    {category.name}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.categories && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.categories}
                                    </div>
                                )}
                            </div>

                            {/* アイキャッチ画像 */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <PhotoIcon className="w-5 h-5 mr-2" />
                                    アイキャッチ画像
                                </h3>

                                {getFeaturedMedia() ? (
                                    <div className="space-y-3">
                                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={getFeaturedMedia().url}
                                                alt={
                                                    getFeaturedMedia()
                                                        .alt_text ||
                                                    "アイキャッチ画像"
                                                }
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowMediaModal(true)
                                                }
                                                className="flex-1 px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                変更
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        "featured_media_id",
                                                        null
                                                    )
                                                }
                                                className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowMediaModal(true)}
                                        className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
                                    >
                                        <div className="text-center">
                                            <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-500">
                                                画像を選択
                                            </p>
                                        </div>
                                    </button>
                                )}
                                {errors.featured_media_id && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.featured_media_id}
                                    </div>
                                )}
                            </div>

                            {/* ギャラリー */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    ギャラリー
                                </h3>

                                {getSelectedGalleryMedia().length > 0 && (
                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        {getSelectedGalleryMedia().map(
                                            (mediaItem) => (
                                                <div
                                                    key={mediaItem.id}
                                                    className="relative"
                                                >
                                                    <img
                                                        src={mediaItem.url}
                                                        alt={
                                                            mediaItem.alt_text ||
                                                            ""
                                                        }
                                                        className="w-full aspect-square object-cover rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleGalleryMediaToggle(
                                                                mediaItem.id
                                                            )
                                                        }
                                                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                                                    >
                                                        <XMarkIcon className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setShowMediaModal(true)}
                                    className="w-full px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <PlusIcon className="w-4 h-4 inline mr-1" />
                                    画像を追加
                                </button>
                                {errors.gallery_media_ids && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.gallery_media_ids}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() =>
                                router.get(route("admin.homepage.blogs.index"))
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
                            {processing ? "作成中..." : "ブログを作成"}
                        </button>
                    </div>
                </form>
            </div>

            {/* メディア選択モーダル */}
            {showMediaModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                            onClick={() => setShowMediaModal(false)}
                        />

                        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    メディアを選択
                                </h3>
                                <button
                                    onClick={() => setShowMediaModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                                {media.map((mediaItem) => (
                                    <button
                                        key={mediaItem.id}
                                        type="button"
                                        onClick={() =>
                                            handleFeaturedMediaSelect(mediaItem)
                                        }
                                        className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                                    >
                                        <img
                                            src={mediaItem.url}
                                            alt={
                                                mediaItem.alt_text ||
                                                mediaItem.filename
                                            }
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-25 transition-all"></div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default BlogCreate;
