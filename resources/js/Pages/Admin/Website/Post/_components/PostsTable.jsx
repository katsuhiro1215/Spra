import React from "react";
import { Link } from "@inertiajs/react";
// Components
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const PostsTable = ({ posts, onDelete }) => {
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
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={route(
                                                "admin.website.post.show",
                                                post.id,
                                            )}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                                            title="詳細"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.website.post.edit",
                                                post.id,
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                                            title="編集"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(post)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                                            title="削除"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
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
