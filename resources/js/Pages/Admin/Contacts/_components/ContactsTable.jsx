import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { getRoleBadge, getStatusBadge } from "@/Constants/Badges";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const ContactsTable = ({ contacts, onDelete }) => {
    return (
        <Card>
            <CardHeader>お問い合わせ一覧 ({contacts.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>受信日時</Th>
                        <Th>名前</Th>
                        <Th>フリガナ</Th>
                        <Th>電話番号</Th>
                        <Th>メールアドレス</Th>
                        <Th>ステータス</Th>
                        <Th>登録日</Th>
                        <Th className="text-right">操作</Th>
                    </Tr>
                </THead>
                <TBody>
                    {contacts.data.map((contact) => (
                        <Tr key={contact.id}>
                            <Td>
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                            <span className="text-indigo-600 dark:text-indigo-300 font-medium text-sm">
                                                {contact.name}
                                            </span>
                                        </div>
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
                            <Td>{contact.kana}</Td>
                            <Td>{contact.phone}</Td>
                            <Td>{contact.email}</Td>
                            <Td>
                                <Badge
                                    variant={
                                        getStatusBadge(contact.status).variant
                                    }
                                    size="xs"
                                >
                                    {getStatusBadge(contact.status).text}
                                </Badge>
                            </Td>
                            <Td className="text-slate-500 dark:text-slate-400">
                                {new Date(
                                    contact.created_at,
                                ).toLocaleDateString("ja-JP")}
                            </Td>
                            <Td>
                                <div className="flex justify-end items-center gap-2">
                                    <Link
                                        href={route(
                                            "admin.contact.show",
                                            contact.id,
                                        )}
                                        className="p-1 text-cyan-600 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded transition-colors"
                                        title="詳細"
                                    >
                                        <EyeIcon className="h-5 w-5" />
                                    </Link>
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
