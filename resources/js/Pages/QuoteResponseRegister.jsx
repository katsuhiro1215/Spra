import React from "react";
import { Head, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import {
    InputError,
    InputLabel,
    TextInput,
    SelectInput,
} from "@/Components/Forms";
import { PrimaryButton } from "@/Components/Buttons";

export default function QuoteResponseRegister({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        password: "",
        password_confirmation: "",
        company_name: "",
        company_type: "individual",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted", { token, data, errors });
        post(route("user.quote.response.register.store", token));
    };

    return (
        <GuestLayout>
            <Head title="アカウント作成" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        アカウント作成
                    </h1>
                    <p className="mt-2 text-gray-600">
                        招待メールの手順に従ってアカウントを作成してください
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email (Read-only) */}
                    <div>
                        <InputLabel htmlFor="email" value="メールアドレス" />
                        <TextInput
                            id="email"
                            type="email"
                            value={email}
                            disabled
                            className="mt-1 w-full bg-gray-100"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <InputLabel htmlFor="password" value="パスワード *" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />
                        <p className="mt-1 text-sm text-gray-600">
                            最小8文字以上
                        </p>
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    {/* Password Confirmation */}
                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="パスワード確認 *"
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    {/* Company Information Section */}
                    <div className="border-t border-gray-200 pt-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            会社情報
                        </h2>

                        {/* Company Type */}
                        <div>
                            <InputLabel
                                htmlFor="company_type"
                                value="会社区分 *"
                            />
                            <SelectInput
                                id="company_type"
                                name="company_type"
                                value={data.company_type}
                                className="mt-1 w-full"
                                onChange={(e) =>
                                    setData("company_type", e.target.value)
                                }
                            >
                                <option value="individual">個人事業主</option>
                                <option value="corporate">法人</option>
                            </SelectInput>
                            <InputError
                                message={errors.company_type}
                                className="mt-2"
                            />
                        </div>

                        {/* Company Name */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="company_name"
                                value="会社名 *"
                            />
                            <TextInput
                                id="company_name"
                                type="text"
                                name="company_name"
                                value={data.company_name}
                                className="mt-1 w-full"
                                placeholder="例：○○株式会社"
                                onChange={(e) =>
                                    setData("company_name", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.company_name}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="border-t border-gray-200 pt-6">
                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className="w-full justify-center"
                        >
                            {processing
                                ? "アカウント作成中..."
                                : "アカウントを作成"}
                        </PrimaryButton>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900 leading-relaxed">
                            <strong>登録後の手続きについて</strong>
                            <br />
                            アカウント作成後、管理者による確認が入ります。
                            <br />
                            その後、以下の情報をダッシュボードから追加いただきます：
                        </p>
                        <ul className="mt-3 ml-4 text-sm text-blue-900 list-disc space-y-1">
                            <li>ユーザープロフィール（氏名等）</li>
                            <li>会社の詳細情報</li>
                            <li>会社住所</li>
                        </ul>
                        <p className="mt-3 text-sm text-blue-900">
                            すべての情報が揃い次第、契約書をお送りいたします。
                        </p>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
