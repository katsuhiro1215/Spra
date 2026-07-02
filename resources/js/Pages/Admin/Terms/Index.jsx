import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { formatDate } from "@/Utils/Helpers";

export default function Index({ terms }) {
    const [expandedTitle, setExpandedTitle] = useState(null);

    const handleDelete = (id) => {
        if (confirm("この規約を削除してもよろしいですか？")) {
            router.delete(route("admin.terms.destroy", id));
        }
    };

    const handleActivate = (id) => {
        if (
            confirm(
                "この規約を有効化します。同じタイトルの他のバージョンは廃止されます。",
            )
        ) {
            router.post(route("admin.terms.activate", id));
        }
    };

    // タイトル別にグループ化
    const groupedTerms = terms.data.reduce((acc, term) => {
        if (!acc[term.title]) {
            acc[term.title] = [];
        }
        acc[term.title].push(term);
        return acc;
    }, {});

    return (
        <AuthenticatedLayout>
            <Head title="規約管理" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* ヘッダー */}
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            規約管理
                        </h1>
                        <Link href={route("admin.terms.create")}>
                            <PrimaryButton>新規作成</PrimaryButton>
                        </Link>
                    </div>

                    {/* 規約一覧 */}
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                        {Object.entries(groupedTerms).length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                規約がまだ登録されていません。
                            </div>
                        ) : (
                            <div className="divide-y">
                                {Object.entries(groupedTerms).map(
                                    ([title, versions]) => (
                                        <div key={title}>
                                            <button
                                                onClick={() =>
                                                    setExpandedTitle(
                                                        expandedTitle === title
                                                            ? null
                                                            : title,
                                                    )
                                                }
                                                className="w-full px-6 py-4 text-left hover:bg-gray-50 flex justify-between items-center"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {title}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {versions.length}
                                                            個のバージョン
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-gray-400">
                                                    {expandedTitle === title
                                                        ? "▼"
                                                        : "▶"}
                                                </div>
                                            </button>

                                            {/* バージョン一覧 */}
                                            {expandedTitle === title && (
                                                <div className="bg-gray-50 px-6 py-4 border-t">
                                                    <div className="space-y-3">
                                                        {versions
                                                            .sort(
                                                                (a, b) =>
                                                                    b.version -
                                                                    a.version,
                                                            )
                                                            .map((term) => (
                                                                <div
                                                                    key={
                                                                        term.id
                                                                    }
                                                                    className="flex items-center justify-between p-3 bg-white rounded border"
                                                                >
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="font-semibold">
                                                                                v
                                                                                {
                                                                                    term.version
                                                                                }
                                                                            </span>
                                                                            <span
                                                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                                    term.status ===
                                                                                    "active"
                                                                                        ? "bg-green-100 text-green-800"
                                                                                        : term.status ===
                                                                                            "draft"
                                                                                          ? "bg-yellow-100 text-yellow-800"
                                                                                          : "bg-gray-100 text-gray-800"
                                                                                }`}
                                                                            >
                                                                                {term.status ===
                                                                                "active"
                                                                                    ? "有効"
                                                                                    : term.status ===
                                                                                        "draft"
                                                                                      ? "ドラフト"
                                                                                      : "廃止"}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {term.effective_date
                                                                                ? `発効日: ${formatDate(
                                                                                      term.effective_date,
                                                                                  )}`
                                                                                : "まだ有効化されていません"}
                                                                        </p>
                                                                        <p className="text-xs text-gray-400">
                                                                            作成:{" "}
                                                                            {formatDate(
                                                                                term.created_at,
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex gap-2 ml-4">
                                                                        {term.status ===
                                                                            "draft" && (
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleActivate(
                                                                                        term.id,
                                                                                    )
                                                                                }
                                                                                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                                                                            >
                                                                                有効化
                                                                            </button>
                                                                        )}
                                                                        <Link
                                                                            href={route(
                                                                                "admin.terms.edit",
                                                                                term.id,
                                                                            )}
                                                                        >
                                                                            <SecondaryButton className="text-xs py-1 px-3">
                                                                                編集
                                                                            </SecondaryButton>
                                                                        </Link>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleDelete(
                                                                                    term.id,
                                                                                )
                                                                            }
                                                                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
                                                                        >
                                                                            削除
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </div>

                    {/* ページネーション */}
                    {terms.links && terms.links.length > 3 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {terms.links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    className={`px-3 py-2 rounded ${
                                        link.active
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
