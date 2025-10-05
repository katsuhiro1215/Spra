import React from 'react';
import { Head } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import BasicButton from '@/Components/BasicButton';
import { 
    ArrowLeftIcon,
    PencilIcon,
    EyeIcon,
    CalendarIcon,
    TagIcon,
    DocumentTextIcon,
    GlobeAltIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function Show({ page }) {
    const getStatusBadge = (isPublished) => {
        return isPublished ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                公開中
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1"></div>
                下書き
            </span>
        );
    };

    const getTemplateBadge = (template) => {
        const templates = {
            'home': { name: 'ホーム', color: 'bg-blue-100 text-blue-800' },
            'about': { name: '概要', color: 'bg-purple-100 text-purple-800' },
            'contact': { name: 'お問い合わせ', color: 'bg-green-100 text-green-800' },
            'service': { name: 'サービス', color: 'bg-orange-100 text-orange-800' },
            'blog': { name: 'ブログ', color: 'bg-pink-100 text-pink-800' },
            'page': { name: '標準ページ', color: 'bg-gray-100 text-gray-800' }
        };

        const templateInfo = templates[template] || templates['page'];
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${templateInfo.color}`}>
                <DocumentTextIcon className="w-3 h-3 mr-1" />
                {templateInfo.name}
            </span>
        );
    };

    const renderContentSection = (content) => {
        if (!content || Object.keys(content).length === 0) {
            return (
                <div className="text-center py-8 text-gray-500">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2">コンテンツが設定されていません</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {Object.entries(content).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <dt className="text-sm font-medium text-gray-600 mb-2 capitalize">
                            {key.replace(/_/g, ' ')}
                        </dt>
                        <dd className="text-sm text-gray-900">
                            {typeof value === 'object' ? (
                                <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-x-auto">
                                    {JSON.stringify(value, null, 2)}
                                </pre>
                            ) : (
                                <p className="whitespace-pre-wrap">{value}</p>
                            )}
                        </dd>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            ページ詳細
                        </h2>
                        <div className="flex items-center space-x-2">
                            {getStatusBadge(page.is_published)}
                            {getTemplateBadge(page.template)}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <BasicButton
                            href={route('admin.homepage.pages.edit', page.id)}
                            variant="primary"
                            size="sm"
                        >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            編集
                        </BasicButton>
                        <BasicButton
                            href="#"
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/pages/${page.slug}`, '_blank')}
                        >
                            <EyeIcon className="h-4 w-4 mr-2" />
                            プレビュー
                        </BasicButton>
                    </div>
                </div>
            }
        >
            <Head title={`ページ詳細 - ${page.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* ナビゲーション */}
                    <div className="mb-6">
                        <BasicButton
                            href={route('admin.homepage.pages.index')}
                            variant="outline"
                            size="sm"
                        >
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            ページ一覧に戻る
                        </BasicButton>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* メインコンテンツ */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* 基本情報 */}
                            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">基本情報</h3>
                                </div>
                                <div className="px-6 py-4">
                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600">ページタイトル</dt>
                                            <dd className="mt-1 text-lg font-semibold text-gray-900">{page.title}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600">スラッグ（URL）</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                <code className="bg-gray-100 px-2 py-1 rounded text-sm">/pages/{page.slug}</code>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600">テンプレート</dt>
                                            <dd className="mt-1">{getTemplateBadge(page.template)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600">表示順序</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{page.sort_order}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {/* コンテンツ */}
                            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                                        コンテンツ
                                    </h3>
                                </div>
                                <div className="px-6 py-4">
                                    {renderContentSection(page.content)}
                                </div>
                            </div>

                            {/* SEO設定 */}
                            {page.meta && (
                                <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                            <GlobeAltIcon className="h-5 w-5 mr-2" />
                                            SEO設定
                                        </h3>
                                    </div>
                                    <div className="px-6 py-4">
                                        <dl className="space-y-4">
                                            {page.meta.title && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-600">メタタイトル</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{page.meta.title}</dd>
                                                </div>
                                            )}
                                            {page.meta.description && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-600">メタディスクリプション</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{page.meta.description}</dd>
                                                </div>
                                            )}
                                            {page.meta.keywords && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-600">キーワード</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{page.meta.keywords}</dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>
                                </div>
                            )}

                            {/* 追加設定 */}
                            {page.settings && (
                                <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                            <Cog6ToothIcon className="h-5 w-5 mr-2" />
                                            追加設定
                                        </h3>
                                    </div>
                                    <div className="px-6 py-4">
                                        <dl className="space-y-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-600">ナビゲーション表示</dt>
                                                <dd className="mt-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        page.settings.show_in_navigation 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {page.settings.show_in_navigation ? '表示' : '非表示'}
                                                    </span>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-600">注目ページ</dt>
                                                <dd className="mt-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        page.settings.is_featured 
                                                            ? 'bg-yellow-100 text-yellow-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {page.settings.is_featured ? '注目' : '通常'}
                                                    </span>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* サイドバー */}
                        <div className="space-y-6">
                            {/* 公開状態 */}
                            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">公開状態</h3>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="text-center">
                                        {getStatusBadge(page.is_published)}
                                        <p className="mt-2 text-sm text-gray-600">
                                            {page.is_published ? 'このページは公開されています' : 'このページは下書き状態です'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 更新履歴 */}
                            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                        <CalendarIcon className="h-5 w-5 mr-2" />
                                        更新履歴
                                    </h3>
                                </div>
                                <div className="px-6 py-4">
                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600">作成日時</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{page.created_at}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600">更新日時</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{page.updated_at}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {/* アクション */}
                            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">アクション</h3>
                                </div>
                                <div className="px-6 py-4 space-y-3">
                                    <BasicButton
                                        href={route('admin.homepage.pages.edit', page.id)}
                                        variant="primary"
                                        className="w-full"
                                    >
                                        <PencilIcon className="h-4 w-4 mr-2" />
                                        編集
                                    </BasicButton>
                                    <BasicButton
                                        href="#"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => window.open(`/pages/${page.slug}`, '_blank')}
                                    >
                                        <EyeIcon className="h-4 w-4 mr-2" />
                                        プレビュー
                                    </BasicButton>
                                    <BasicButton
                                        href={route('admin.homepage.pages.index')}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                        一覧に戻る
                                    </BasicButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}