import React from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    InputError,
    Toggle,
} from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import { BlockEditor } from "@/Components/BlockUI";

const PostForm = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    categories = [],
    mediaList,
    isEdit = false,
}) => {
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim("-");
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setData({
            ...data,
            title: title,
            slug: isEdit ? data.slug : generateSlug(title),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (typeof onSubmit === "function") {
            onSubmit();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報 */}
            <Card>
                <CardHeader>基本情報</CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <FormGroup label="カテゴリ" htmlFor="post_category_id" required>
                            <SelectInput
                                id="post_category_id"
                                value={data.post_category_id}
                                onChange={(e) =>
                                    setData("post_category_id", e.target.value)
                                }
                                disabled={processing}
                            >
                                <option value="">カテゴリを選択...</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError message={errors.post_category_id} />
                        </FormGroup>

                        <FormGroup label="タイトル" htmlFor="title" required>
                            <TextInput
                                id="title"
                                value={data.title}
                                onChange={handleTitleChange}
                                disabled={processing}
                                placeholder="投稿タイトルを入力..."
                            />
                            <InputError message={errors.title} />
                        </FormGroup>

                        <FormGroup label="スラッグ" htmlFor="slug" required>
                            <TextInput
                                id="slug"
                                value={data.slug}
                                onChange={(e) => setData("slug", e.target.value)}
                                disabled={processing}
                                placeholder="post-slug"
                            />
                            <InputError message={errors.slug} />
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                URL
                                で使用されます（英小文字、数字、ハイフンのみ）
                            </p>
                        </FormGroup>

                        <FormGroup label="サムネイル画像URL" htmlFor="thumbnail">
                            <TextInput
                                id="thumbnail"
                                value={data.thumbnail || ""}
                                onChange={(e) =>
                                    setData("thumbnail", e.target.value)
                                }
                                disabled={processing}
                                placeholder="https://..."
                            />
                            <InputError message={errors.thumbnail} />
                        </FormGroup>

                        <FormGroup label="抜粋" htmlFor="excerpt">
                            <TextArea
                                id="excerpt"
                                value={data.excerpt || ""}
                                onChange={(e) =>
                                    setData("excerpt", e.target.value)
                                }
                                disabled={processing}
                                rows={3}
                                placeholder="一覧に表示される要約文"
                            />
                            <InputError message={errors.excerpt} />
                        </FormGroup>

                        <FormGroup label="タグ" htmlFor="tags">
                            <TextInput
                                id="tags"
                                value={data.tags || ""}
                                onChange={(e) =>
                                    setData("tags", e.target.value)
                                }
                                disabled={processing}
                                placeholder="React, JavaScript, Web開発"
                            />
                            <InputError message={errors.tags} />
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                カンマ区切りで入力してください
                            </p>
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            {/* コンテンツ（ブロックエディタ） */}
            <Card>
                <CardHeader>コンテンツ</CardHeader>
                <CardBody>
                    <BlockEditor
                        value={data.content}
                        onChange={(value) => setData("content", value)}
                        mediaList={mediaList}
                    />
                    <InputError message={errors.content} />
                </CardBody>
            </Card>

            {/* メタ情報 */}
            <Card>
                <CardHeader>メタ情報（SEO）</CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <FormGroup label="メタタイトル" htmlFor="meta_title">
                            <TextInput
                                id="meta_title"
                                value={data.meta_title || ""}
                                onChange={(e) =>
                                    setData("meta_title", e.target.value)
                                }
                                disabled={processing}
                                placeholder="SEO用のタイトル"
                            />
                            <InputError message={errors.meta_title} />
                        </FormGroup>

                        <FormGroup label="メタ説明" htmlFor="meta_description">
                            <TextArea
                                id="meta_description"
                                value={data.meta_description || ""}
                                onChange={(e) =>
                                    setData("meta_description", e.target.value)
                                }
                                disabled={processing}
                                rows={3}
                                placeholder="検索結果に表示される説明文"
                            />
                            <InputError message={errors.meta_description} />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            {/* 公開設定 */}
            <Card>
                <CardHeader>公開設定</CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    公開
                                </label>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    この投稿を公開します
                                </p>
                            </div>
                            <Toggle
                                enabled={data.is_published || false}
                                onChange={(value) =>
                                    setData("is_published", value)
                                }
                                disabled={processing}
                            />
                        </div>

                        {data.is_published && (
                            <FormGroup label="公開日時" htmlFor="published_at">
                                <TextInput
                                    id="published_at"
                                    type="datetime-local"
                                    value={data.published_at || ""}
                                    onChange={(e) =>
                                        setData("published_at", e.target.value)
                                    }
                                    disabled={processing}
                                />
                                <InputError message={errors.published_at} />
                            </FormGroup>
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* アクションボタン */}
            <div className="flex items-center justify-end gap-3">
                <SecondaryButton
                    type="button"
                    href={cancelRoute}
                    disabled={processing}
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    キャンセル
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={processing}>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    {isEdit ? "更新" : "作成"}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default PostForm;
