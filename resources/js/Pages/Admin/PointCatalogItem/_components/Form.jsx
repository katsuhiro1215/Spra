import React from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { FormGroup, TextInput, TextArea, Toggle } from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";

const PointCatalogItemForm = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    isEdit = false,
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (typeof onSubmit === "function") {
            onSubmit();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>基本情報</CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <FormGroup
                            label="商品名"
                            htmlFor="name"
                            required
                            error={errors.name}
                        >
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                disabled={processing}
                                placeholder="SEO簡易診断"
                            />
                        </FormGroup>

                        <FormGroup
                            label="必要ポイント数"
                            htmlFor="points_cost"
                            required
                            error={errors.points_cost}
                        >
                            <TextInput
                                id="points_cost"
                                type="number"
                                min="1"
                                value={data.points_cost}
                                onChange={(e) =>
                                    setData("points_cost", e.target.value)
                                }
                                disabled={processing}
                            />
                        </FormGroup>

                        <FormGroup
                            label="表示順"
                            htmlFor="sort_order"
                            error={errors.sort_order}
                        >
                            <TextInput
                                id="sort_order"
                                type="number"
                                value={data.sort_order}
                                onChange={(e) =>
                                    setData("sort_order", e.target.value)
                                }
                                disabled={processing}
                            />
                        </FormGroup>

                        <FormGroup
                            label="説明"
                            htmlFor="description"
                            error={errors.description}
                        >
                            <TextArea
                                id="description"
                                value={data.description || ""}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                disabled={processing}
                                rows={3}
                            />
                        </FormGroup>

                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    有効
                                </label>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    無効にするとマイページの交換カタログに表示されなくなります
                                </p>
                            </div>
                            <Toggle
                                enabled={data.is_active || false}
                                onChange={(value) =>
                                    setData("is_active", value)
                                }
                                disabled={processing}
                            />
                        </div>
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
                <PrimaryButton type="submit" disabled={processing}>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    {isEdit ? "更新" : "作成"}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default PointCatalogItemForm;
