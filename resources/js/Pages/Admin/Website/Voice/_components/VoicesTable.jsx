import React from "react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import { StarIcon } from "@heroicons/react/24/solid";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const RatingStars = ({ rating }) => {
    if (!rating) {
        return <span className="text-sm text-slate-400">-</span>;
    }

    return (
        <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon
                    key={index}
                    className={`w-4 h-4 ${
                        index < rating
                            ? "text-amber-400"
                            : "text-slate-200 dark:text-slate-600"
                    }`}
                />
            ))}
        </div>
    );
};

const VoicesTable = ({ voices, onDelete }) => {
    return (
        <Card>
            <CardHeader>お客様の声一覧 ({voices.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>表示順</Th>
                        <Th>お客様</Th>
                        <Th>対象サービス</Th>
                        <Th>評価</Th>
                        <Th>注目表示</Th>
                        <Th>ステータス</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {voices.data && voices.data.length > 0 ? (
                        voices.data.map((voice) => (
                            <Tr key={voice.id}>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {voice.sort_order || "-"}
                                    </span>
                                </Td>
                                <Td>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {voice.author_name}
                                    </div>
                                    {voice.company_name && (
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            {voice.company_name}
                                        </div>
                                    )}
                                </Td>
                                <Td>
                                    {voice.service ? (
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                            {voice.service.name}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            全体向け
                                        </span>
                                    )}
                                </Td>
                                <Td>
                                    <RatingStars rating={voice.rating} />
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            voice.is_featured
                                                ? "info"
                                                : "secondary"
                                        }
                                        size="xs"
                                    >
                                        {voice.is_featured ? "対象" : "-"}
                                    </Badge>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            voice.is_published
                                                ? "success"
                                                : "secondary"
                                        }
                                        size="xs"
                                    >
                                        {voice.is_published
                                            ? "公開中"
                                            : "非公開"}
                                    </Badge>
                                </Td>
                                <Td className="text-right">
                                    <div className="flex justify-end items-center gap-1">
                                        <IconButton
                                            variant="info-text"
                                            icon={EyeIcon}
                                            size="lg"
                                            href={route(
                                                "admin.website.voice.show",
                                                voice.id,
                                            )}
                                            title="詳細"
                                        />
                                        <IconButton
                                            variant="warning-text"
                                            icon={PencilIcon}
                                            size="lg"
                                            href={route(
                                                "admin.website.voice.edit",
                                                voice.id,
                                            )}
                                            title="編集"
                                        />
                                        <IconButton
                                            variant="danger-text"
                                            icon={TrashIcon}
                                            size="lg"
                                            onClick={() => onDelete(voice)}
                                            title="削除"
                                        />
                                    </div>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td
                                colSpan={7}
                                className="text-center text-slate-500 dark:text-slate-400 py-8"
                            >
                                お客様の声が見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default VoicesTable;
