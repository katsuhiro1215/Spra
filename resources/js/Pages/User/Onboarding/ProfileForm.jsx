import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/Forms/TextInput";
import InputLabel from "@/Components/Forms/InputLabel";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import InputError from "@/Components/Forms/InputError";

export default function ProfileForm({ profile }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        first_name_kana: profile?.first_name_kana || "",
        last_name_kana: profile?.last_name_kana || "",
        phone: profile?.phone || "",
        mobile: profile?.mobile || "",
        birth_date: profile?.birth_date || "",
        gender: profile?.gender || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("user.onboarding.profile.store"));
    };

    return (
        <AuthenticatedLayout header="プロフィール情報">
            <Head title="プロフィール情報 | Smart Sprouts" />

            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        プロフィール情報を入力してください
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 名前 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="last_name">
                                    姓 <span className="text-red-500">*</span>
                                </InputLabel>
                                <TextInput
                                    id="last_name"
                                    type="text"
                                    name="last_name"
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData("last_name", e.target.value)
                                    }
                                    placeholder="山田"
                                    className="mt-1 w-full"
                                    required
                                />
                                {errors.last_name && (
                                    <InputError message={errors.last_name} />
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="first_name">
                                    名 <span className="text-red-500">*</span>
                                </InputLabel>
                                <TextInput
                                    id="first_name"
                                    type="text"
                                    name="first_name"
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData("first_name", e.target.value)
                                    }
                                    placeholder="太郎"
                                    className="mt-1 w-full"
                                    required
                                />
                                {errors.first_name && (
                                    <InputError message={errors.first_name} />
                                )}
                            </div>
                        </div>

                        {/* 名前（カナ） */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="last_name_kana">
                                    姓（カナ）{" "}
                                    <span className="text-red-500">*</span>
                                </InputLabel>
                                <TextInput
                                    id="last_name_kana"
                                    type="text"
                                    name="last_name_kana"
                                    value={data.last_name_kana}
                                    onChange={(e) =>
                                        setData(
                                            "last_name_kana",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="ヤマダ"
                                    className="mt-1 w-full"
                                    required
                                />
                                {errors.last_name_kana && (
                                    <InputError
                                        message={errors.last_name_kana}
                                    />
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="first_name_kana">
                                    名（カナ）{" "}
                                    <span className="text-red-500">*</span>
                                </InputLabel>
                                <TextInput
                                    id="first_name_kana"
                                    type="text"
                                    name="first_name_kana"
                                    value={data.first_name_kana}
                                    onChange={(e) =>
                                        setData(
                                            "first_name_kana",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="タロウ"
                                    className="mt-1 w-full"
                                    required
                                />
                                {errors.first_name_kana && (
                                    <InputError
                                        message={errors.first_name_kana}
                                    />
                                )}
                            </div>
                        </div>

                        {/* 電話番号 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="phone">
                                    固定電話
                                </InputLabel>
                                <TextInput
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    placeholder="03-XXXX-XXXX"
                                    className="mt-1 w-full"
                                />
                                {errors.phone && (
                                    <InputError message={errors.phone} />
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="mobile">
                                    携帯電話{" "}
                                    <span className="text-red-500">*</span>
                                </InputLabel>
                                <TextInput
                                    id="mobile"
                                    type="tel"
                                    name="mobile"
                                    value={data.mobile}
                                    onChange={(e) =>
                                        setData("mobile", e.target.value)
                                    }
                                    placeholder="090-XXXX-XXXX"
                                    className="mt-1 w-full"
                                    required
                                />
                                {errors.mobile && (
                                    <InputError message={errors.mobile} />
                                )}
                            </div>
                        </div>

                        {/* 生年月日と性別 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="birth_date">
                                    生年月日
                                </InputLabel>
                                <TextInput
                                    id="birth_date"
                                    type="date"
                                    name="birth_date"
                                    value={data.birth_date}
                                    onChange={(e) =>
                                        setData("birth_date", e.target.value)
                                    }
                                    className="mt-1 w-full"
                                />
                                {errors.birth_date && (
                                    <InputError message={errors.birth_date} />
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="gender">性別</InputLabel>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={data.gender}
                                    onChange={(e) =>
                                        setData("gender", e.target.value)
                                    }
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">選択してください</option>
                                    <option value="male">男性</option>
                                    <option value="female">女性</option>
                                    <option value="other">その他</option>
                                </select>
                                {errors.gender && (
                                    <InputError message={errors.gender} />
                                )}
                            </div>
                        </div>

                        {/* ボタン */}
                        <div className="flex gap-4 pt-6">
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="w-full justify-center"
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
