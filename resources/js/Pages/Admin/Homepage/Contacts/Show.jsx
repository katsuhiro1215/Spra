import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ArrowLeftIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    TagIcon,
    ChatBubbleLeftRightIcon,
    ClockIcon,
    CheckCircleIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

export default function Show() {
    const { contact = {}, admins = [] } = usePage().props;
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        status: contact.status,
        admin_notes: contact.admin_notes || "",
        assigned_to: contact.assigned_to || "",
    });

    const statusOptions = [
        { value: "new", label: "新規", color: "bg-blue-100 text-blue-800" },
        {
            value: "in_progress",
            label: "対応中",
            color: "bg-yellow-100 text-yellow-800",
        },
        {
            value: "resolved",
            label: "解決済み",
            color: "bg-green-100 text-green-800",
        },
        {
            value: "closed",
            label: "クローズ",
            color: "bg-gray-100 text-gray-800",
        },
    ];

    const categoryOptions = [
        { value: "estimate", label: "見積もり" },
        { value: "partnership", label: "業務提携" },
        { value: "support", label: "サポート" },
        { value: "other", label: "その他" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!contact?.id) {
            console.error("Contact ID is missing");
            return;
        }

        const data = {
            status: formData.status,
        };

        // 空でない値のみ追加
        if (formData.admin_notes) {
            data.admin_notes = formData.admin_notes;
        }
        if (formData.assigned_to) {
            data.assigned_to = formData.assigned_to;
        }

        router.patch(
            route("admin.homepage.contacts.update", contact.id),
            data,
            {
                onSuccess: () => {
                    setIsEditing(false);
                },
            }
        );
    };

    const handleDelete = () => {
        if (!contact?.id) {
            console.error("Contact ID is missing");
            return;
        }

        if (confirm("このお問い合わせを削除してもよろしいですか？")) {
            router.delete(
                route("admin.homepage.contacts.destroy", contact.id),
                {
                    onSuccess: () => {
                        router.visit(route("admin.homepage.contacts.index"));
                    },
                }
            );
        }
    };

    const getStatusBadge = (status) => {
        const statusOption = statusOptions.find((opt) => opt.value === status);
        return (
            <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                    statusOption?.color || "bg-gray-100 text-gray-800"
                }`}
            >
                {statusOption?.label || status}
            </span>
        );
    };

    const getCategoryLabel = (category) => {
        const categoryOption = categoryOptions.find(
            (opt) => opt.value === category
        );
        return categoryOption?.label || category;
    };

    return (
        <AdminLayout>
            <Head title={`お問い合わせ詳細 - ${contact.name}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* ヘッダー */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() =>
                                        router.visit(
                                            route(
                                                "admin.homepage.contacts.index"
                                            )
                                        )
                                    }
                                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                                >
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                    お問い合わせ一覧に戻る
                                </button>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <PencilIcon className="h-4 w-4 mr-2" />
                                    {isEditing ? "キャンセル" : "編集"}
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                                >
                                    <TrashIcon className="h-4 w-4 mr-2" />
                                    削除
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* メインコンテンツ */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* お問い合わせ内容 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        お問い合わせ内容
                                    </h2>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <TagIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-700">
                                                    カテゴリ
                                                </span>
                                            </div>
                                            <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                                                {getCategoryLabel(
                                                    contact.category
                                                )}
                                            </span>
                                        </div>

                                        <div>
                                            <div className="flex items-center mb-2">
                                                <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-700">
                                                    件名
                                                </span>
                                            </div>
                                            <p className="text-gray-900">
                                                {contact.subject}
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex items-center mb-2">
                                                <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-700">
                                                    メッセージ
                                                </span>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-gray-900 whitespace-pre-wrap">
                                                    {contact.message}
                                                </p>
                                            </div>
                                        </div>

                                        {/* 添付ファイル */}
                                        {contact.attachments &&
                                            contact.attachments.length > 0 && (
                                                <div>
                                                    <div className="flex items-center mb-2">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            添付ファイル
                                                        </span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {contact.attachments.map(
                                                            (
                                                                attachment,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center p-2 bg-gray-50 rounded"
                                                                >
                                                                    <span className="text-sm text-gray-900">
                                                                        {
                                                                            attachment.name
                                                                        }
                                                                    </span>
                                                                    <span className="text-xs text-gray-500 ml-2">
                                                                        (
                                                                        {
                                                                            attachment.size
                                                                        }
                                                                        )
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>

                            {/* 管理者メモ */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        管理者メモ
                                    </h2>
                                </div>
                                <div className="px-6 py-4">
                                    {isEditing ? (
                                        <form onSubmit={handleSubmit}>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        ステータス
                                                    </label>
                                                    <select
                                                        value={formData.status}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                status: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        required
                                                    >
                                                        {statusOptions.map(
                                                            (option) => (
                                                                <option
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    value={
                                                                        option.value
                                                                    }
                                                                >
                                                                    {
                                                                        option.label
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        担当者
                                                    </label>
                                                    <select
                                                        value={
                                                            formData.assigned_to
                                                        }
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                assigned_to:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    >
                                                        <option value="">
                                                            未割当
                                                        </option>
                                                        {admins.map((admin) => (
                                                            <option
                                                                key={admin.id}
                                                                value={admin.id}
                                                            >
                                                                {admin.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        管理者メモ
                                                    </label>
                                                    <textarea
                                                        value={
                                                            formData.admin_notes
                                                        }
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                admin_notes:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        rows={6}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        placeholder="対応内容や特記事項を入力してください..."
                                                    />
                                                </div>

                                                <div className="flex space-x-3">
                                                    <button
                                                        type="submit"
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                    >
                                                        更新
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setIsEditing(false)
                                                        }
                                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                                    >
                                                        キャンセル
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-sm font-medium text-gray-700">
                                                    現在のステータス:{" "}
                                                </span>
                                                {getStatusBadge(contact.status)}
                                            </div>

                                            {contact.assigned_admin && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-700">
                                                        担当者:{" "}
                                                    </span>
                                                    <span className="text-gray-900">
                                                        {
                                                            contact
                                                                .assigned_admin
                                                                .name
                                                        }
                                                    </span>
                                                </div>
                                            )}

                                            {contact.admin_notes ? (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-700">
                                                        メモ:
                                                    </span>
                                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                                        <p className="text-gray-900 whitespace-pre-wrap">
                                                            {
                                                                contact.admin_notes
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 italic">
                                                    管理者メモはありません
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* サイドバー */}
                        <div className="space-y-6">
                            {/* お客様情報 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        お客様情報
                                    </h3>
                                </div>
                                <div className="px-6 py-4 space-y-4">
                                    <div className="flex items-start">
                                        <UserIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-700">
                                                お名前
                                            </div>
                                            <div className="text-gray-900">
                                                {contact.name}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-700">
                                                メールアドレス
                                            </div>
                                            <div className="text-gray-900">
                                                <a
                                                    href={`mailto:${contact.email}`}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    {contact.email}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {contact.phone && (
                                        <div className="flex items-start">
                                            <PhoneIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-700">
                                                    電話番号
                                                </div>
                                                <div className="text-gray-900">
                                                    <a
                                                        href={`tel:${contact.phone}`}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        {contact.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {contact.company && (
                                        <div className="flex items-start">
                                            <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-700">
                                                    会社名
                                                </div>
                                                <div className="text-gray-900">
                                                    {contact.company}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 履歴情報 */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        履歴
                                    </h3>
                                </div>
                                <div className="px-6 py-4 space-y-4">
                                    <div className="flex items-start">
                                        <ClockIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-700">
                                                受信日時
                                            </div>
                                            <div className="text-gray-900">
                                                {contact.created_at
                                                    ? new Date(
                                                          contact.created_at
                                                      ).toLocaleString("ja-JP")
                                                    : "不明"}
                                            </div>
                                        </div>
                                    </div>

                                    {contact.responded_at && (
                                        <div className="flex items-start">
                                            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-700">
                                                    返信日時
                                                </div>
                                                <div className="text-gray-900">
                                                    {new Date(
                                                        contact.responded_at
                                                    ).toLocaleString("ja-JP")}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start">
                                        <ClockIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-700">
                                                最終更新
                                            </div>
                                            <div className="text-gray-900">
                                                {contact.updated_at
                                                    ? new Date(
                                                          contact.updated_at
                                                      ).toLocaleString("ja-JP")
                                                    : "不明"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
