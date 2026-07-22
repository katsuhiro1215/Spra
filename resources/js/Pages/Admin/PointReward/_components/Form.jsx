import React from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { FormGroup, TextInput, TextArea, Toggle } from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";

const PointRewardForm = ({
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
                            label="コード"
                            htmlFor="code"
                            required
                            error={errors.code}
                            helpText="半角英小文字、数字、アンダースコアのみ使用可能。プログラムから参照する識別子です"
                        >
                            <TextInput
                                id="code"
                                value={data.code}
                                onChange={(e) =>
                                    setData("code", e.target.value)
                                }
                                disabled={processing || isEdit}
                                placeholder="first_contract"
                            />
                        </FormGroup>

                        <FormGroup
                            label="特典名"
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
                                placeholder="初回契約特典"
                            />
                        </FormGroup>

                        <FormGroup
                            label="付与ポイント数"
                            htmlFor="points"
                            required
                            error={errors.points}
                        >
                            <TextInput
                                id="points"
                                type="number"
                                value={data.points}
                                onChange={(e) =>
                                    setData("points", e.target.value)
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
                                    無効にすると手動付与の選択肢から外れます
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

export default PointRewardForm;
