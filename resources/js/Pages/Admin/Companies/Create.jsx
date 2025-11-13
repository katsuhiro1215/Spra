import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
// Layouts
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import Pagination from "@/Components/Layout/Pagination";
import Card from "@/Components/Card";
import BasicButton from "@/Components/Buttons/BasicButton";
import DeleteAlert from "@/Components/Alerts/DeleteAlert";
import FlashMessage from "@/Components/Notifications/FlashMessage";
import AddressManager from "@/Components/AddressManager/AddressManager";
// Icons
import {
    ArrowLeftIcon,
    BuildingOfficeIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

const Create = () => {
    const [addresses, setAddresses] = useState([]);
    const [showAddresses, setShowAddresses] = useState(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: "",
        company_type: "corporate",
        legal_name: "",
        registration_number: "",
        tax_number: "",
        postal_code: "",
        prefecture: "",
        city: "",
        district: "",
        address_other: "",
        phone: "",
        fax: "",
        email: "",
        website: "",
        representative_name: "",
        representative_title: "",
        representative_email: "",
        representative_phone: "",
        business_description: "",
        industry: "",
        employee_count: "",
        capital: "",
        established_date: "",
        status: "active",
        notes: "",
        addresses: [],
    });

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

    const industries = [
        "製造業",
        "IT・ソフトウェア",
        "建設・不動産",
        "小売・卸売",
        "金融・保険",
        "運輸・物流",
        "医療・介護",
        "教育",
        "飲食・宿泊",
        "コンサルティング",
        "マーケティング・広告",
        "エネルギー",
        "農業・林業・漁業",
        "公務",
        "その他",
    ];

    const companyTypeLabels = {
        individual: "個人事業主",
        corporate: "法人",
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);

        // Clear specific field error
        if (errors[name]) {
            clearErrors(name);
        }
    };

    const handleAddressAdd = (addressData) => {
        return new Promise((resolve) => {
            const newAddress = {
                ...addressData,
                id: Date.now(), // 一時的なID
                temp: true, // 一時的なフラグ
            };
            setAddresses((prev) => [...prev, newAddress]);
            resolve();
        });
    };

    const handleAddressUpdate = (addressId, addressData) => {
        return new Promise((resolve) => {
            setAddresses((prev) =>
                prev.map((addr) =>
                    addr.id === addressId ? { ...addr, ...addressData } : addr
                )
            );
            resolve();
        });
    };

    const handleAddressDelete = (addressId) => {
        return new Promise((resolve) => {
            setAddresses((prev) =>
                prev.filter((addr) => addr.id !== addressId)
            );
            resolve();
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 住所データを含めて送信
        const formData = {
            ...data,
            addresses: addresses.map((addr) => {
                const { id, temp, ...addressData } = addr;
                return addressData;
            }),
        };

        post(route("admin.companies.store"), {
            data: formData,
            onSuccess: () => {
                // 成功時の処理は自動的にリダイレクトされる
            },
        });
    };

    const isIndividual = data.company_type === "individual";

    const headerActions = [
        {
            label: PageConfig.companies.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.companies.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout>
            <Head title="企業登録" />
            {/* フラッシュメッセージ */}
            <FlashMessage />
            {/* ヘッダー */}
            <PageHeader
                title={PageConfig.companies.title}
                description={PageConfig.companies.description}
                actions={headerActions}
            />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* 基本情報 */}
                            <Card>
                                <div className="flex items-center gap-2 mb-6">
                                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                                    <h2 className="text-lg font-medium text-gray-900">
                                        基本情報
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* 企業タイプ */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            企業タイプ *
                                        </label>
                                        <div className="flex gap-4">
                                            {Object.entries(
                                                companyTypeLabels
                                            ).map(([value, label]) => (
                                                <label
                                                    key={value}
                                                    className="flex items-center"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="company_type"
                                                        value={value}
                                                        checked={
                                                            data.company_type ===
                                                            value
                                                        }
                                                        onChange={handleChange}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">
                                                        {label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.company_type && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.company_type}
                                            </p>
                                        )}
                                    </div>

                                    {/* 企業名 */}
                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            {isIndividual
                                                ? "事業者名"
                                                : "企業名"}{" "}
                                            *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            onChange={handleChange}
                                            className={`w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                                errors.name
                                                    ? "border-red-300"
                                                    : "border-gray-300"
                                            }`}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* 法人の場合のみ表示される項目 */}
                                    {!isIndividual && (
                                        <>
                                            <div>
                                                <label
                                                    htmlFor="legal_name"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    法人正式名称
                                                </label>
                                                <input
                                                    type="text"
                                                    id="legal_name"
                                                    name="legal_name"
                                                    value={data.legal_name}
                                                    onChange={handleChange}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="registration_number"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    法人番号
                                                </label>
                                                <input
                                                    type="text"
                                                    id="registration_number"
                                                    name="registration_number"
                                                    value={
                                                        data.registration_number
                                                    }
                                                    onChange={handleChange}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="tax_number"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    税務番号
                                                </label>
                                                <input
                                                    type="text"
                                                    id="tax_number"
                                                    name="tax_number"
                                                    value={data.tax_number}
                                                    onChange={handleChange}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* 業界 */}
                                    <div>
                                        <label
                                            htmlFor="industry"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            業界
                                        </label>
                                        <select
                                            id="industry"
                                            name="industry"
                                            value={data.industry}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">業界を選択</option>
                                            {industries.map((industry) => (
                                                <option
                                                    key={industry}
                                                    value={industry}
                                                >
                                                    {industry}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* ステータス */}
                                    <div>
                                        <label
                                            htmlFor="status"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            ステータス
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="active">
                                                アクティブ
                                            </option>
                                            <option value="inactive">
                                                非アクティブ
                                            </option>
                                            <option value="suspended">
                                                停止中
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </Card>
                            {/* 住所情報 */}
                            <Card>
                                <h2 className="text-lg font-medium text-gray-900 mb-6">
                                    本社住所
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* 郵便番号 */}
                                    <div>
                                        <label
                                            htmlFor="postal_code"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            郵便番号
                                        </label>
                                        <input
                                            type="text"
                                            id="postal_code"
                                            name="postal_code"
                                            value={data.postal_code}
                                            onChange={handleChange}
                                            placeholder="123-4567"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div></div> {/* 空のセル */}
                                    {/* 都道府県 */}
                                    <div>
                                        <label
                                            htmlFor="prefecture"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            都道府県
                                        </label>
                                        <select
                                            id="prefecture"
                                            name="prefecture"
                                            value={data.prefecture}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">
                                                都道府県を選択
                                            </option>
                                            {prefectures.map((pref) => (
                                                <option key={pref} value={pref}>
                                                    {pref}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* 市区町村 */}
                                    <div>
                                        <label
                                            htmlFor="city"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            市区町村
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={data.city}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
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
                                            value={data.district}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    {/* その他住所 */}
                                    <div>
                                        <label
                                            htmlFor="address_other"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            その他住所
                                        </label>
                                        <input
                                            type="text"
                                            id="address_other"
                                            name="address_other"
                                            value={data.address_other}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </Card>
                            {/* 連絡先情報 */}
                            <Card>
                                <h2 className="text-lg font-medium text-gray-900 mb-6">
                                    連絡先情報
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            value={data.phone}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="fax"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            FAX番号
                                        </label>
                                        <input
                                            type="text"
                                            id="fax"
                                            name="fax"
                                            value={data.fax}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            メールアドレス
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={data.email}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="website"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            ウェブサイト
                                        </label>
                                        <input
                                            type="url"
                                            id="website"
                                            name="website"
                                            value={data.website}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </Card>
                            {/* 代表者情報 */}
                            <Card>
                                <div className="flex items-center gap-2 mb-6">
                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                    <h2 className="text-lg font-medium text-gray-900">
                                        代表者情報
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="representative_name"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            代表者名
                                        </label>
                                        <input
                                            type="text"
                                            id="representative_name"
                                            name="representative_name"
                                            value={data.representative_name}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    {!isIndividual && (
                                        <div>
                                            <label
                                                htmlFor="representative_title"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                役職
                                            </label>
                                            <input
                                                type="text"
                                                id="representative_title"
                                                name="representative_title"
                                                value={
                                                    data.representative_title
                                                }
                                                onChange={handleChange}
                                                placeholder="例：代表取締役"
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label
                                            htmlFor="representative_email"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            代表者メール
                                        </label>
                                        <input
                                            type="email"
                                            id="representative_email"
                                            name="representative_email"
                                            value={data.representative_email}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="representative_phone"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            代表者電話
                                        </label>
                                        <input
                                            type="text"
                                            id="representative_phone"
                                            name="representative_phone"
                                            value={data.representative_phone}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </Card>
                            {/* ビジネス情報 */}
                            {!isIndividual && (
                                <Card>
                                    <h2 className="text-lg font-medium text-gray-900 mb-6">
                                        ビジネス情報
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label
                                                htmlFor="employee_count"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                従業員数
                                            </label>
                                            <input
                                                type="number"
                                                id="employee_count"
                                                name="employee_count"
                                                value={data.employee_count}
                                                onChange={handleChange}
                                                min="1"
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="capital"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                資本金（円）
                                            </label>
                                            <input
                                                type="number"
                                                id="capital"
                                                name="capital"
                                                value={data.capital}
                                                onChange={handleChange}
                                                min="0"
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label
                                                htmlFor="established_date"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                設立日
                                            </label>
                                            <input
                                                type="date"
                                                id="established_date"
                                                name="established_date"
                                                value={data.established_date}
                                                onChange={handleChange}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label
                                                htmlFor="business_description"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                事業内容
                                            </label>
                                            <textarea
                                                id="business_description"
                                                name="business_description"
                                                value={
                                                    data.business_description
                                                }
                                                onChange={handleChange}
                                                rows={4}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </Card>
                            )}
                            {/* 追加住所管理 */}
                            <Card>
                                <AddressManager
                                    addresses={addresses}
                                    onAddressAdd={handleAddressAdd}
                                    onAddressUpdate={handleAddressUpdate}
                                    onAddressDelete={handleAddressDelete}
                                    addressTypes={[
                                        "office",
                                        "branch",
                                        "billing",
                                        "shipping",
                                        "other",
                                    ]}
                                    title="追加住所（支店・営業所等）"
                                />
                            </Card>
                            {/* メモ */}
                            <Card>
                                <h2 className="text-lg font-medium text-gray-900 mb-6">
                                    メモ
                                </h2>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={data.notes}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="管理者向けのメモがあれば記入してください"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </Card>
                        </div>
                        <div className="space-y-6">
                            {/* 送信ボタン */}
                            <Card>
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? "登録中..." : "企業を登録"}
                                </button>
                            </Card>
                        </div>
                    </div>
                </form>
            </main>
        </AdminAuthenticatedLayout>
    );
};

export default Create;
