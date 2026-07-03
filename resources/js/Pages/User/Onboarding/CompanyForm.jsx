import { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/Forms/TextInput";
import InputLabel from "@/Components/Forms/InputLabel";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import InputError from "@/Components/Forms/InputError";

export default function CompanyForm({ company }) {
    const { data, setData, post, processing, errors } = useForm({
        legal_name: company?.legal_name || "",
        registration_number: company?.registration_number || "",
        establishment_date: company?.establishment_date || "",
        capital: company?.capital || "",
        employee_count: company?.employee_count || "",
        industry: company?.industry || "",
        description: company?.description || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("user.onboarding.company.store"));
    };

    return (
        <AuthenticatedLayout header="会社情報">
            <Head title="会社情報 | Smart Sprouts" />

            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        会社の詳細情報を入力してください
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 法人名 */}
                        <div>
                            <InputLabel htmlFor="legal_name">
                                法人名 <span className="text-red-500">*</span>
                            </InputLabel>
                            <TextInput
                                id="legal_name"
                                type="text"
                                name="legal_name"
                                value={data.legal_name}
                                onChange={(e) =>
                                    setData("legal_name", e.target.value)
                                }
                                placeholder="○○株式会社"
                                className="mt-1 w-full"
                                required
                            />
                            {errors.legal_name && (
                                <InputError message={errors.legal_name} />
                            )}
                        </div>

                        {/* 法人番号 */}
                        <div>
                            <InputLabel htmlFor="registration_number">
                                法人番号
                            </InputLabel>
                            <TextInput
                                id="registration_number"
                                type="text"
                                name="registration_number"
                                value={data.registration_number}
                                onChange={(e) =>
                                    setData(
                                        "registration_number",
                                        e.target.value,
                                    )
                                }
                                placeholder="1234567890123"
                                className="mt-1 w-full"
                            />
                            {errors.registration_number && (
                                <InputError
                                    message={errors.registration_number}
                                />
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                国税庁の法人番号検索サイトで確認できます
                            </p>
                        </div>

                        {/* 設立日 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="establishment_date">
                                    設立日
                                </InputLabel>
                                <TextInput
                                    id="establishment_date"
                                    type="date"
                                    name="establishment_date"
                                    value={data.establishment_date}
                                    onChange={(e) =>
                                        setData(
                                            "establishment_date",
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 w-full"
                                />
                                {errors.establishment_date && (
                                    <InputError
                                        message={errors.establishment_date}
                                    />
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="capital">
                                    資本金
                                </InputLabel>
                                <TextInput
                                    id="capital"
                                    type="number"
                                    name="capital"
                                    value={data.capital}
                                    onChange={(e) =>
                                        setData("capital", e.target.value)
                                    }
                                    placeholder="1000000"
                                    className="mt-1 w-full"
                                />
                                {errors.capital && (
                                    <InputError message={errors.capital} />
                                )}
                                <p className="mt-1 text-sm text-gray-500">
                                    円（数字のみ）
                                </p>
                            </div>
                        </div>

                        {/* 従業員数と業種 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="employee_count">
                                    従業員数
                                </InputLabel>
                                <TextInput
                                    id="employee_count"
                                    type="number"
                                    name="employee_count"
                                    value={data.employee_count}
                                    onChange={(e) =>
                                        setData(
                                            "employee_count",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="50"
                                    className="mt-1 w-full"
                                />
                                {errors.employee_count && (
                                    <InputError
                                        message={errors.employee_count}
                                    />
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="industry">業種</InputLabel>
                                <TextInput
                                    id="industry"
                                    type="text"
                                    name="industry"
                                    value={data.industry}
                                    onChange={(e) =>
                                        setData("industry", e.target.value)
                                    }
                                    placeholder="IT・通信"
                                    className="mt-1 w-full"
                                />
                                {errors.industry && (
                                    <InputError message={errors.industry} />
                                )}
                            </div>
                        </div>

                        {/* 事業内容 */}
                        <div>
                            <InputLabel htmlFor="description">
                                事業内容
                            </InputLabel>
                            <textarea
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="事業内容を入力してください"
                                rows="4"
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.description && (
                                <InputError message={errors.description} />
                            )}
                        </div>

                        {/* ボタン */}
                        <div className="flex gap-4 pt-6">
                            <Link href={route("user.dashboard")}>
                                <SecondaryButton type="button">
                                    戻る
                                </SecondaryButton>
                            </Link>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="flex-1 justify-center"
                            >
                                {processing ? "保存中..." : "次に進む"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
