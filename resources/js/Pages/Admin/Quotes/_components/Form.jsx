import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FormGroup, TextInput, SelectInput, TextArea } from "@/Components/Forms";
import { QUOTE_STATUS_OPTIONS } from "@/Constants/SelectOptions";

export default function QuoteForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    users = [],
    isEdit = false,
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                {/* クライアント情報 */}
                <Card>
                    <CardHeader>
                        <CardTitle>クライアント情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormGroup
                                label="ユーザー"
                                htmlFor="user_id"
                                help="見積もりを作成するユーザーを選択してください（お問い合わせからの場合は任意）"
                                error={errors.user_id}
                            >
                                <SelectInput
                                    id="user_id"
                                    name="user_id"
                                    value={data.user_id || ""}
                                    onChange={(e) =>
                                        setData("user_id", e.target.value)
                                    }
                                    options={[
                                        {
                                            value: "",
                                            label: "ユーザーを選択（任意）",
                                        },
                                        ...users.map((user) => ({
                                            value: user.id,
                                            label: `${user.profile?.full_name || user.name} (${user.email})`,
                                        })),
                                    ]}
                                />
                            </FormGroup>

                            <FormGroup
                                label="会社"
                                htmlFor="company_id"
                                error={errors.company_id}
                            >
                                <SelectInput
                                    id="company_id"
                                    name="company_id"
                                    value={data.company_id || ""}
                                    onChange={(e) =>
                                        setData("company_id", e.target.value)
                                    }
                                    options={[
                                        {
                                            value: "",
                                            label: "会社を選択（任意）",
                                        },
                                    ]}
                                />
                            </FormGroup>
                        </div>
                    </CardBody>
                </Card>

                {/* 基本情報 */}
                <Card>
                    <CardHeader>
                        <CardTitle>基本情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormGroup
                                    label="件名"
                                    htmlFor="title"
                                    help="見積もりの件名を入力してください"
                                    required
                                    error={errors.title}
                                >
                                    <TextInput
                                        id="title"
                                        name="title"
                                        value={data.title || ""}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        placeholder="例: Webサイト制作見積もり"
                                        required
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="ステータス"
                                    htmlFor="status"
                                    required
                                    error={errors.status}
                                >
                                    <SelectInput
                                        id="status"
                                        name="status"
                                        value={data.status || "draft"}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        options={QUOTE_STATUS_OPTIONS}
                                        required
                                    />
                                </FormGroup>
                            </div>

                            <FormGroup
                                label="要件"
                                htmlFor="requirements"
                                error={errors.requirements}
                            >
                                <TextArea
                                    id="requirements"
                                    name="requirements"
                                    value={data.requirements || ""}
                                    onChange={(e) =>
                                        setData("requirements", e.target.value)
                                    }
                                    rows={4}
                                    placeholder="見積もりの要件を入力してください"
                                />
                            </FormGroup>

                            <FormGroup
                                label="カスタム仕様"
                                htmlFor="custom_specifications"
                                error={errors.custom_specifications}
                            >
                                <TextArea
                                    id="custom_specifications"
                                    name="custom_specifications"
                                    value={data.custom_specifications || ""}
                                    onChange={(e) =>
                                        setData(
                                            "custom_specifications",
                                            e.target.value,
                                        )
                                    }
                                    rows={3}
                                    placeholder="カスタム仕様やメモを入力してください"
                                />
                            </FormGroup>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-end space-x-4">
                <SecondaryButton
                    type="button"
                    href={cancelRoute}
                    disabled={processing}
                >
                    キャンセル
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={processing}>
                    {processing ? "処理中..." : isEdit ? "更新" : "作成"}
                </PrimaryButton>
            </div>
        </form>
    );
}
