import React from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { FormGroup, TextInput, TextArea, SelectInput } from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";

const BRAND_OPTIONS = [
    { value: "concierge", label: "Atlas Concierge" },
    { value: "life", label: "Atlas Life" },
    { value: "japan", label: "Atlas Japan" },
];

const STATUS_OPTIONS = [
    { value: "pending", label: "審査中" },
    { value: "active", label: "有効" },
    { value: "paused", label: "一時停止" },
    { value: "revoked", label: "失効" },
];

const AtlasMembershipForm = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    isEdit = false,
    userEmail = null,
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
                        {isEdit ? (
                            <FormGroup label="ユーザー" htmlFor="user_email">
                                <TextInput
                                    id="user_email"
                                    value={userEmail || ""}
                                    disabled
                                />
                            </FormGroup>
                        ) : (
                            <FormGroup
                                label="ユーザーのメールアドレス"
                                htmlFor="email"
                                required
                                error={errors.email}
                                helpText="既に登録済みのユーザーのメールアドレスを指定してください"
                            >
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    disabled={processing}
                                    placeholder="client@example.com"
                                />
                            </FormGroup>
                        )}

                        <FormGroup
                            label="ブランド"
                            htmlFor="brand"
                            required
                            error={errors.brand}
                        >
                            <SelectInput
                                id="brand"
                                value={data.brand}
                                onChange={(e) =>
                                    setData("brand", e.target.value)
                                }
                                disabled={processing}
                                options={BRAND_OPTIONS}
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
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                disabled={processing}
                                options={STATUS_OPTIONS}
                            />
                        </FormGroup>

                        <FormGroup
                            label="管理者向けメモ"
                            htmlFor="note"
                            error={errors.note}
                        >
                            <TextArea
                                id="note"
                                value={data.note || ""}
                                onChange={(e) =>
                                    setData("note", e.target.value)
                                }
                                disabled={processing}
                                rows={4}
                                placeholder="紹介経路や審査メモなど"
                            />
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
                    キャンセル
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={processing}>
                    {isEdit ? "更新" : "追加"}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default AtlasMembershipForm;
