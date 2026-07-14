import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
// Components
import { Card, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    NumberInput,
    InputError,
} from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
// Validation
import * as validation from "./validation";

const Form = ({ category = null, isEditing = false }) => {
    const [localErrors, setLocalErrors] = useState({});
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || "",
        description: category?.description || "",
        sort_order: category?.sort_order || 0,
        is_active: category?.is_active || true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing && category) {
            put(route("admin.contact.category.update", category.id), {
                preserveScroll: true,
            });
        } else {
            post(route("admin.contact.category.store"), {
                preserveScroll: true,
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                {isEditing ? "カテゴリを編集" : "新しいカテゴリを作成"}
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* カテゴリ名 */}
                    <FormGroup>
                        <TextInput
                            label="カテゴリ名"
                            placeholder="例: 見積もり"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        <InputError message={errors.name || localErrors.name} />
                    </FormGroup>

                    {/* 説明 */}
                    <FormGroup>
                        <TextArea
                            label="説明"
                            placeholder="このカテゴリについての説明を入力してください"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            rows={4}
                        />
                        <div className="text-sm text-gray-500 mt-1">
                            {data.description.length}/500
                        </div>
                        <InputError
                            message={
                                errors.description || localErrors.description
                            }
                        />
                    </FormGroup>

                    {/* 並び順 */}
                    <FormGroup label="表示順">
                        <NumberInput
                            id="sort_order"
                            min={0}
                            placeholder="0"
                            value={data.sort_order}
                            onChange={(val) => setData("sort_order", val || 0)}
                            onBlur={() => handleBlur("sort_order")}
                            required
                        />
                        <div className="text-sm text-gray-500 mt-1">
                            数字が小さいほど上に表示されます
                        </div>
                        <InputError
                            message={
                                errors.sort_order || localErrors.sort_order
                            }
                        />
                    </FormGroup>

                    {/* ステータス */}
                    <FormGroup label="ステータス" error={errors.is_active}>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active ?? true}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        is_active: e.target.checked,
                                    })
                                }
                                className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-700"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                アクティブ（有効化）
                            </span>
                        </label>
                        <InputError message={errors.is_active} />
                    </FormGroup>

                    {/* ボタン */}
                    <div className="flex gap-3 pt-6">
                        <PrimaryButton type="submit" disabled={processing}>
                            {isEditing ? "更新" : "作成"}
                        </PrimaryButton>
                        <SecondaryButton
                            type="button"
                            href={route("admin.contact.category.index")}
                            disabled={processing}
                        >
                            キャンセル
                        </SecondaryButton>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
};

export default Form;
