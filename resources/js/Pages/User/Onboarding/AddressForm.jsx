import { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
// Components
import { TextInput, InputLabel, InputError } from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
// Constants
import { PREFECTURE_OPTIONS } from "@/Constants/SelectOptions";

export default function AddressForm({
    address,
    submitRoute = route("user.onboarding.address.store"),
    cancelRoute = route("user.dashboard"),
    submitLabel = "登録完了",
    heading = "会社住所",
    description = "会社の住所を入力してください",
}) {
    const { data, setData, post, processing, errors } = useForm({
        postal_code: address?.postal_code || "",
        prefecture: address?.prefecture || "",
        city: address?.city || "",
        district: address?.district || "",
        address_other: address?.address_other || "",
        phone: address?.phone || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(submitRoute);
    };

    return (
        <AuthenticatedLayout header={heading}>
            <Head title={`${heading} | Smart Sprouts`} />

            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {description}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 郵便番号 */}
                        <div>
                            <InputLabel htmlFor="postal_code">
                                郵俽番号 <span className="text-red-500">*</span>
                            </InputLabel>
                            <TextInput
                                id="postal_code"
                                type="text"
                                name="postal_code"
                                value={data.postal_code}
                                onChange={(e) =>
                                    setData("postal_code", e.target.value)
                                }
                                placeholder="100-0001"
                                pattern="\d{3}-\d{4}"
                                className="mt-1 w-full"
                                required
                            />
                            {errors.postal_code && (
                                <InputError message={errors.postal_code} />
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                形式: XXX-XXXX
                            </p>
                        </div>

                        {/* 都道府県 */}
                        <div>
                            <InputLabel htmlFor="prefecture">
                                都道府県 <span className="text-red-500">*</span>
                            </InputLabel>
                            <select
                                id="prefecture"
                                name="prefecture"
                                value={data.prefecture}
                                onChange={(e) =>
                                    setData("prefecture", e.target.value)
                                }
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            >
                                <option value="">選択してください</option>
                                {PREFECTURE_OPTIONS.map((pref) => (
                                    <option key={pref.value} value={pref.value}>
                                        {pref.label}
                                    </option>
                                ))}
                            </select>
                            {errors.prefecture && (
                                <InputError message={errors.prefecture} />
                            )}
                        </div>

                        {/* 市区町村と地区 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="city">
                                    市区町村{" "}
                                    <span className="text-red-500">*</span>
                                </InputLabel>
                                <TextInput
                                    id="city"
                                    type="text"
                                    name="city"
                                    value={data.city}
                                    onChange={(e) =>
                                        setData("city", e.target.value)
                                    }
                                    placeholder="千代田区"
                                    className="mt-1 w-full"
                                    required
                                />
                                {errors.city && (
                                    <InputError message={errors.city} />
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="district">地区</InputLabel>
                                <TextInput
                                    id="district"
                                    type="text"
                                    name="district"
                                    value={data.district}
                                    onChange={(e) =>
                                        setData("district", e.target.value)
                                    }
                                    placeholder="丸の内"
                                    className="mt-1 w-full"
                                />
                                {errors.district && (
                                    <InputError message={errors.district} />
                                )}
                            </div>
                        </div>

                        {/* 番地・建物名 */}
                        <div>
                            <InputLabel htmlFor="address_other">
                                番地・建物名{" "}
                                <span className="text-red-500">*</span>
                            </InputLabel>
                            <TextInput
                                id="address_other"
                                type="text"
                                name="address_other"
                                value={data.address_other}
                                onChange={(e) =>
                                    setData("address_other", e.target.value)
                                }
                                placeholder="1-1-1 XXXビル 5階"
                                className="mt-1 w-full"
                                required
                            />
                            {errors.address_other && (
                                <InputError message={errors.address_other} />
                            )}
                        </div>

                        {/* 電話番号 */}
                        <div>
                            <InputLabel htmlFor="phone">電話番号</InputLabel>
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

                        {/* ボタン */}
                        <div className="flex gap-4 pt-6">
                            <Link href={cancelRoute}>
                                <SecondaryButton type="button">
                                    戻る
                                </SecondaryButton>
                            </Link>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="flex-1 justify-center"
                            >
                                {processing ? "保存中..." : submitLabel}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
