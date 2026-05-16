import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
// Layouts
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
// Icons
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
    GlobeAltIcon,
    ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
import {
    CONTACT_SOURCE_OPTIONS,
    CONTACT_STATUS_OPTIONS,
    CONTACT_CATEGORY_OPTIONS,
} from "@/Constants/SelectOptions";

export default function Show() {
    const { contact = {}, admins = [] } = usePage().props;
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        status: contact.status,
        admin_notes: contact.admin_notes || "",
        assigned_to: contact.assigned_to || "",
    });

    const statusOptions = CONTACT_STATUS_OPTIONS.map((option) => ({
        ...option,
        color:
            option.value === "new"
                ? "bg-blue-100 text-blue-800"
                : option.value === "in_progress"
                  ? "bg-yellow-100 text-yellow-800"
                  : option.value === "replied"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800",
    }));

    const categoryOptions = CONTACT_CATEGORY_OPTIONS;
    const sourceOptions = CONTACT_SOURCE_OPTIONS;

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

        router.patch(route("admin.contact.update", contact.id), data, {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const handleDelete = () => {
        if (!contact?.id) {
            console.error("Contact ID is missing");
            return;
        }

        if (confirm("このお問い合わせを削除してもよろしいですか？")) {
            router.delete(route("admin.contact.destroy", contact.id), {
                onSuccess: () => {
                    router.visit(route("admin.contact.index"));
                },
            });
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
            (opt) => opt.value === category,
        );
        return categoryOption?.label || category;
    };

    const headerActions = [
        {
            label: PageConfig.contacts.actions.back,
            icon: ArrowLeftIcon,
            variant: "primary",
            route: route("admin.contact.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.contacts.breadcrumbs,
        {
            label: `お問い合わせ詳細: ${contact.name}`,
            route: route("admin.contact.show", contact.id),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`お問い合わせ詳細: ${contact.name}`}
                    description={PageConfig.contacts.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`お問い合わせ詳細 - ${contact.name}`} />

            {/* フラッシュメッセージ */}
            <FlashMessage />
            
            {/* メイン */}
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* メインコンテンツ */}
                <div className="lg:col-span-2 space-y-6">
                    {/* お問い合わせ内容 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>お問い合わせ内容</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <TagIcon className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">
                                            カテゴリ
                                        </span>
                                    </div>
                                    <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                                        {getCategoryLabel(contact.category)}
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
                                                    (attachment, index) => (
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
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </CardBody>
                    </Card>

                    {/* 管理者メモ */}
                    <Card>
                        <CardHeader>
                            <CardTitle>管理者メモ</CardTitle>
                        </CardHeader>
                        <CardBody>
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
                                                        status: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            >
                                                {statusOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                担当者
                                            </label>
                                            <select
                                                value={formData.assigned_to}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        assigned_to:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            >
                                                <option value="">未割当</option>
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
                                                value={formData.admin_notes}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        admin_notes:
                                                            e.target.value,
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
                                                {contact.assigned_admin.name}
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
                                                    {contact.admin_notes}
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
                        </CardBody>
                    </Card>
                </div>
                {/* サイドバー */}
                <div className="space-y-6">
                    {/* お客様情報 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>お客様情報</CardTitle>
                        </CardHeader>
                        <CardBody>
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
                        </CardBody>
                    </Card>

                    {/* 流入元・トラッキング情報 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>流入元・トラッキング情報</CardTitle>
                        </CardHeader>
                        <CardBody>
                            {contact.source && (
                                <div className="flex items-start">
                                    <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-700">
                                            流入元
                                        </div>
                                        <div className="text-gray-900">
                                            {sourceOptions.find(
                                                (opt) =>
                                                    opt.value ===
                                                    contact.source,
                                            )?.label || contact.source}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {contact.ip && (
                                <div className="flex items-start">
                                    <ComputerDesktopIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-700">
                                            IPアドレス
                                        </div>
                                        <div className="text-gray-900 font-mono text-xs">
                                            {contact.ip}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {contact.referrer && (
                                <div className="flex items-start">
                                    <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-700">
                                            リファラー
                                        </div>
                                        <div className="text-gray-900 text-xs break-all">
                                            {contact.referrer}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {contact.user_agent && (
                                <div className="flex items-start">
                                    <ComputerDesktopIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-700">
                                            ユーザーエージェント
                                        </div>
                                        <div className="text-gray-700 text-xs break-all">
                                            {contact.user_agent}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* 履歴情報 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>履歴</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="flex items-start">
                                <ClockIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                <div>
                                    <div className="text-sm font-medium text-gray-700">
                                        受信日時
                                    </div>
                                    <div className="text-gray-900">
                                        {contact.created_at
                                            ? new Date(
                                                  contact.created_at,
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
                                                contact.responded_at,
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
                                                  contact.updated_at,
                                              ).toLocaleString("ja-JP")
                                            : "不明"}
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
