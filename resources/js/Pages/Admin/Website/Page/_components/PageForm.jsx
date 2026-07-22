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

const PageForm = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    pageTypes = [],
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
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
                {/* 基本情報 */}
                <Card>
                    <CardHeader>基本情報</CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            <FormGroup
                                label="ページタイプ"
                                htmlFor="page_type_id"
                                required
                            >
                                <SelectInput
                                    id="page_type_id"
                                    value={data.page_type_id}
                                    onChange={(e) =>
                                        setData("page_type_id", e.target.value)
                                    }
                                    disabled={processing}
                                >
                                    <option value="">
                                        ページタイプを選択...
                                    </option>
                                    {pageTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                            {type.description &&
                                                ` - ${type.description}`}
                                        </option>
                                    ))}
                                </SelectInput>
                                <InputError message={errors.page_type_id} />
                            </FormGroup>

                            <FormGroup
                                label="タイトル"
                                htmlFor="title"
                                required
                            >
                                <TextInput
                                    id="title"
                                    value={data.title}
                                    onChange={handleTitleChange}
                                    disabled={processing}
                                    placeholder="ページタイトルを入力..."
                                />
                                <InputError message={errors.title} />
                            </FormGroup>

                            <FormGroup label="スラッグ" htmlFor="slug" required>
                                <TextInput
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) =>
                                        setData("slug", e.target.value)
                                    }
                                    disabled={processing}
                                    placeholder="page-slug"
                                />
                                <InputError message={errors.slug} />
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    URL
                                    で使用されます（英小文字、数字、ハイフンのみ）
                                </p>
                            </FormGroup>

                            <FormGroup label="表示順" htmlFor="sort_order">
                                <TextInput
                                    id="sort_order"
                                    type="number"
                                    value={data.sort_order || 0}
                                    onChange={(e) =>
                                        setData("sort_order", e.target.value)
                                    }
                                    disabled={processing}
                                    min="0"
                                />
                                <InputError message={errors.sort_order} />
                            </FormGroup>
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        公開
                                    </label>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        このページを公開します
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
                        </div>
                    </CardBody>
                </Card>
                {/* メタ情報 */}
                <Card>
                    <CardHeader>メタ情報（SEO）</CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            <FormGroup
                                label="メタタイトル"
                                htmlFor="meta_title"
                            >
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

                            <FormGroup
                                label="メタ説明"
                                htmlFor="meta_description"
                            >
                                <TextArea
                                    id="meta_description"
                                    value={data.meta_description || ""}
                                    onChange={(e) =>
                                        setData(
                                            "meta_description",
                                            e.target.value,
                                        )
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
                <div className="flex items-center justify-end gap-3">
                    <SecondaryButton
                        type="button"
                        href={cancelRoute}
                        disabled={processing}
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        キャンセル
                    </SecondaryButton>
                    <PrimaryButton
                        type="submit"
                        disabled={processing}
                    >
                        <CheckIcon className="h-4 w-4 mr-2" />
                        {isEdit ? "更新" : "作成"}
                    </PrimaryButton>
                </div>
            </div>
        </form>
    );
};

export default PageForm;
