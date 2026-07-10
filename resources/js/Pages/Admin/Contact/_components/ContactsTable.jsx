import React from "react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { TextButton } from "@/Components/Buttons";
import Avatar from "@/Components/Avatar";
// Icons
import {
    EyeIcon,
    TrashIcon,
    ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const ContactsTable = ({
    contacts,
    selectedContacts,
    onSelect,
    onDelete,
    isDeleting,
}) => {
    const getContactStatusBadge = (status) => {
        const statusMap = {
            new: { text: "新規", variant: "info" },
            in_progress: { text: "対応中", variant: "warning" },
            replied: { text: "返信済み", variant: "success" },
            resolved: { text: "解決済み", variant: "success" },
            closed: { text: "クローズ", variant: "secondary" },
        };
        return statusMap[status] || { text: status, variant: "default" };
    };

    const handleSelectChange = (contactId) => {
        if (onSelect) {
            onSelect(contactId);
        }
    };

    return (
        <Card>
            <CardHeader>お問い合わせ一覧 ({contacts.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>選択</Th>
                        <Th>受信日時</Th>
                        <Th>名前</Th>
                        <Th>カテゴリ</Th>
                        <Th>件名</Th>
                        <Th>ステータス</Th>
                        <Th>担当者</Th>
                        <Th className="text-right">操作</Th>
                    </Tr>
                </THead>
                <TBody>
                    {contacts.data.map((contact) => (
                        <Tr key={contact.id}>
                            <Td>
                                <input
                                    type="checkbox"
                                    checked={selectedContacts.includes(
                                        contact.id,
                                    )}
                                    onChange={() =>
                                        handleSelectChange(contact.id)
                                    }
                                />
                            </Td>
                            <Td>
                                {new Date(contact.created_at).toLocaleString(
                                    "ja-JP",
                                    {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    },
                                )}
                            </Td>
                            <Td>
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <Avatar
                                            name={
                                                contact.name?.charAt(0) || "?"
                                            }
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {contact.name}
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            {contact.email}
                                        </div>
                                    </div>
                                </div>
                            </Td>
                            <Td>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {contact.contact_category?.name || "-"}
                                </span>
                            </Td>
                            <Td>
                                <div className="max-w-xs truncate text-sm text-slate-900 dark:text-slate-100">
                                    {contact.subject || "-"}
                                </div>
                            </Td>
                            <Td>
                                <Badge
                                    variant={
                                        getContactStatusBadge(contact.status)
                                            .variant
                                    }
                                    size="xs"
                                >
                                    {getContactStatusBadge(contact.status).text}
                                </Badge>
                            </Td>
                            <Td>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {contact.assigned_admin?.email || "未割当"}
                                </span>
                            </Td>
                            <Td>
                                <div className="flex justify-end items-center gap-1">
                                    <TextButton
                                        href={route(
                                            "admin.contact.show",
                                            contact.id,
                                        )}
                                        variant="info"
                                        title="詳細"
                                        size="sm"
                                    >
                                        <EyeIcon className="h-5 w-5" />
                                    </TextButton>
                                    {!contact.responded_at && (
                                        <TextButton
                                            href={route(
                                                "admin.contact.response.create",
                                                contact.id,
                                            )}
                                            variant="success"
                                            title="返信"
                                            size="sm"
                                        >
                                            <ChatBubbleLeftRightIcon className="h-5 w-5" />
                                        </TextButton>
                                    )}
                                    <TextButton
                                        onClick={() => onDelete(contact)}
                                        disabled={isDeleting === contact.id}
                                        variant="danger"
                                        title="削除"
                                        size="sm"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </TextButton>
                                </div>
                            </Td>
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </Card>
    );
};

export default ContactsTable;
