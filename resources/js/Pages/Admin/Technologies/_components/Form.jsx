import { useState } from "react";
import { Card, CardTitle, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    NumberInput,
    Checkbox,
    InputError,
} from "@/Components/Forms";
import { StoreButton, SecondaryButton } from "@/Components/Buttons";

export default function TechnologyForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    isEdit = false,
}) {
    const [autoSlug, setAutoSlug] = useState(!isEdit);

    const generateSlug = (name) =>
        name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim("-");

    const handleNameChange = (e) => {
        const name = e.target.value;
        setData("name", name);
        if (autoSlug) {
            setData("slug", generateSlug(name));
        }
    };

    const handleSlugChange = (e) => {
        setData("slug", e.target.value);
        setAutoSlug(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormGroup label="技術名" required>
                            <TextInput
                                value={data.name}
                                onChange={handleNameChange}
                                placeholder="例: Laravel"
                            />
                            <InputError message={errors.name} />
                        </FormGroup>

                        <FormGroup
                            label={
                                <>
                                    スラッグ
                                    <span className="text-xs text-gray-500 ml-2">
                                        (空白の場合は自動生成)
                                    </span>
                                </>
                            }
                        >
                            <TextInput
                                value={data.slug}
                                onChange={handleSlugChange}
                                placeholder="例: laravel"
                            />
                            <InputError message={errors.slug} />
                        </FormGroup>

                        <FormGroup label="アイコン">
                            <TextInput
                                value={data.icon || ""}
                                onChange={(e) =>
                                    setData("icon", e.target.value)
                                }
                                placeholder="例: code-bracket"
                            />
                            <InputError message={errors.icon} />
                        </FormGroup>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                カラー <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.color}
                                onChange={(e) =>
                                    setData("color", e.target.value)
                                }
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                placeholder="#3B82F6"
                            />
                            <InputError message={errors.color} />
                        </div>

                        <FormGroup label="表示順">
                            <NumberInput
                                min={0}
                                value={data.sort_order}
                                onChange={(val) =>
                                    setData("sort_order", val || 0)
                                }
                            />
                            <InputError message={errors.sort_order} />
                        </FormGroup>

                        <div className="flex items-center mt-6">
                            <label className="flex items-center">
                                <Checkbox
                                    checked={data.is_active ?? true}
                                    onChange={(e) =>
                                        setData(
                                            "is_active",
                                            e.target.checked,
                                        )
                                    }
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    有効（サービスへの紐付けを許可する）
                                </span>
                            </label>
                            <InputError message={errors.is_active} />
                        </div>
                    </div>
                </CardBody>
            </Card>

            {data.name && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                        プレビュー
                    </h4>
                    <span
                        className="inline-flex items-center px-4 py-2 rounded-full text-white font-medium text-sm"
                        style={{ backgroundColor: data.color }}
                    >
                        {data.name}
                    </span>
                </div>
            )}

            <div className="flex items-center justify-end gap-4">
                <SecondaryButton href={cancelRoute} size="md">
                    キャンセル
                </SecondaryButton>
                <StoreButton type="submit" disabled={processing} loading={processing} size="md">
                    {processing ? (isEdit ? "更新中..." : "作成中...") : isEdit ? "更新" : "作成"}
                </StoreButton>
            </div>
        </form>
    );
}
