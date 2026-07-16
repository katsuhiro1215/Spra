import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { FlashMessage } from "@/Components/Notifications";
import {
    DeleteButton,
    PrimaryButton,
    SecondaryButton,
    TextButton,
} from "@/Components/Buttons";
import { Badge } from "@/Components/Badges";
import { DeleteAlert } from "@/Components/Alerts";
import InvitationModal from "./_components/InvitationModal";
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
    PaperAirplaneIcon,
    UserPlusIcon,
    ArrowPathIcon,
    XCircleIcon,
    DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";
import {
    CONTACT_SOURCE_OPTIONS,
    CONTACT_STATUS_OPTIONS,
} from "@/Constants/SelectOptions";

export default function Show() {
    const { contact = {}, admins = [] } = usePage().props;
    const [isEditing, setIsEditing] = useState(false);
    const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
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

    const sourceOptions = CONTACT_SOURCE_OPTIONS;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!contact?.id) {
            console.error("Contact ID is missing");
            return;
        }

        const data = {
            status: formData.status,
            admin_notes: formData.admin_notes || null,
            assigned_to: formData.assigned_to || null,
        };

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
        setShowDeleteAlert(true);
    };

    const handleConfirmDelete = () => {
        router.delete(route("admin.contact.destroy", contact.id), {
            onSuccess: () => {
                router.visit(route("admin.contact.index"));
            },
            onFinish: () => setShowDeleteAlert(false),
        });
    };

    const handleResendInvitation = (invitationId) => {
        if (confirm("この招待を再送信しますか？")) {
            router.post(
                route("admin.invitations.resend", invitationId),
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const handleRevokeInvitation = (invitationId) => {
        if (
            confirm(
                "この招待を取り消しますか？取り消し後は使用できなくなります。",
            )
        ) {
            router.patch(
                route("admin.invitations.revoke", invitationId),
                {},
                {
                    preserveScroll: true,
                },
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

    const getInvitationStatusBadge = (invitation) => {
        const now = new Date();
        const expiresAt = new Date(invitation.expires_at);

        if (invitation.status === "accepted") {
            return (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    ✓ 承認済み
                </Badge>
            );
        } else if (invitation.status === "revoked") {
            return (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                    ✗ 取り消し済み
                </Badge>
            );
        } else if (now > expiresAt) {
            return (
                <Badge className="bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300">
                    期限切れ
                </Badge>
            );
        } else {
            return (
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    保留中
                </Badge>
            );
        }
    };

    const getCategoryLabel = () => {
        return contact.contact_category?.name || "-";
    };

    const headerActions = [
        {
            label: PageConfig.contacts.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contact.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.contacts.breadcrumbs,
        contact.name,
    ];

    // 見積もり・返信の重複作成を防ぐため、既存があればそちらへ誘導する
    const latestQuote = contact.quotes?.[0] || null;
    const latestResponse = contact.responses?.[0] || null;

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

            {/* 削除確認アラート */}
            <DeleteAlert
                show={showDeleteAlert}
                onClose={() => setShowDeleteAlert(false)}
                onConfirm={handleConfirmDelete}
                itemName={contact.name}
            />

            {/* アクションボタン */}
            <div className="space-y-6">
                <div className="flex justify-end gap-3">
                    {latestQuote ? (
                        <PrimaryButton
                            href={route("admin.quote.show", latestQuote.id)}
                            icon={DocumentTextIcon}
                        >
                            見積もりを確認
                        </PrimaryButton>
                    ) : (
                        <PrimaryButton
                            href={route("admin.quote.create", {
                                contact_id: contact.id,
                            })}
                            icon={DocumentTextIcon}
                        >
                            見積もりを作成
                        </PrimaryButton>
                    )}

                    {latestResponse ? (
                        latestResponse.status === "draft" ? (
                            <SecondaryButton
                                href={route("admin.contact.response.edit", [
                                    contact.id,
                                    latestResponse.id,
                                ])}
                                icon={PencilIcon}
                            >
                                下書きを編集
                            </SecondaryButton>
                        ) : (
                            <SecondaryButton
                                onClick={() =>
                                    document
                                        .getElementById("response-history")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        })
                                }
                                icon={CheckCircleIcon}
                            >
                                返信済み（履歴を見る）
                            </SecondaryButton>
                        )
                    ) : (
                        <SecondaryButton
                            href={route(
                                "admin.contact.response.create",
                                contact.id,
                            )}
                            icon={PaperAirplaneIcon}
                        >
                            返信する
                        </SecondaryButton>
                    )}

                    <DeleteButton onClick={handleDelete}>削除</DeleteButton>
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
                                            <TagIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                カテゴリ
                                            </span>
                                        </div>
                                        <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300">
                                            {getCategoryLabel()}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="flex items-center mb-2">
                                            <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                件名
                                            </span>
                                        </div>
                                        <p className="text-gray-900 dark:text-white">
                                            {contact.subject}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center mb-2">
                                            <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                メッセージ
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                                            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
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
                            <CardHeader className="flex justify-between items-center">
                                <CardTitle>
                                    <div className="flex items-center gap-2">
                                        <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                        <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                            管理者メモ
                                        </span>
                                    </div>
                                </CardTitle>
                                <TextButton
                                    className="p-1.5 text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
                                    title="編集"
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    <PencilIcon className="h-5 w-5 mr-2" />
                                    {isEditing ? "キャンセル" : "編集"}
                                </TextButton>
                            </CardHeader>
                            <CardBody>
                                {isEditing ? (
                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                                >
                                                    <option value="">未割当</option>
                                                    {admins.map((admin) => (
                                                        <option
                                                            key={admin.id}
                                                            value={admin.id}
                                                        >
                                                            {admin.email}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                                    placeholder="対応内容や特記事項を入力してください..."
                                                />
                                            </div>

                                            <div className="flex space-x-3">
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                                >
                                                    更新
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setIsEditing(false)
                                                    }
                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                                                >
                                                    キャンセル
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                現在のステータス:{" "}
                                            </span>
                                            {getStatusBadge(contact.status)}
                                        </div>

                                        {contact.assigned_admin && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    担当者:{" "}
                                                </span>
                                                <span className="text-gray-900 dark:text-white">
                                                    {contact.assigned_admin.email}
                                                </span>
                                            </div>
                                        )}

                                        {contact.admin_notes ? (
                                            <div>
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    メモ:
                                                </span>
                                                <div className="mt-2 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                                                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                                                        {contact.admin_notes}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400 italic">
                                                管理者メモはありません
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        {/* 返信履歴 */}
                        {contact.responses && contact.responses.length > 0 && (
                            <Card id="response-history">
                                <CardHeader>
                                    <CardTitle>返信履歴</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <div className="space-y-4">
                                        {contact.responses.map((response) => (
                                            <div
                                                key={response.id}
                                                className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 bg-gray-50 dark:bg-slate-800"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                                            {response.subject}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {response.sent_at
                                                                ? new Date(
                                                                    response.sent_at,
                                                                ).toLocaleString(
                                                                    "ja-JP",
                                                                )
                                                                : "下書き"}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            className={
                                                                response.status ===
                                                                "sent"
                                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                                    : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300"
                                                            }
                                                            size="xs"
                                                        >
                                                            {response.status ===
                                                            "sent"
                                                                ? "送信済み"
                                                                : "下書き"}
                                                        </Badge>
                                                        {response.status ===
                                                            "draft" && (
                                                            <TextButton
                                                                href={route(
                                                                    "admin.contact.response.edit",
                                                                    [
                                                                        contact.id,
                                                                        response.id,
                                                                    ],
                                                                )}
                                                                variant="warning"
                                                            >
                                                                <PencilIcon className="h-4 w-4" />
                                                            </TextButton>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                    {response.body?.substring(
                                                        0,
                                                        200,
                                                    )}
                                                    {response.body?.length > 200 &&
                                                        "..."}
                                                </div>
                                                {response.admin && (
                                                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                                        担当: {response.admin.email}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        {/* ユーザー招待 */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>ユーザー招待</CardTitle>
                                    <button
                                        onClick={() =>
                                            setIsInvitationModalOpen(true)
                                        }
                                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                    >
                                        <UserPlusIcon className="h-4 w-4" />
                                        招待を送信
                                    </button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                {contact.invitations &&
                                contact.invitations.length > 0 ? (
                                    <div className="space-y-3">
                                        {contact.invitations.map((invitation) => (
                                            <div
                                                key={invitation.id}
                                                className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 bg-gray-50 dark:bg-slate-800"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {getInvitationStatusBadge(
                                                                invitation,
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                                            送信先:{" "}
                                                            {invitation.email}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {invitation.status ===
                                                            "pending" &&
                                                            new Date(
                                                                invitation.expires_at,
                                                            ) > new Date() && (
                                                                <>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleResendInvitation(
                                                                                invitation.id,
                                                                            )
                                                                        }
                                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                                        title="再送信"
                                                                    >
                                                                        <ArrowPathIcon className="h-4 w-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleRevokeInvitation(
                                                                                invitation.id,
                                                                            )
                                                                        }
                                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded dark:text-red-400 dark:hover:bg-red-900/20"
                                                                        title="取り消し"
                                                                    >
                                                                        <XCircleIcon className="h-4 w-4" />
                                                                    </button>
                                                                </>
                                                            )}
                                                    </div>
                                                </div>

                                                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                                    <p>
                                                        <span className="font-medium">
                                                            送信日時:
                                                        </span>{" "}
                                                        {new Date(
                                                            invitation.created_at,
                                                        ).toLocaleString("ja-JP")}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">
                                                            有効期限:
                                                        </span>{" "}
                                                        {new Date(
                                                            invitation.expires_at,
                                                        ).toLocaleString("ja-JP")}
                                                    </p>
                                                    {invitation.invited_by && (
                                                        <p>
                                                            <span className="font-medium">
                                                                送信者:
                                                            </span>{" "}
                                                            {
                                                                invitation
                                                                    .invited_by
                                                                    .email
                                                            }
                                                        </p>
                                                    )}
                                                    {invitation.used_at && (
                                                        <p>
                                                            <span className="font-medium">
                                                                使用日時:
                                                            </span>{" "}
                                                            {new Date(
                                                                invitation.used_at,
                                                            ).toLocaleString(
                                                                "ja-JP",
                                                            )}
                                                        </p>
                                                    )}
                                                    {invitation.notes && (
                                                        <p>
                                                            <span className="font-medium">
                                                                メモ:
                                                            </span>{" "}
                                                            {invitation.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <UserPlusIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                                            まだ招待が送信されていません
                                        </p>
                                        <button
                                            onClick={() =>
                                                setIsInvitationModalOpen(true)
                                            }
                                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                                        >
                                            最初の招待を送信する
                                        </button>
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
                                    <UserIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            お名前
                                        </div>
                                        <div className="text-gray-900 dark:text-white">
                                            {contact.name}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            メールアドレス
                                        </div>
                                        <div className="text-gray-900 dark:text-white">
                                            <a
                                                href={`mailto:${contact.email}`}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                {contact.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {contact.phone && (
                                    <div className="flex items-start">
                                        <PhoneIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                電話番号
                                            </div>
                                            <div className="text-gray-900 dark:text-white">
                                                <a
                                                    href={`tel:${contact.phone}`}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    {contact.phone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {contact.company && (
                                    <div className="flex items-start">
                                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                会社名
                                            </div>
                                            <div className="text-gray-900 dark:text-white">
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
                                        <GlobeAltIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                流入元
                                            </div>
                                            <div className="text-gray-900 dark:text-white">
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
                                        <ComputerDesktopIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                IPアドレス
                                            </div>
                                            <div className="text-gray-900 dark:text-white font-mono text-xs">
                                                {contact.ip}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {contact.referrer && (
                                    <div className="flex items-start">
                                        <GlobeAltIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                リファラー
                                            </div>
                                            <div className="text-gray-900 dark:text-white text-xs break-all">
                                                {contact.referrer}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {contact.user_agent && (
                                    <div className="flex items-start">
                                        <ComputerDesktopIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                ユーザーエージェント
                                            </div>
                                            <div className="text-gray-700 dark:text-gray-300 text-xs break-all">
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
                                    <ClockIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            受信日時
                                        </div>
                                        <div className="text-gray-900 dark:text-white">
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
                                        <CheckCircleIcon className="h-5 w-5 text-green-400 dark:text-green-500 mr-3 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                返信日時
                                            </div>
                                            <div className="text-gray-900 dark:text-white">
                                                {new Date(
                                                    contact.responded_at,
                                                ).toLocaleString("ja-JP")}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start">
                                    <ClockIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            最終更新
                                        </div>
                                        <div className="text-gray-900 dark:text-white">
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
            </div>

            {/* Invitation Modal */}
            <InvitationModal
                contact={contact}
                isOpen={isInvitationModalOpen}
                onClose={() => setIsInvitationModalOpen(false)}
            />
        </AdminAuthenticatedLayout>
    );
}
