import React from "react";
import { router } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import {
    PencilIcon,
    TrashIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

const AUDIENCE_LABELS = {
    all: "全ユーザー",
    active_contract: "契約中のユーザー",
};

const AnnouncementsTable = ({ announcements, onDelete }) => {
    const handlePublish = (announcement) => {
        if (
            confirm(
                `「${announcement.title}」を配信しますか？対象ユーザーへメールとダッシュボード通知が送信されます。`,
            )
        ) {
            router.post(
                route("admin.announcement.publish", announcement.id),
                {},
                { preserveScroll: true },
            );
        }
    };

    return (
        <Card>
            <CardHeader>お知らせ一覧 ({announcements.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>タイトル</Th>
                        <Th>配信対象</Th>
                        <Th>ステータス</Th>
                        <Th>配信日時</Th>
                        <Th>対象人数</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {announcements.data && announcements.data.length > 0 ? (
                        announcements.data.map((announcement) => (
                            <Tr key={announcement.id}>
                                <Td>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 max-w-md truncate">
                                        {announcement.title}
                                    </div>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-600 dark:text-slate-300">
                                        {AUDIENCE_LABELS[
                                            announcement.audience
                                        ] || announcement.audience}
                                    </span>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            announcement.is_published
                                                ? "success"
                                                : "secondary"
                                        }
                                        size="xs"
                                    >
                                        {announcement.is_published
                                            ? "配信済み"
                                            : "下書き"}
                                    </Badge>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {announcement.sent_at
                                            ? new Date(
                                                  announcement.sent_at,
                                              ).toLocaleString("ja-JP")
                                            : "-"}
                                    </span>
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {announcement.recipient_count ?? "-"}
                                    </span>
                                </Td>
                                <Td className="text-right">
                                    <div className="flex justify-end items-center gap-1">
                                        {!announcement.is_published && (
                                            <IconButton
                                                variant="success-text"
                                                icon={PaperAirplaneIcon}
                                                size="lg"
                                                onClick={() =>
                                                    handlePublish(announcement)
                                                }
                                                title="配信する"
                                            />
                                        )}
                                        <IconButton
                                            variant="warning-text"
                                            icon={PencilIcon}
                                            size="lg"
                                            href={route(
                                                "admin.announcement.edit",
                                                announcement.id,
                                            )}
                                            title="編集"
                                        />
                                        <IconButton
                                            variant="danger-text"
                                            icon={TrashIcon}
                                            size="lg"
                                            onClick={() =>
                                                onDelete(announcement)
                                            }
                                            title="削除"
                                        />
                                    </div>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td
                                colSpan={6}
                                className="text-center text-slate-500 dark:text-slate-400 py-8"
                            >
                                お知らせが見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default AnnouncementsTable;
