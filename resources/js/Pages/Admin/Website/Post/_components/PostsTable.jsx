import React from "react";
// Components
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { IconButton } from "@/Components/Buttons";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";

const PostsTable = ({ posts, onDelete, onRestore, trashed }) => {
    const isTrashedView = trashed === "only_trashed";
    const getStatusBadge = (isPublished) => {
        return isPublished
            ? { text: "公開", variant: "success" }
            : { text: "下書き", variant: "secondary" };
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("ja-JP");
    };

    return (
        <Card>
            <CardHeader>ブログ一覧 ({posts.total}件)</CardHeader>
            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>タイトル</Th>
                        <Th>ステータス</Th>
                        <Th>カテゴリ</Th>
                        <Th>作成者</Th>
                        <Th>公開日</Th>
                        <Th>更新日</Th>
                        <Th className="text-right">アクション</Th>
                    </Tr>
                </THead>
                <TBody>
                    {posts.data && posts.data.length > 0 ? (
                        posts.data.map((post) => (
                            <Tr key={post.id}>
                                <Td>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {post.title}
                                        </div>
                                        {post.slug && (
                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                {post.slug}
                                            </div>
                                        )}
                                    </div>
                                </Td>
                                <Td>
                                    <Badge
                                        variant={
                                            getStatusBadge(post.is_published)
                                                .variant
                                        }
                                        size="xs"
                                    >
                                        {getStatusBadge(post.is_published).text}
                                    </Badge>
                                </Td>
                                <Td>
                                    {post.post_category ||
                                    post.postCategory ? (
                                        <Badge variant="info" size="xs">
                                            {(post.post_category ||
                                                post.postCategory).name}
                                        </Badge>
                                    ) : (
                                        <span className="text-slate-400 dark:text-slate-500">
                                            -
                                        </span>
                                    )}
                                </Td>
                                <Td>
                                    {post.created_by || post.createdBy ? (
                                        <span className="text-sm text-slate-900 dark:text-slate-100">
                                            {(post.created_by || post.createdBy)
                                                .name}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 dark:text-slate-500">
                                            -
                                        </span>
                                    )}
                                </Td>
                                <Td>
                                    {post.published_at ? (
                                        <span className="text-sm text-slate-900 dark:text-slate-100">
                                            {formatDate(post.published_at)}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 dark:text-slate-500">
                                            -
                                        </span>
                                    )}
                                </Td>
                                <Td>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {formatDate(post.updated_at)}
                                    </span>
                                </Td>
                                <Td className="text-right">
                                    <div className="flex justify-end items-center gap-1">
                                        <IconButton
                                            variant="info-text"
                                            icon={EyeIcon}
                                            size="lg"
                                            href={route(
                                                "admin.website.post.show",
                                                post.id,
                                            )}
                                            title="詳細"
                                        />
                                        {isTrashedView ? (
                                            <IconButton
                                                variant="success-text"
                                                icon={ArrowUturnLeftIcon}
                                                size="lg"
                                                onClick={() =>
                                                    onRestore?.(post)
                                                }
                                                title="復元"
                                            />
                                        ) : (
                                            <>
                                                <IconButton
                                                    variant="warning-text"
                                                    icon={PencilIcon}
                                                    size="lg"
                                                    href={route(
                                                        "admin.website.post.edit",
                                                        post.id,
                                                    )}
                                                    title="編集"
                                                />
                                                <IconButton
                                                    variant="danger-text"
                                                    icon={TrashIcon}
                                                    size="lg"
                                                    onClick={() =>
                                                        onDelete(post)
                                                    }
                                                    title="削除"
                                                />
                                            </>
                                        )}
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
                                投稿が見つかりません
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    );
};

export default PostsTable;
