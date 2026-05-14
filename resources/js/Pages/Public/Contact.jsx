import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    ClockIcon,
    PaperAirplaneIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function Contact({ auth }) {
    const { flash } = usePage().props;
    const breadcrumbs = [{ label: "お問い合わせ" }];
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("public.contact.store"), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const contactInfo = [
        {
            icon: PhoneIcon,
            title: "お電話でのお問い合わせ",
            content: "03-1234-5678",
            description: "平日 9:00-18:00",
        },
        {
            icon: EnvelopeIcon,
            title: "メールでのお問い合わせ",
            content: "info@smartsprouts.com",
            description: "24時間受付",
        },
        {
            icon: MapPinIcon,
            title: "本社所在地",
            content: "〒100-0001",
            description: "東京都千代田区千代田1-1-1",
        },
        {
            icon: ClockIcon,
            title: "営業時間",
            content: "平日 9:00-18:00",
            description: "土日祝休業",
        },
    ];

    return (
        <PublicLayout auth={auth}>
            <PageHero
                title="Contact"
                subtitle="お問い合わせ"
                breadcrumbs={breadcrumbs}
            />

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        {/* フラッシュメッセージ */}
                        {flash?.success && (
                            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start">
                                <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-green-800 font-semibold mb-1">
                                        送信完了
                                    </h4>
                                    <p className="text-green-700 text-sm">
                                        {flash.success}
                                    </p>
                                </div>
                            </div>
                        )}

                        {flash?.error && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                                <ExclamationCircleIcon className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-red-800 font-semibold mb-1">
                                        エラー
                                    </h4>
                                    <p className="text-red-700 text-sm">
                                        {flash.error}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Left - フォーム */}
                            <div>
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        お問い合わせフォーム
                                    </h2>
                                    <p className="text-gray-600">
                                        下記フォームに必要事項をご入力の上、送信してください。
                                        <br />
                                        担当者より2営業日以内にご連絡いたします。
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
                                >
                                    {/* お名前 */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            お名前{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="山田 太郎"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* メールアドレス */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            メールアドレス{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="example@email.com"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* 電話番号 */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            電話番号
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="090-1234-5678"
                                        />
                                    </div>

                                    {/* 会社名 */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            会社名・団体名
                                        </label>
                                        <input
                                            type="text"
                                            value={data.company}
                                            onChange={(e) =>
                                                setData(
                                                    "company",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="株式会社〇〇"
                                        />
                                    </div>

                                    {/* 件名 */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            件名{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.subject}
                                            onChange={(e) =>
                                                setData(
                                                    "subject",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="サービスについてのお問い合わせ"
                                            required
                                        />
                                        {errors.subject && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.subject}
                                            </p>
                                        )}
                                    </div>

                                    {/* お問い合わせ内容 */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            お問い合わせ内容{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            value={data.message}
                                            onChange={(e) =>
                                                setData(
                                                    "message",
                                                    e.target.value,
                                                )
                                            }
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                            placeholder="お問い合わせ内容をご記入ください"
                                            required
                                        />
                                        {errors.message && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* 送信ボタン */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <PaperAirplaneIcon className="w-5 h-5" />
                                        {processing ? "送信中..." : "送信する"}
                                    </button>
                                </form>
                            </div>

                            {/* Right - 連絡先情報 */}
                            <div>
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        その他のお問い合わせ方法
                                    </h2>
                                    <p className="text-gray-600">
                                        お電話やメールでも受け付けております
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {contactInfo.map((info, index) => {
                                        const Icon = info.icon;
                                        return (
                                            <div
                                                key={index}
                                                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                                                        <Icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 mb-2">
                                                            {info.title}
                                                        </h3>
                                                        <p className="text-lg font-semibold text-blue-600 mb-1">
                                                            {info.content}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {info.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* 地図（ダミー） */}
                                <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
                                    <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
                                        <div className="text-center">
                                            <MapPinIcon className="w-16 h-16 mx-auto mb-2" />
                                            <p className="text-lg font-semibold">
                                                Google Map
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
