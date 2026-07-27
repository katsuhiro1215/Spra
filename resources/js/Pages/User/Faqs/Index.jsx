import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import { UserCard, UserCardBody } from "@/Components/User";
import { ChevronDownIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export default function Index({ categories = [] }) {
    const breadcrumbs = [
        { label: "ダッシュボード", href: route("user.dashboard") },
        { label: "よくある質問", href: null },
    ];

    const [openId, setOpenId] = useState(null);

    const toggle = (faqId) => {
        setOpenId((prev) => (prev === faqId ? null : faqId));
    };

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="よくある質問"
                    description="お客様からよくいただくご質問をまとめています"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="よくある質問" />

            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 py-8 space-y-8">
                {categories.length === 0 ? (
                    <UserCard>
                        <UserCardBody>
                            <div className="text-center py-12">
                                <p className="text-gray-500">
                                    現在公開中のFAQはありません
                                </p>
                            </div>
                        </UserCardBody>
                    </UserCard>
                ) : (
                    categories.map((category) => (
                        <div key={category.id}>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                                {category.name}
                            </h2>

                            <div className="space-y-3">
                                {(category.published_faqs || []).map(
                                    (item) => {
                                        const isOpen = openId === item.id;

                                        return (
                                            <div
                                                key={item.id}
                                                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggle(item.id)
                                                    }
                                                    className="w-full flex items-start justify-between gap-4 p-4 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    <span className="font-medium text-gray-900">
                                                        {item.question}
                                                    </span>
                                                    <ChevronDownIcon
                                                        className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${
                                                            isOpen
                                                                ? "rotate-180"
                                                                : ""
                                                        }`}
                                                    />
                                                </button>

                                                {isOpen && (
                                                    <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                                                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                                            {item.answer}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    ))
                )}

                {/* お問い合わせへの導線 */}
                <UserCard className="bg-indigo-50 border-indigo-100">
                    <UserCardBody>
                        <div className="flex items-center gap-4">
                            <QuestionMarkCircleIcon className="h-8 w-8 text-indigo-500 flex-shrink-0" />
                            <p className="text-gray-700">
                                お探しの内容が見つからない場合は、お手数ですが
                                <Link
                                    href={route("user.contact.index")}
                                    className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
                                >
                                    こちらまで
                                </Link>
                                お問い合わせください。
                            </p>
                        </div>
                    </UserCardBody>
                </UserCard>
            </div>
        </AuthenticatedLayout>
    );
}
