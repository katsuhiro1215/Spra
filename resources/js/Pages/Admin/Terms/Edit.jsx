import React, { useState } from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import { formatDate } from "@/Utils/Helpers";

export default function Edit({ term, versions }) {
    const [showCreateVersion, setShowCreateVersion] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        title: term.title,
        content: term.content,
    });

    const {
        data: versionData,
        setData: setVersionData,
        post: postVersion,
    } = useForm({
        content: "",
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        post(route("admin.terms.update", term.id));
    };

    const handleCreateVersion = (e) => {
        e.preventDefault();
        if (
            confirm(
                `この規約の新しいバージョン(v${term.version + 1})を作成します。`,
            )
        ) {
            postVersion(route("admin.terms.createVersion", term.id));
        }
    };

    const handleActivate = () => {
        if (
            confirm(
                "この規約を有効化します。同じタイトルの他のバージョンは廃止されます。",
            )
        ) {
            router.post(route("admin.terms.activate", term.id));
        }
    };

    const handleRevertToDraft = () => {
        if (confirm("この規約をドラフト状態に戻します。")) {
            router.post(route("admin.terms.revertToDraft", term.id));
        }
    };

    const handleDelete = () => {
        if (confirm("この規約を削除してもよろしいですか？")) {
            router.delete(route("admin.terms.destroy", term.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`規約編集: ${term.title}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* ヘッダー */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {term.title}
                                </h1>
                                <p className="text-gray-500 mt-2">
                                    v{term.version}{" "}
                                    <span
                                        className={`ml-2 px-3 py-1 text-xs font-semibold rounded-full ${
                                            term.status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : term.status === "draft"
                                                  ? "bg-yellow-100 text-yellow-800"
                                                  : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {term.status === "active"
                                            ? "有効"
                                            : term.status === "draft"
                                              ? "ドラフト"
                                              : "廃止"}
                                    </span>
                                </p>
                            </div>
                            <Link href={route("admin.terms.index")}>
                                <SecondaryButton>一覧に戻る</SecondaryButton>
                            </Link>
                        </div>

                        {/* メタ情報 */}
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">作成日</p>
                                <p className="font-semibold text-gray-900">
                                    {formatDate(term.created_at)}
                                </p>
                            </div>
                            {term.effective_date && (
                                <div>
                                    <p className="text-gray-500">発効日</p>
                                    <p className="font-semibold text-gray-900">
                                        {formatDate(term.effective_date)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 編集フォーム */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-6 text-gray-900">
                            規約内容を編集
                        </h2>

                        {term.status !== "draft" && (
                            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-sm text-yellow-800">
                                    ⚠️ この規約は{" "}
                                    {term.status === "active" ? "有効" : "廃止"}
                                    状態です。編集するには新しいバージョンを作成してください。
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleUpdate} className="space-y-6">
                            {/* 内容 */}
                            <div>
                                <InputLabel
                                    htmlFor="content"
                                    value="規約内容"
                                />
                                <textarea
                                    id="content"
                                    name="content"
                                    value={data.content}
                                    onChange={(e) =>
                                        setData("content", e.target.value)
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                                    rows="15"
                                    disabled={
                                        processing || term.status !== "draft"
                                    }
                                />
                                <InputError
                                    message={errors.content}
                                    className="mt-2"
                                />
                            </div>

                            {/* ボタン */}
                            {term.status === "draft" && (
                                <div className="flex gap-4 justify-end pt-4 border-t">
                                    <SecondaryButton
                                        onClick={() =>
                                            setData({
                                                title: term.title,
                                                content: term.content,
                                            })
                                        }
                                    >
                                        リセット
                                    </SecondaryButton>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? "保存中..." : "保存"}
                                    </PrimaryButton>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* アクション */}
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">
                            アクション
                        </h3>
                        <div className="space-y-3">
                            {term.status === "draft" && (
                                <button
                                    onClick={handleActivate}
                                    className="w-full px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold"
                                >
                                    ✓ この規約を有効化
                                </button>
                            )}
                            {term.status === "active" && (
                                <button
                                    onClick={handleRevertToDraft}
                                    className="w-full px-4 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition font-semibold"
                                >
                                    ↶ ドラフトに戻す
                                </button>
                            )}
                            {term.status === "draft" && (
                                <button
                                    onClick={() => setShowCreateVersion(true)}
                                    className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
                                >
                                    + 新しいバージョンを作成
                                </button>
                            )}
                            <button
                                onClick={handleDelete}
                                className="w-full px-4 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition font-semibold"
                            >
                                🗑️ 削除
                            </button>
                        </div>
                    </div>

                    {/* バージョン履歴 */}
                    {versions.length > 1 && (
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900">
                                バージョン履歴
                            </h3>
                            <div className="space-y-2">
                                {versions
                                    .sort((a, b) => b.version - a.version)
                                    .map((v) => (
                                        <div
                                            key={v.id}
                                            className={`p-3 rounded border ${
                                                v.id === term.id
                                                    ? "bg-blue-50 border-blue-200"
                                                    : "bg-gray-50"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="font-semibold">
                                                        v{v.version}
                                                    </span>
                                                    <span
                                                        className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                                                            v.status ===
                                                            "active"
                                                                ? "bg-green-100 text-green-800"
                                                                : v.status ===
                                                                    "draft"
                                                                  ? "bg-yellow-100 text-yellow-800"
                                                                  : "bg-gray-100 text-gray-800"
                                                        }`}
                                                    >
                                                        {v.status === "active"
                                                            ? "有効"
                                                            : v.status ===
                                                                "draft"
                                                              ? "ドラフト"
                                                              : "廃止"}
                                                    </span>
                                                    <span className="text-xs text-gray-500 ml-3">
                                                        {formatDate(
                                                            v.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                                {v.id !== term.id && (
                                                    <Link
                                                        href={route(
                                                            "admin.terms.edit",
                                                            v.id,
                                                        )}
                                                    >
                                                        <SecondaryButton className="text-xs py-1 px-3">
                                                            表示
                                                        </SecondaryButton>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
