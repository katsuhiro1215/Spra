import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const AddressForm = ({
    address = null,
    onSave,
    onCancel,
    addressTypes = ["home", "office", "billing", "shipping", "branch", "other"],
}) => {
    const [formData, setFormData] = useState({
        type: "office",
        label: "",
        postal_code: "",
        prefecture: "",
        city: "",
        district: "",
        address_other: "",
        phone: "",
        contact_person: "",
        is_default: false,
        notes: "",
    });

    const [errors, setErrors] = useState({});

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

    const typeLabels = {
        home: "自宅",
        office: "オフィス",
        billing: "請求先",
        shipping: "配送先",
        branch: "支店",
        other: "その他",
    };

    useEffect(() => {
        if (address) {
            setFormData({
                type: address.type || "office",
                label: address.label || "",
                postal_code: address.postal_code || "",
                prefecture: address.prefecture || "",
                city: address.city || "",
                district: address.district || "",
                address_other: address.address_other || "",
                phone: address.phone || "",
                contact_person: address.contact_person || "",
                is_default: address.is_default || false,
                notes: address.notes || "",
            });
        }
    }, [address]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.postal_code.trim()) {
            newErrors.postal_code = "郵便番号は必須です";
        } else if (!/^\d{3}-?\d{4}$/.test(formData.postal_code)) {
            newErrors.postal_code =
                "郵便番号の形式が正しくありません（例：123-4567）";
        }

        if (!formData.prefecture.trim()) {
            newErrors.prefecture = "都道府県は必須です";
        }

        if (!formData.city.trim()) {
            newErrors.city = "市区町村は必須です";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSave(formData);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                    {address ? "住所を編集" : "新しい住所を追加"}
                </h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 住所タイプ */}
                    <div>
                        <label
                            htmlFor="type"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            住所タイプ *
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            {addressTypes.map((type) => (
                                <option key={type} value={type}>
                                    {typeLabels[type] || type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ラベル */}
                    <div>
                        <label
                            htmlFor="label"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            ラベル
                        </label>
                        <input
                            type="text"
                            id="label"
                            name="label"
                            value={formData.label}
                            onChange={handleChange}
                            placeholder="例：本社、支店A"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* 郵便番号 */}
                <div>
                    <label
                        htmlFor="postal_code"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        郵便番号 *
                    </label>
                    <input
                        type="text"
                        id="postal_code"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        placeholder="123-4567"
                        className={`w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                            errors.postal_code
                                ? "border-red-300"
                                : "border-gray-300"
                        }`}
                    />
                    {errors.postal_code && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.postal_code}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 都道府県 */}
                    <div>
                        <label
                            htmlFor="prefecture"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            都道府県 *
                        </label>
                        <select
                            id="prefecture"
                            name="prefecture"
                            value={formData.prefecture}
                            onChange={handleChange}
                            className={`w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                errors.prefecture
                                    ? "border-red-300"
                                    : "border-gray-300"
                            }`}
                        >
                            <option value="">都道府県を選択</option>
                            {prefectures.map((pref) => (
                                <option key={pref} value={pref}>
                                    {pref}
                                </option>
                            ))}
                        </select>
                        {errors.prefecture && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.prefecture}
                            </p>
                        )}
                    </div>

                    {/* 市区町村 */}
                    <div>
                        <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            市区町村 *
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="例：渋谷区"
                            className={`w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                errors.city
                                    ? "border-red-300"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.city && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.city}
                            </p>
                        )}
                    </div>
                </div>

                {/* 地域名 */}
                <div>
                    <label
                        htmlFor="district"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        地域名（町・字等）
                    </label>
                    <input
                        type="text"
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="例：神南"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* その他住所 */}
                <div>
                    <label
                        htmlFor="address_other"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        その他住所（番地・建物名・部屋番号等）
                    </label>
                    <input
                        type="text"
                        id="address_other"
                        name="address_other"
                        value={formData.address_other}
                        onChange={handleChange}
                        placeholder="例：1-1-1 サンプルビル 5F"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 電話番号 */}
                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            電話番号
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="03-1234-5678"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    {/* 連絡担当者 */}
                    <div>
                        <label
                            htmlFor="contact_person"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            連絡担当者
                        </label>
                        <input
                            type="text"
                            id="contact_person"
                            name="contact_person"
                            value={formData.contact_person}
                            onChange={handleChange}
                            placeholder="例：田中太郎"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* デフォルト住所 */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="is_default"
                        name="is_default"
                        checked={formData.is_default}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                        htmlFor="is_default"
                        className="ml-2 block text-sm text-gray-700"
                    >
                        デフォルト住所として設定
                    </label>
                </div>

                {/* メモ */}
                <div>
                    <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        メモ
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="住所に関するメモがあれば記入してください"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* ボタン */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        キャンセル
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {address ? "更新" : "追加"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddressForm;
