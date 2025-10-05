import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import BasicButton from '@/Components/BasicButton';
import { PencilIcon, EyeIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function Index({ pages }) {
    const [isDeleting, setIsDeleting] = useState(null);

    const handleDelete = (page) => {
        if (confirm(`「${page.title}」を削除してもよろしいですか？`)) {
            setIsDeleting(page.id);
            router.delete(route('admin.homepage.pages.destroy', page.id), {
                onFinish: () => setIsDeleting(null),
            });
        }
    };

    const getStatusBadge = (isPublished) => {
        return isPublished ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                公開中
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                下書き
            </span>
        );
    };

    const getTemplateBadge = (template) => {
        const templates = {
            'home': { label: 'ホーム', color: 'bg-blue-100 text-blue-800' },
            'about': { label: '会社概要', color: 'bg-purple-100 text-purple-800' },
            'contact': { label: 'お問い合わせ', color: 'bg-orange-100 text-orange-800' },
            'service': { label: 'サービス', color: 'bg-teal-100 text-teal-800' },
            'blog': { label: 'ブログ', color: 'bg-pink-100 text-pink-800' },
            'page': { label: '標準ページ', color: 'bg-gray-100 text-gray-800' },
        };

        const templateInfo = templates[template] || templates['page'];
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${templateInfo.color}`}>
                {templateInfo.label}
            </span>
        );
    };

    return (
        <AdminAuthenticatedLayout>
            <Head title="ページ管理" />

            <div className="py-6">
                {/* ヘッダー */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">ページ管理</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                ホームページの固定ページを管理します
                            </p>
                        </div>
                        <Link href={route('admin.homepage.pages.create')}>
                            <BasicButton 
                                variant="primary" 
                                size="md"
                                className="flex items-center"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                新規ページ作成
                            </BasicButton>
                        </Link>
                    </div>
                </div>

                {/* ページ一覧 */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {pages.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">ページがありません</h3>
                            <p className="text-gray-500 mb-6">最初のページを作成しましょう</p>
                            <Link href={route('admin.homepage.pages.create')}>
                                <BasicButton variant="primary">
                                    最初のページを作成
                                </BasicButton>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ページ情報
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            テンプレート
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            状態
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            表示順
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            更新日時
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            操作
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pages.map((page) => (
                                        <tr key={page.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {page.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        /{page.slug}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getTemplateBadge(page.template)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(page.is_published)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {page.sort_order}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {page.updated_at}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link 
                                                        href={route('admin.homepage.pages.show', page.id)}
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        title="詳細"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </Link>
                                                    <Link 
                                                        href={route('admin.homepage.pages.edit', page.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 p-1"
                                                        title="編集"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(page)}
                                                        disabled={isDeleting === page.id}
                                                        className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                                                        title="削除"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* フッター情報 */}
                {pages.length > 0 && (
                    <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
                        <div>
                            合計 {pages.length} ページ
                        </div>
                        <div>
                            公開中: {pages.filter(p => p.is_published).length} ページ / 
                            下書き: {pages.filter(p => !p.is_published).length} ページ
                        </div>
                    </div>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}