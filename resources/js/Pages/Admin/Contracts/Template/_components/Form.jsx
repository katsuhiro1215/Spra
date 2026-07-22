import React from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    NumberInput,
    SelectInput,
    InputError,
} from "@/Components/Forms";
import { StoreButton, SecondaryButton } from "@/Components/Buttons";
import {
    CONTRACT_TEMPLATE_TYPE_OPTIONS,
    CONTRACT_TEMPLATE_STATUS_OPTIONS,
} from "@/Constants/SelectOptions";

const Form = ({
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
            {/* 基本情報 */}
            <Card>
                <CardHeader>基本情報</CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <FormGroup
                            label="テンプレート名"
                            required
                            error={errors.name}
                        >
                            <TextInput
                                value={data.name || ""}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="例: 標準契約書テンプレート"
                            />
                            <InputError message={errors.name} />
                        </FormGroup>

                        <FormGroup label="説明" error={errors.description}>
                            <TextArea
                                value={data.description || ""}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="テンプレートの用途などを入力してください"
                                rows={3}
                            />
                            <InputError message={errors.description} />
                        </FormGroup>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormGroup
                                label="テンプレート種別"
                                required
                                error={errors.template_type}
                            >
                                <SelectInput
                                    value={data.template_type || "standard"}
                                    onChange={(e) =>
                                        setData(
                                            "template_type",
                                            e.target.value,
                                        )
                                    }
                                    options={CONTRACT_TEMPLATE_TYPE_OPTIONS}
                                />
                                <InputError message={errors.template_type} />
                            </FormGroup>

                            <FormGroup
                                label="ステータス"
                                required
                                error={errors.status}
                            >
                                <SelectInput
                                    value={data.status || "active"}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    options={CONTRACT_TEMPLATE_STATUS_OPTIONS}
                                />
                                <InputError message={errors.status} />
                            </FormGroup>
                        </div>

                        <FormGroup label="表示順" error={errors.sort_order}>
                            <NumberInput
                                min={0}
                                value={data.sort_order}
                                onChange={(val) =>
                                    setData("sort_order", val || 0)
                                }
                            />
                            <InputError message={errors.sort_order} />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            {/* 契約条項 */}
            <Card>
                <CardHeader>契約条項</CardHeader>
                <CardBody>
                    <FormGroup
                        label="契約条項"
                        error={errors.terms_and_conditions}
                        hint="契約書の「契約条項」欄にそのまま反映されるテンプレート文面です"
                    >
                        <TextArea
                            value={data.terms_and_conditions || ""}
                            onChange={(e) =>
                                setData(
                                    "terms_and_conditions",
                                    e.target.value,
                                )
                            }
                            placeholder="契約条項のテンプレート文面を入力してください"
                            rows={15}
                        />
                        <InputError message={errors.terms_and_conditions} />
                    </FormGroup>
                </CardBody>
            </Card>

            {/* 特別条項 */}
            <Card>
                <CardHeader>特別条項</CardHeader>
                <CardBody>
                    <FormGroup
                        label="特別条項"
                        error={errors.special_provisions}
                        hint="必要に応じて契約書に追加する特別条項のテンプレート文面です"
                    >
                        <TextArea
                            value={data.special_provisions || ""}
                            onChange={(e) =>
                                setData("special_provisions", e.target.value)
                            }
                            placeholder="特別条項のテンプレート文面を入力してください"
                            rows={6}
                        />
                        <InputError message={errors.special_provisions} />
                    </FormGroup>
                </CardBody>
            </Card>

            {/* アクションボタン */}
            <div className="flex items-center justify-end gap-4">
                <SecondaryButton href={cancelRoute} size="md">
                    キャンセル
                </SecondaryButton>
                <StoreButton
                    type="submit"
                    disabled={processing}
                    loading={processing}
                    size="md"
                >
                    {processing
                        ? isEdit
                            ? "更新中..."
                            : "作成中..."
                        : isEdit
                          ? "更新"
                          : "作成"}
                </StoreButton>
            </div>
        </form>
    );
};

export default Form;
