import React from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { FormGroup, TextInput, TextArea, SelectInput } from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";

const ReferralForm = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    companies = [],
    statuses = null,
    isEdit = false,
}) => {
    const companyOptions = [
        { value: "", label: "選択してください" },
        ...companies.map((company) => ({
            value: company.id,
            label: company.name,
        })),
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (typeof onSubmit === "function") {
            onSubmit();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>紹介情報</CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <FormGroup
                            label="紹介者（会社）"
                            htmlFor="referrer_company_id"
                            required
                            error={errors.referrer_company_id}
                            helpText="既存のお客様のうち、紹介元となる会社"
                        >
                            <SelectInput
                                id="referrer_company_id"
                                value={data.referrer_company_id || ""}
                                onChange={(e) =>
                                    setData(
                                        "referrer_company_id",
                                        e.target.value,
                                    )
                                }
                                disabled={processing}
                                options={companyOptions}
                            />
                        </FormGroup>

                        <FormGroup
                            label="被紹介者（会社）"
                            htmlFor="referred_company_id"
                            error={errors.referred_company_id}
                            helpText="ご成約前は未設定でも構いません。成立にする際に必須です"
                        >
                            <SelectInput
                                id="referred_company_id"
                                value={data.referred_company_id || ""}
                                onChange={(e) =>
                                    setData(
                                        "referred_company_id",
                                        e.target.value,
                                    )
                                }
                                disabled={processing}
                                options={companyOptions}
                            />
                        </FormGroup>

                        {statuses && (
                            <FormGroup
                                label="ステータス"
                                htmlFor="status"
                                error={errors.status}
                            >
                                <SelectInput
                                    id="status"
                                    value={data.status || "pending"}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    disabled={processing}
                                    options={Object.entries(statuses)
                                        .filter(
                                            ([value]) =>
                                                value !== "contracted",
                                        )
                                        .map(([value, label]) => ({
                                            value,
                                            label,
                                        }))}
                                />
                            </FormGroup>
                        )}

                        <FormGroup
                            label="メモ"
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

export default ReferralForm;
