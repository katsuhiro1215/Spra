import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
// Layouts
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import BasicButton from "@/Components/Buttons/BasicButton";
import { FlashMessage } from "@/Components/Notifications";
// Components - Forms
import InputLabel from "@/Components/Forms/InputLabel";
import TextInput from "@/Components/Forms/TextInput";
import ValidatedInput from "@/Components/Forms/ValidatedInput";
import ValidatedTextArea from "@/Components/Forms/ValidatedTextArea";
// Icons
import {
    PlusIcon,
    ArrowLeftIcon,
    EyeIcon,
    EyeSlashIcon,
    DocumentTextIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Create({ templates }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        slug: "",
        template: "page",
        content: {},
        meta: {
            title: "",
            description: "",
            keywords: "",
        },
        settings: {
            show_in_navigation: false,
            is_featured: false,
        },
        is_published: false,
        sort_order: 0,
    });

    const [previewMode, setPreviewMode] = useState(false);
    const [contentFields, setContentFields] = useState([]);

    // タイトルからスラッグを自動生成
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim("-");
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setData({
            ...data,
            title: title,
            slug: generateSlug(title),
            meta: {
                ...data.meta,
                title: title,
            },
        });
    };

    const handleTemplateChange = (template) => {
        setData("template", template);

        // テンプレートに応じてコンテンツフィールドを設定
        switch (template) {
            case "home":
                setContentFields([
                    {
                        key: "hero_title",
                        label: "ヒーロータイトル",
                        type: "text",
                    },
                    {
                        key: "hero_subtitle",
                        label: "ヒーローサブタイトル",
                        type: "text",
                    },
                    { key: "hero_image", label: "ヒーロー画像", type: "url" },
                    { key: "features", label: "特徴セクション", type: "json" },
                ]);
                break;
            case "about":
                setContentFields([
                    { key: "intro_text", label: "紹介文", type: "textarea" },
                    { key: "mission", label: "ミッション", type: "textarea" },
                    { key: "vision", label: "ビジョン", type: "textarea" },
                    { key: "team_info", label: "チーム情報", type: "json" },
                ]);
                break;
            case "contact":
                setContentFields([
                    {
                        key: "form_title",
                        label: "フォームタイトル",
                        type: "text",
                    },
                    { key: "contact_info", label: "連絡先情報", type: "json" },
                    {
                        key: "map_embed",
                        label: "マップ埋め込み",
                        type: "textarea",
                    },
                ]);
                break;
            case "service":
                setContentFields([
                    {
                        key: "service_overview",
                        label: "サービス概要",
                        type: "textarea",
                    },
                    {
                        key: "service_details",
                        label: "サービス詳細",
                        type: "json",
                    },
                    { key: "pricing", label: "料金情報", type: "json" },
                ]);
                break;
            case "blog":
                setContentFields([
                    {
                        key: "blog_description",
                        label: "ブログ説明",
                        type: "textarea",
                    },
                    {
                        key: "posts_per_page",
                        label: "1ページあたりの投稿数",
                        type: "number",
                    },
                ]);
                break;
            default:
                setContentFields([
                    {
                        key: "content_sections",
                        label: "コンテンツセクション",
                        type: "json",
                    },
                ]);
        }
    };

    const handleContentChange = (key, value) => {
        setData("content", {
            ...data.content,
            [key]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.homepage.pages.store"), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const renderContentField = (field) => {
        const value = data.content[field.key] || "";

        switch (field.type) {
            case "text":
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                            handleContentChange(field.key, e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder={`${field.label}を入力`}
                    />
                );
            case "url":
                return (
                    <input
                        type="url"
                        value={value}
                        onChange={(e) =>
                            handleContentChange(field.key, e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="https://example.com/image.jpg"
                    />
                );
            case "number":
                return (
                    <input
                        type="number"
                        value={value}
                        onChange={(e) =>
                            handleContentChange(
                                field.key,
                                parseInt(e.target.value) || 0,
                            )
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        min="1"
                    />
                );
            case "textarea":
                return (
                    <textarea
                        value={value}
                        onChange={(e) =>
                            handleContentChange(field.key, e.target.value)
                        }
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder={`${field.label}を入力`}
                    />
                );
            case "json":
                return (
                    <textarea
                        value={
                            typeof value === "object"
                                ? JSON.stringify(value, null, 2)
                                : value
                        }
                        onChange={(e) => {
                            try {
                                const jsonValue = JSON.parse(e.target.value);
                                handleContentChange(field.key, jsonValue);
                            } catch (error) {
                                handleContentChange(field.key, e.target.value);
                            }
                        }}
                        rows={6}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                        placeholder={`${field.label} (JSON形式)`}
                    />
                );
            default:
                return null;
        }
    };

    const headerActions = [
        {
            label: PageConfig.pages.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.homepage.pages.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout>
            <Head title={PageConfig.pages.documentTitle} />
            {/* フラッシュメッセージ */}
            <FlashMessage />
            {/* ヘッダー */}
            <PageHeader
                title={PageConfig.pages.title}
                description={PageConfig.pages.form.create.description}
                actions={headerActions}
            />
            {/* メイン */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* ナビゲーション */}
                <div className="mb-6">
                    <BasicButton
                        variant="teal"
                        onClick={() => setPreviewMode(!previewMode)}
                    >
                        {previewMode ? (
                            <>
                                <EyeSlashIcon className="h-4 w-4 mr-1" />
                                編集モード
                            </>
                        ) : (
                            <>
                                <EyeIcon className="h-4 w-4 mr-1" />
                                プレビューモード
                            </>
                        )}
                    </BasicButton>
                </div>
                {/* フォーム */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* メインコンテンツ */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* 基本情報 */}
                            <Card>
                                <Card.Title>基本情報</Card.Title>
                                <Card.Body className="space-y-4">
                                    <ValidatedInput
                                        label="ページタイトル"
                                        name="title"
                                        type="text"
                                        value={data.title}
                                        onChange={handleTitleChange}
                                        className="w-full"
                                        placeholder="ページタイトルを入力"
                                        required
                                        error={errors.title}
                                    />
                                    <ValidatedInput
                                        label="スラッグ（URL）"
                                        name="slug"
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData("slug", e.target.value)
                                        }
                                        className="w-full"
                                        placeholder="page-slug"
                                        required
                                        error={errors.slug}
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        URL: /pages/{data.slug}
                                    </p>
                                </Card.Body>
                            </Card>
                            {/* テンプレート選択 */}
                            <Card>
                                <Card.Title>テンプレート選択</Card.Title>
                                <Card.Body>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {Object.entries(templates).map(
                                            ([key, name]) => (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() =>
                                                        handleTemplateChange(
                                                            key,
                                                        )
                                                    }
                                                    className={`p-3 text-left border rounded-lg transition-colors ${
                                                        data.template === key
                                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                                            : "border-gray-300 hover:border-gray-400"
                                                    }`}
                                                >
                                                    <DocumentTextIcon className="h-5 w-5 mb-1" />
                                                    <div className="font-medium text-sm">
                                                        {name}
                                                    </div>
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                            {/* コンテンツフィールド */}
                            {contentFields.length > 0 && (
                                <Card>
                                    <Card.Title>コンテンツ設定</Card.Title>
                                    <Card.Body className="space-y-4">
                                        {contentFields.map((field) => (
                                            <div
                                                className="space-y-2"
                                                key={field.key}
                                            >
                                                <InputLabel
                                                    value={field.label}
                                                />
                                                {renderContentField(field)}
                                            </div>
                                        ))}
                                    </Card.Body>
                                </Card>
                            )}
                            {/* SEO設定 */}
                            <Card>
                                <Card.Title>SEO設定</Card.Title>
                                <Card.Body className="space-y-4">
                                    <ValidatedInput
                                        label="メタタイトル"
                                        name="meta_title"
                                        type="text"
                                        value={data.meta.title}
                                        onChange={(e) =>
                                            setData("meta", {
                                                ...data.meta,
                                                title: e.target.value,
                                            })
                                        }
                                        className="w-full"
                                        placeholder="検索結果に表示されるタイトル"
                                        error={errors["meta.title"]}
                                    />
                                    <ValidatedTextArea
                                        label="メタディスクリプション"
                                        name="meta_description"
                                        value={data.meta.description}
                                        onChange={(e) =>
                                            setData("meta", {
                                                ...data.meta,
                                                description: e.target.value,
                                            })
                                        }
                                        className="w-full"
                                        placeholder="検索結果に表示される説明文"
                                        error={errors["meta.description"]}
                                    />
                                    <ValidatedInput
                                        label="メタキーワード"
                                        name="meta_keywords"
                                        type="text"
                                        value={data.meta.keywords}
                                        onChange={(e) =>
                                            setData("meta", {
                                                ...data.meta,
                                                keywords: e.target.value,
                                            })
                                        }
                                        className="w-full"
                                        placeholder="キーワード1, キーワード2, キーワード3"
                                        error={errors["meta.keywords"]}
                                    />
                                </Card.Body>
                            </Card>
                        </div>
                        {/* サイドバー */}
                        <div className="space-y-6">
                            {/* 公開設定 */}
                            <Card>
                                <Card.Title>公開設定</Card.Title>
                                <Card.Body className="space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_published}
                                            onChange={(e) =>
                                                setData(
                                                    "is_published",
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 block text-sm text-gray-900">
                                            すぐに公開する
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.settings.is_featured}
                                            onChange={(e) =>
                                                setData("settings", {
                                                    ...data.settings,
                                                    is_featured:
                                                        e.target.checked,
                                                })
                                            }
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 block text-sm text-gray-900">
                                            注目ページに設定
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={
                                                data.settings.show_in_navigation
                                            }
                                            onChange={(e) =>
                                                setData("settings", {
                                                    ...data.settings,
                                                    show_in_navigation:
                                                        e.target.checked,
                                                })
                                            }
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 block text-sm text-gray-900">
                                            ナビゲーションに表示
                                        </label>
                                    </div>
                                </Card.Body>
                            </Card>
                            {/* 表示順序 */}
                            <Card>
                                <Card.Title>表示順序</Card.Title>
                                <Card.Body className="space-y-4">
                                    <TextInput
                                        label="表示順序"
                                        name="sort_order"
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) =>
                                            setData(
                                                "sort_order",
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        className="w-full"
                                        min="0"
                                        placeholder="0"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        数字が小さいほど上位に表示されます
                                    </p>
                                </Card.Body>
                            </Card>
                            {/* 保存ボタン */}
                            <Card>
                                <Card.Title>アクション</Card.Title>
                                <Card.Body className="space-y-4">
                                    <BasicButton
                                        type="submit"
                                        className="w-full"
                                        processing={processing}
                                    >
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        ページを作成
                                    </BasicButton>
                                    <BasicButton
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => reset()}
                                        disabled={processing}
                                    >
                                        {PageConfig.pages.actions.reset}
                                    </BasicButton>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </form>
            </main>
        </AdminAuthenticatedLayout>
    );
}
