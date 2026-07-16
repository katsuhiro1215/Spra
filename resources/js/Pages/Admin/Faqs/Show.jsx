import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import {
    ArrowLeftIcon,
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
    StarIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function Show({ faq }) {
    const deleteFaq = () => {
        if (confirm(`「${faq.question}」を削除してもよろしいですか？`)) {
            router.delete(route("admin.homepage.faqs.destroy", faq.id));
        }
    };

    const getStatusBadge = () => {
        if (faq.is_published) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    公開中
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <XCircleIcon className="w-4 h-4 mr-2" />
                    下書き
                </span>
            );
        }
    };

    const getCategoryBadge = () => {
        if (!faq.faq_category) return null;

        return (
            <span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: faq.faq_category.color }}
            >
                {faq.faq_category.name}
            </span>
        );
    };

    const headerActions = [
        {
            label: FaqsConstants.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.homepage.faqs.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout>
            <Head title={`FAQ詳細 - ${faq.question}`} />
            {/* ヘッダー */}
            <PageHeader
                title={FaqsConstants.pages.edit.title}
                description={FaqsConstants.form.edit.description}
                actions={headerActions}
            />
            {/* メイン */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="mb-6 flex items-center justify-between">
                        <Link
                            href={route("admin.homepage.faqs.edit", faq.id)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            編集
                        </Link>
                        <button
                            onClick={deleteFaq}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            削除
                        </button>
                    </div>
                    <div className="p-6">
                        {/* ステータス情報 */}
                        <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                            {getCategoryBadge()}
                            {getStatusBadge()}
                            {faq.is_featured && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                    <StarIcon className="w-4 h-4 mr-2 fill-current" />
                                    よくある質問
                                </span>
                            )}
                            <span className="text-sm text-gray-500">
                                表示順序: {faq.sort_order}
                            </span>
                        </div>

                        {/* 質問 */}
                        <div className="mb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">
                                質問
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-800 text-lg leading-relaxed">
                                    {faq.question}
                                </p>
                            </div>
                        </div>

                        {/* 回答 */}
                        <div className="mb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">
                                回答
                            </h3>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>

                        {/* メタ情報 */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">
                                詳細情報
                            </h3>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        カテゴリ
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {faq.faq_category
                                            ? faq.faq_category.name
                                            : "未設定"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        表示順序
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {faq.sort_order}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        よくある質問
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {faq.is_featured ? "はい" : "いいえ"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        公開状態
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {faq.is_published ? "公開中" : "下書き"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        作成日時
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {new Date(
                                            faq.created_at
                                        ).toLocaleString("ja-JP")}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        更新日時
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {new Date(
                                            faq.updated_at
                                        ).toLocaleString("ja-JP")}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </main>
        </AdminAuthenticatedLayout>
    );
}
