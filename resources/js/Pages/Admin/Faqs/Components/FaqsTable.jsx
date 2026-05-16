import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { getStatusBadge } from "@/Constants/Badges";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const FaqsTable = ({ faqs, onDelete }) => {
    return (
        <Card>
            <CardHeader>質問一覧 ({faqs.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>
                            <input
                                type="checkbox"
                                checked={
                                    faqs.data.length > 0 &&
                                    selectedFaqs.length === faqs.data.length
                                }
                                onChange={handleSelectAll}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                        </Th>
                        <Th>質問</Th>
                        <Th>カテゴリ</Th>
                        <Th>状態</Th>
                        <Th>よくある質問</Th>
                        <Th>表示順序</Th>
                        <Th>更新日</Th>
                        <Th className="text-right">操作</Th>
                    </Tr>
                </THead>
                <TBody>
                    {faqs.data.map((faq) => (
                        <Tr key={faq.id}>
                            <Td>
                                <input
                                    type="checkbox"
                                    checked={selectedFaqs.includes(faq.id)}
                                    onChange={() => handleSelectFaq(faq.id)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </Td>
                            <Td>
                                <div className="max-w-xs">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {faq.question}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        {faq.answer.substring(0, 80)}
                                        ...
                                    </p>
                                </div>
                            </Td>
                            <Td>{getCategoryBadge(faq.faq_category)}</Td>
                            <Td>{getStatusBadge(faq.status)}</Td>
                            <Td>
                                {faq.is_featured && (
                                    <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                                )}
                            </Td>
                            <Td>{faq.sort_order}</Td>
                            <Td>
                                <div className="flex justify-end items-center gap-2">
                                    <Link
                                        href={route("admin.faq.show", faq.id)}
                                        className="p-1 text-cyan-600 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded transition-colors"
                                        title="詳細"
                                    >
                                        <EyeIcon className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href={route("admin.faq.edit", faq.id)}
                                        className="p-1 text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
                                        title="編集"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </Link>
                                    <button
                                        onClick={() => onDelete(faq)}
                                        className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                        title="削除"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </Td>
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </Card>
    );
};

export default FaqsTable;
