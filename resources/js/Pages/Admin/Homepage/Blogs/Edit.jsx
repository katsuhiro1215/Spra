import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import RichTextEditor from "@/Components/RichTextEditor";
import {
    ArrowLeftIcon,
    PhotoIcon,
    XMarkIcon,
    EyeIcon,
    DocumentTextIcon,
    TagIcon,
    CalendarIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const BlogEdit = ({ blog, blogCategories, allMedia }) => {
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaModalType, setMediaModalType] = useState("featured"); // 'featured' or 'gallery'
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showSeoSettings, setShowSeoSettings] = useState(false);

    const { data, setData, patch, processing, errors, clearErrors } = useForm({
        title: blog.title || "",
        slug: blog.slug || "",
        content: blog.content || "",
        excerpt: blog.excerpt || "",
        status: blog.status || "draft",
        published_at: blog.published_at || "",
        featured_media_id: blog.featured_media_id || "",
        category_ids: blog.categories
            ? blog.categories.map((cat) => cat.id)
            : [],
        media_ids: blog.media ? blog.media.map((media) => media.id) : [],
        meta_title: blog.meta_title || "",
        meta_description: blog.meta_description || "",
    });

    const [selectedFeaturedMedia, setSelectedFeaturedMedia] = useState(
        blog.featured_media || null
    );
    const [selectedGalleryMedia, setSelectedGalleryMedia] = useState(
        blog.media || []
    );

    useEffect(() => {
        if (data.title && !data.slug) {
            const slug = data.title
                .toLowerCase()
                .replace(
                    /[^a-z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g,
                    "-"
                )
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");
            setData("slug", slug);
        }
    }, [data.title]);

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route("admin.homepage.blogs.update", blog.id), {
            onSuccess: () => {
                router.get(route("admin.homepage.blogs.show", blog.id));
            },
        });
    };

    const openMediaModal = (type) => {
        setMediaModalType(type);
        setShowMediaModal(true);
    };

    const selectFeaturedMedia = (media) => {
        setSelectedFeaturedMedia(media);
        setData("featured_media_id", media.id);
        setShowMediaModal(false);
    };

    const removeFeaturedMedia = () => {
        setSelectedFeaturedMedia(null);
        setData("featured_media_id", "");
    };

    const toggleGalleryMedia = (media) => {
        const isSelected = selectedGalleryMedia.some(
            (item) => item.id === media.id
        );
        let newSelection;

        if (isSelected) {
            newSelection = selectedGalleryMedia.filter(
                (item) => item.id !== media.id
            );
        } else {
            newSelection = [...selectedGalleryMedia, media];
        }

        setSelectedGalleryMedia(newSelection);
        setData(
            "media_ids",
            newSelection.map((item) => item.id)
        );
    };

    const removeGalleryMedia = (mediaId) => {
        const newSelection = selectedGalleryMedia.filter(
            (item) => item.id !== mediaId
        );
        setSelectedGalleryMedia(newSelection);
        setData(
            "media_ids",
            newSelection.map((item) => item.id)
        );
    };

    const toggleCategory = (categoryId) => {
        const isSelected = data.category_ids.includes(categoryId);
        const newCategoryIds = isSelected
            ? data.category_ids.filter((id) => id !== categoryId)
            : [...data.category_ids, categoryId];

        setData("category_ids", newCategoryIds);
    };

    const getStatusBadge = (status) => {
        const badges = {
            published: "bg-green-100 text-green-800",
            draft: "bg-yellow-100 text-yellow-800",
            scheduled: "bg-blue-100 text-blue-800",
        };

        const labels = {
            published: "公開",
            draft: "下書き",
            scheduled: "予約投稿",
        };

        return (
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}
            >
                {labels[status]}
            </span>
        );
    };

    const selectedCategories = blogCategories.filter((cat) =>
        data.category_ids.includes(cat.id)
    );

    const MediaModal = () => (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                        {mediaModalType === "featured"
                            ? "アイキャッチ画像を選択"
                            : "ギャラリー画像を選択"}
                    </h3>
                    <button
                        onClick={() => setShowMediaModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                    {allMedia.map((media) => (
                        <div
                            key={media.id}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                mediaModalType === "featured" &&
                                selectedFeaturedMedia?.id === media.id
                                    ? "border-blue-500 ring-2 ring-blue-200"
                                    : mediaModalType === "gallery" &&
                                      selectedGalleryMedia.some(
                                          (item) => item.id === media.id
                                      )
                                    ? "border-green-500 ring-2 ring-green-200"
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => {
                                if (mediaModalType === "featured") {
                                    selectFeaturedMedia(media);
                                } else {
                                    toggleGalleryMedia(media);
                                }
                            }}
                        >
                            <div className="aspect-square">
                                <img
                                    src={media.url}
                                    alt={media.alt_text || media.filename}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                                {mediaModalType === "gallery" &&
                                    selectedGalleryMedia.some(
                                        (item) => item.id === media.id
                                    ) && (
                                        <div className="bg-green-500 text-white rounded-full p-1">
                                            <svg
                                                className="w-4 h-4"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    )}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                                <p className="text-xs truncate">
                                    {media.filename}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                    <button
                        onClick={() => setShowMediaModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );

    const CategoryModal = () => (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">カテゴリを選択</h3>
                    <button
                        onClick={() => setShowCategoryModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {blogCategories.map((category) => (
                        <label
                            key={category.id}
                            className="flex items-center p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={data.category_ids.includes(
                                    category.id
                                )}
                                onChange={() => toggleCategory(category.id)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                            />
                            <div className="ml-3 flex items-center">
                                <div
                                    className="w-4 h-4 rounded-full mr-2"
                                    style={{ backgroundColor: category.color }}
                                ></div>
                                <span className="text-sm font-medium text-gray-900">
                                    {category.name}
                                </span>
                                {category.description && (
                                    <span className="ml-2 text-xs text-gray-500">
                                        {category.description}
                                    </span>
                                )}
                            </div>
                        </label>
                    ))}
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => setShowCategoryModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <Head title={`ブログ編集 - ${blog.title}`} />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() =>
                                router.get(
                                    route("admin.homepage.blogs.show", blog.id)
                                )
                            }
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            詳細に戻る
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                ブログ編集
                            </h1>
                            <p className="text-gray-600">{blog.title}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {getStatusBadge(data.status)}
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            {showPreview ? "プレビューを隠す" : "プレビュー"}
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* メインコンテンツ */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* 基本情報 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        基本情報
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                タイトル{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData(
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="ブログタイトルを入力"
                                                required
                                            />
                                            {errors.title && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.title}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                スラッグ{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="flex">
                                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                    /blog/
                                                </span>
                                                <input
                                                    type="text"
                                                    value={data.slug}
                                                    onChange={(e) =>
                                                        setData(
                                                            "slug",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 border border-gray-300 rounded-r-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="url-slug"
                                                    required
                                                />
                                            </div>
                                            {errors.slug && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.slug}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                抜粋
                                            </label>
                                            <textarea
                                                value={data.excerpt}
                                                onChange={(e) =>
                                                    setData(
                                                        "excerpt",
                                                        e.target.value
                                                    )
                                                }
                                                rows={3}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="ブログの概要を入力（検索結果やカード表示で使用されます）"
                                            />
                                            {errors.excerpt && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* コンテンツ */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <DocumentTextIcon className="w-5 h-5 mr-2" />
                                        コンテンツ
                                    </h3>

                                    <div className="space-y-4">
                                        <RichTextEditor
                                            value={data.content}
                                            onChange={(content) =>
                                                setData("content", content)
                                            }
                                            placeholder="ブログの本文を入力してください..."
                                            height={500}
                                        />
                                        {errors.content && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* SEO設定 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            SEO設定
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowSeoSettings(
                                                    !showSeoSettings
                                                )
                                            }
                                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900"
                                        >
                                            <Cog6ToothIcon className="w-4 h-4 mr-1" />
                                            {showSeoSettings
                                                ? "閉じる"
                                                : "設定"}
                                        </button>
                                    </div>

                                    {showSeoSettings && (
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
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="SEO用のタイトル（未入力時はタイトルが使用されます）"
                                                    maxLength="60"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {data.meta_title.length}
                                                    /60文字
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    メタディスクリプション
                                                </label>
                                                <textarea
                                                    value={
                                                        data.meta_description
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "meta_description",
                                                            e.target.value
                                                        )
                                                    }
                                                    rows={3}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="検索結果に表示される説明文"
                                                    maxLength="160"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {
                                                        data.meta_description
                                                            .length
                                                    }
                                                    /160文字
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* プレビュー */}
                            {showPreview && (
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            プレビュー
                                        </h3>
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <h2 className="text-xl font-bold mb-2">
                                                {data.title}
                                            </h2>
                                            {data.excerpt && (
                                                <p className="text-gray-600 mb-4">
                                                    {data.excerpt}
                                                </p>
                                            )}
                                            <div className="prose max-w-none">
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: data.content,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* サイドバー */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* 公開設定 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
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
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                                        </div>

                                        {data.status === "scheduled" && (
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
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* アイキャッチ画像 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <PhotoIcon className="w-5 h-5 mr-2" />
                                        アイキャッチ画像
                                    </h3>

                                    {selectedFeaturedMedia ? (
                                        <div className="space-y-3">
                                            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={
                                                        selectedFeaturedMedia.url
                                                    }
                                                    alt={
                                                        selectedFeaturedMedia.alt_text ||
                                                        ""
                                                    }
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={
                                                        removeFeaturedMedia
                                                    }
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openMediaModal("featured")
                                                }
                                                className="w-full text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                画像を変更
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openMediaModal("featured")
                                            }
                                            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <span className="mt-2 block text-sm font-medium text-gray-900">
                                                アイキャッチ画像を選択
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* カテゴリ */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <TagIcon className="w-5 h-5 mr-2" />
                                        カテゴリ
                                    </h3>

                                    <div className="space-y-3">
                                        {selectedCategories.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedCategories.map(
                                                    (category) => (
                                                        <span
                                                            key={category.id}
                                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                                                            style={{
                                                                backgroundColor:
                                                                    category.color +
                                                                    "20",
                                                                color: category.color,
                                                            }}
                                                        >
                                                            {category.name}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                カテゴリが選択されていません
                                            </p>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCategoryModal(true)
                                            }
                                            className="w-full text-sm text-blue-600 hover:text-blue-800 text-left"
                                        >
                                            + カテゴリを
                                            {selectedCategories.length > 0
                                                ? "変更"
                                                : "選択"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ギャラリー */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <PhotoIcon className="w-5 h-5 mr-2" />
                                        ギャラリー
                                    </h3>

                                    <div className="space-y-3">
                                        {selectedGalleryMedia.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedGalleryMedia.map(
                                                    (media) => (
                                                        <div
                                                            key={media.id}
                                                            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                                                        >
                                                            <img
                                                                src={media.url}
                                                                alt={
                                                                    media.alt_text ||
                                                                    ""
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeGalleryMedia(
                                                                        media.id
                                                                    )
                                                                }
                                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                            >
                                                                <XMarkIcon className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                ギャラリー画像が選択されていません
                                            </p>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openMediaModal("gallery")
                                            }
                                            className="w-full text-sm text-blue-600 hover:text-blue-800 text-left"
                                        >
                                            + ギャラリー画像を
                                            {selectedGalleryMedia.length > 0
                                                ? "編集"
                                                : "追加"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 保存ボタン */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {processing
                                            ? "更新中..."
                                            : "ブログを更新"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* モーダル */}
            {showMediaModal && <MediaModal />}
            {showCategoryModal && <CategoryModal />}
        </AdminLayout>
    );
};

export default BlogEdit;
