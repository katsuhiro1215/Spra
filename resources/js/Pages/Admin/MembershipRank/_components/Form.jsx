import React from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { FormGroup, TextInput, TextArea, Toggle } from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";

const MembershipRankForm = ({
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
                            label="キー"
                            htmlFor="key"
                            required
                            error={errors.key}
                            helpText="半角英小文字、数字、アンダースコアのみ使用可能。プログラムから参照する識別子です"
                        >
                            <TextInput
                                id="key"
                                value={data.key}
                                onChange={(e) =>
                                    setData("key", e.target.value)
                                }
                                disabled={processing || isEdit}
                                placeholder="gold"
                            />
                        </FormGroup>

                        <FormGroup
                            label="ランク名"
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
                                placeholder="Gold"
                            />
                        </FormGroup>

                        <FormGroup
                            label="年間利用額のしきい値（円）"
                            htmlFor="min_annual_amount"
                            required
                            error={errors.min_annual_amount}
                            helpText="この金額以上の年間利用額（暦年）でこのランクが適用されます"
                        >
                            <TextInput
                                id="min_annual_amount"
                                type="number"
                                min="0"
                                value={data.min_annual_amount}
                                onChange={(e) =>
                                    setData(
                                        "min_annual_amount",
                                        e.target.value,
                                    )
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
                            label="特典の説明"
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
                                rows={4}
                                placeholder="優先対応&#10;月1回相談無料"
                            />
                        </FormGroup>

                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    有効
                                </label>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    無効にするとランク判定バッチの対象から外れます
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
                    キャンセル
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={processing}>
                    {isEdit ? "更新" : "作成"}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default MembershipRankForm;
