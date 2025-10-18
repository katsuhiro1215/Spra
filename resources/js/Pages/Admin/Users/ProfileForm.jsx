import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ArrowLeftIcon,
    UserIcon,
    PhotoIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    CogIcon,
    IdentificationIcon,
    StarIcon,
} from "@heroicons/react/24/outline";

const ProfileForm = ({
    user,
    profile,
    formAction,
    genders,
    languages,
    timezones,
}) => {
    const isEditing = !!profile;

    const { data, setData, post, put, processing, errors, clearErrors } =
        useForm({
            display_name: profile?.display_name || "",
            first_name: profile?.first_name || "",
            last_name: profile?.last_name || "",
            first_name_kana: profile?.first_name_kana || "",
            last_name_kana: profile?.last_name_kana || "",
            birth_date: profile?.birth_date
                ? profile.birth_date.split(" ")[0]
                : "",
            gender: profile?.gender || "",
            phone_number: profile?.phone_number || "",
            mobile_number: profile?.mobile_number || "",
            emergency_contact_name: profile?.emergency_contact_name || "",
            emergency_contact_phone: profile?.emergency_contact_phone || "",
            emergency_contact_relationship:
                profile?.emergency_contact_relationship || "",
            bio: profile?.bio || "",
            avatar: null,
            website: profile?.website || "",
            social_links: profile?.social_links || {},
            occupation: profile?.occupation || "",
            job_title: profile?.job_title || "",
            education: profile?.education || "",
            skills: profile?.skills || "",
            preferred_language: profile?.preferred_language || "ja",
            timezone: profile?.timezone || "Asia/Tokyo",
            notification_preferences: profile?.notification_preferences || {},
            privacy_settings: profile?.privacy_settings || {},
            postal_code: profile?.postal_code || "",
            prefecture: profile?.prefecture || "",
            city: profile?.city || "",
            district: profile?.district || "",
            address_other: profile?.address_other || "",
            is_public: profile?.is_public || false,
            is_verified: profile?.is_verified || false,
            notes: profile?.notes || "",
        });

    const [previewAvatar, setPreviewAvatar] = useState(null);

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

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "file") {
            const file = files[0];
            setData(name, file);

            // プレビュー用のURL作成
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => setPreviewAvatar(e.target.result);
                reader.readAsDataURL(file);
            }
        } else if (type === "checkbox") {
            setData(name, checked);
        } else {
            setData(name, value);
        }

        // エラークリア
        if (errors[name]) {
            clearErrors(name);
        }
    };

    const handleSocialLinksChange = (platform, value) => {
        setData("social_links", {
            ...data.social_links,
            [platform]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(formAction);
        } else {
            post(formAction);
        }
    };

    const currentAvatar =
        previewAvatar ||
        (profile?.avatar ? `/storage/${profile.avatar}` : null);

    return (
        <AdminLayout>
            <Head
                title={`${user.name} - ${
                    isEditing ? "プロフィール編集" : "プロフィール作成"
                }`}
            />

            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {user.name} -{" "}
                            {isEditing
                                ? "プロフィール編集"
                                : "プロフィール作成"}
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {isEditing
                                ? "ユーザープロフィール情報を編集します"
                                : "ユーザープロフィール情報を作成します"}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* 基本情報 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-medium text-gray-900">
                                基本情報
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 表示名 */}
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="display_name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    表示名
                                </label>
                                <input
                                    type="text"
                                    id="display_name"
                                    name="display_name"
                                    value={data.display_name}
                                    onChange={handleChange}
                                    className={`w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                        errors.display_name
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="公開時に使用される名前"
                                />
                                {errors.display_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.display_name}
                                    </p>
                                )}
                            </div>

                            {/* 姓 */}
                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    姓
                                </label>
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={data.last_name}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {/* 名 */}
                            <div>
                                <label
                                    htmlFor="first_name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    名
                                </label>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={data.first_name}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {/* 姓（カナ） */}
                            <div>
                                <label
                                    htmlFor="last_name_kana"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    姓（カナ）
                                </label>
                                <input
                                    type="text"
                                    id="last_name_kana"
                                    name="last_name_kana"
                                    value={data.last_name_kana}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="タナカ"
                                />
                            </div>

                            {/* 名（カナ） */}
                            <div>
                                <label
                                    htmlFor="first_name_kana"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    名（カナ）
                                </label>
                                <input
                                    type="text"
                                    id="first_name_kana"
                                    name="first_name_kana"
                                    value={data.first_name_kana}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="タロウ"
                                />
                            </div>

                            {/* 生年月日 */}
                            <div>
                                <label
                                    htmlFor="birth_date"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    生年月日
                                </label>
                                <input
                                    type="date"
                                    id="birth_date"
                                    name="birth_date"
                                    value={data.birth_date}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {/* 性別 */}
                            <div>
                                <label
                                    htmlFor="gender"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    性別
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={data.gender}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">選択してください</option>
                                    {Object.entries(genders).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* アバター */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <PhotoIcon className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-medium text-gray-900">
                                プロフィール画像
                            </h2>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* 現在の画像 */}
                            <div className="flex-shrink-0">
                                {currentAvatar ? (
                                    <img
                                        src={currentAvatar}
                                        alt="アバター"
                                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                                        <UserIcon className="h-10 w-10 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* ファイル選択 */}
                            <div className="flex-1">
                                <label
                                    htmlFor="avatar"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    画像を選択
                                </label>
                                <input
                                    type="file"
                                    id="avatar"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    JPG, PNG, GIF形式。最大2MB。
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 連絡先情報 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-medium text-gray-900">
                                連絡先情報
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="phone_number"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    電話番号
                                </label>
                                <input
                                    type="tel"
                                    id="phone_number"
                                    name="phone_number"
                                    value={data.phone_number}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="mobile_number"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    携帯番号
                                </label>
                                <input
                                    type="tel"
                                    id="mobile_number"
                                    name="mobile_number"
                                    value={data.mobile_number}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="emergency_contact_name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    緊急連絡先名
                                </label>
                                <input
                                    type="text"
                                    id="emergency_contact_name"
                                    name="emergency_contact_name"
                                    value={data.emergency_contact_name}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="emergency_contact_phone"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    緊急連絡先電話
                                </label>
                                <input
                                    type="tel"
                                    id="emergency_contact_phone"
                                    name="emergency_contact_phone"
                                    value={data.emergency_contact_phone}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label
                                    htmlFor="emergency_contact_relationship"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    緊急連絡先続柄
                                </label>
                                <input
                                    type="text"
                                    id="emergency_contact_relationship"
                                    name="emergency_contact_relationship"
                                    value={data.emergency_contact_relationship}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="例：父、母、配偶者、兄弟姉妹"
                                />
                            </div>
                        </div>
                    </div>

                    {/* プロフィール情報 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <IdentificationIcon className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-medium text-gray-900">
                                プロフィール情報
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {/* 自己紹介 */}
                            <div>
                                <label
                                    htmlFor="bio"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    自己紹介
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={data.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="簡単な自己紹介を入力してください"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="occupation"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        職業
                                    </label>
                                    <input
                                        type="text"
                                        id="occupation"
                                        name="occupation"
                                        value={data.occupation}
                                        onChange={handleChange}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="job_title"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        役職
                                    </label>
                                    <input
                                        type="text"
                                        id="job_title"
                                        name="job_title"
                                        value={data.job_title}
                                        onChange={handleChange}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="education"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        最終学歴
                                    </label>
                                    <input
                                        type="text"
                                        id="education"
                                        name="education"
                                        value={data.education}
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
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>

                            {/* スキル */}
                            <div>
                                <label
                                    htmlFor="skills"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    スキル（カンマ区切り）
                                </label>
                                <input
                                    type="text"
                                    id="skills"
                                    name="skills"
                                    value={data.skills}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="例：JavaScript, React, Laravel, デザイン"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 住所情報 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <MapPinIcon className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-medium text-gray-900">
                                住所情報
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="123-4567"
                                />
                            </div>

                            <div></div>

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
                                    <option value="">都道府県を選択</option>
                                    {prefectures.map((pref) => (
                                        <option key={pref} value={pref}>
                                            {pref}
                                        </option>
                                    ))}
                                </select>
                            </div>

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

                            <div>
                                <label
                                    htmlFor="district"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    地域名
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
                    </div>

                    {/* システム設定 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <CogIcon className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-medium text-gray-900">
                                システム設定
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="preferred_language"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    優先言語 *
                                </label>
                                <select
                                    id="preferred_language"
                                    name="preferred_language"
                                    value={data.preferred_language}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    {Object.entries(languages).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="timezone"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    タイムゾーン *
                                </label>
                                <select
                                    id="timezone"
                                    name="timezone"
                                    value={data.timezone}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    {Object.entries(timezones).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="md:col-span-2 space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_public"
                                        name="is_public"
                                        checked={data.is_public}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="is_public"
                                        className="ml-2 block text-sm text-gray-700"
                                    >
                                        プロフィールを公開する
                                    </label>
                                </div>

                                {isEditing && (
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_verified"
                                            name="is_verified"
                                            checked={data.is_verified}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label
                                            htmlFor="is_verified"
                                            className="ml-2 flex items-center gap-1 text-sm text-gray-700"
                                        >
                                            <StarIcon className="h-4 w-4 text-yellow-500" />
                                            認証済みユーザーとしてマーク
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 管理者メモ */}
                    {isEditing && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">
                                管理者メモ
                            </h2>
                            <textarea
                                id="notes"
                                name="notes"
                                value={data.notes}
                                onChange={handleChange}
                                rows={4}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="管理者向けのメモがあれば記入してください"
                            />
                        </div>
                    )}

                    {/* ボタン */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
                            {processing
                                ? "保存中..."
                                : isEditing
                                ? "プロフィールを更新"
                                : "プロフィールを作成"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default ProfileForm;
