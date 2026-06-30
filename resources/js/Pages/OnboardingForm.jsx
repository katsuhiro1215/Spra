import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function OnboardingForm({ token, quoteResponse }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: "",
        last_name: "",
        email: quoteResponse.email || "",
        password: "",
        password_confirmation: "",
        company_name: "",
        company_type: "corporate",
        company_phone: "",
        legal_name: "",
        representative_name: "",
        representative_email: "",
        representative_phone: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("public.onboarding.store", { token }));
    };

    return (
        <>
            <Head title="ユーザーアカウント・会社情報登録" />
            <PublicLayout>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                            {/* ヘッダー */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    ユーザーアカウント・会社情報登録
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    見積へのご回答ありがとうございました。以下のフォームに情報をご入力ください。
                                </p>
                            </div>

                            {/* 見積情報サマリー */}
                            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    見積情報
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                                    <span className="font-medium">件名:</span>{" "}
                                    {quoteResponse.quote.title}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">金額:</span> ¥
                                    {quoteResponse.quote.total_amount.toLocaleString()}
                                </p>
                            </div>

                            {/* フォーム */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* ユーザー情報セクション */}
                                <div className="border-b pb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        ユーザーアカウント情報
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* 名 */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                名{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={data.first_name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="太郎"
                                            />
                                            {errors.first_name && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {errors.first_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* 姓 */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                姓{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={data.last_name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="山田"
                                            />
                                            {errors.last_name && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {errors.last_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* メールアドレス */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            メールアドレス{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.email && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* パスワード */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                パスワード{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="8文字以上"
                                            />
                                            {errors.password && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                パスワード確認{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="password"
                                                name="password_confirmation"
                                                value={
                                                    data.password_confirmation
                                                }
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors.password_confirmation && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {
                                                        errors.password_confirmation
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 会社情報セクション */}
                                <div className="border-b pb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        会社情報
                                    </h3>

                                    {/* 会社名 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            会社名{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="company_name"
                                            value={data.company_name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.company_name && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.company_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* 会社タイプ */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            事業形態
                                        </label>
                                        <select
                                            name="company_type"
                                            value={data.company_type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="individual">
                                                個人事業主
                                            </option>
                                            <option value="corporate">
                                                法人
                                            </option>
                                        </select>
                                    </div>

                                    {/* 電話番号 */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            電話番号{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="company_phone"
                                            value={data.company_phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.company_phone && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.company_phone}
                                            </p>
                                        )}
                                    </div>

                                    {/* オプション情報 */}
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                法人名（登記）
                                            </label>
                                            <input
                                                type="text"
                                                name="legal_name"
                                                value={data.legal_name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                代表者名
                                            </label>
                                            <input
                                                type="text"
                                                name="representative_name"
                                                value={data.representative_name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                代表者メール
                                            </label>
                                            <input
                                                type="email"
                                                name="representative_email"
                                                value={
                                                    data.representative_email
                                                }
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                代表者電話番号
                                            </label>
                                            <input
                                                type="tel"
                                                name="representative_phone"
                                                value={
                                                    data.representative_phone
                                                }
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ボタン */}
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
                                    >
                                        {processing ? "登録中..." : "登録"}
                                    </button>
                                    <Link
                                        href={route("public.home")}
                                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
                                    >
                                        キャンセル
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        </>
    );
}
