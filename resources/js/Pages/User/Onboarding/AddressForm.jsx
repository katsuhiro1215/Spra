import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/Forms/TextInput";
import InputLabel from "@/Components/Forms/InputLabel";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import InputError from "@/Components/Forms/InputError";

export default function AddressForm({ address }) {
    const prefectures = [
        "北海道",
        "青森県",
        "岩手県",
        "宮城県",
        "秋田県",
        "山形県",
        "福島県",
        "茨城県",
        "栃木県",
        "群馬県",
        "埼玉県",
        "千葉県",
        "東京都",
        "神奈川県",
        "新潟県",
        "富山県",
        "石川県",
        "福井県",
        "山梨県",
        "長野県",
        "岐阜県",
        "静岡県",
        "愛知県",
        "三重県",
        "滋賀県",
        "京都府",
        "大阪府",
        "兵庫県",
        "奈良県",
        "和歌山県",
        "鳥取県",
        "島根県",
        "岡山県",
        "広島県",
        "山口県",
        "徳島県",
        "香川県",
        "愛媛県",
        "高知県",
        "福岡県",
        "佐賀県",
        "長崎県",
        "熊本県",
        "大分県",
        "宮崎県",
        "鹿児島県",
        "沖縄県",
    ];

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
        post(route("user.onboarding.address.store"));
    };

    return (
        <AuthenticatedLayout header="会社住所">
            <Head title="会社住所 | Smart Sprouts" />

            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        会社の住所を入力してください
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
                                {prefectures.map((pref) => (
                                    <option key={pref} value={pref}>
                                        {pref}
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
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="w-full justify-center"
                            >
                                {processing ? "保存中..." : "登録完了"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
