import { useForm } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import { PublicFlashMessage } from "@/Components/Notifications";
import {
    EnvelopeIcon,
    PhoneIcon,
    DocumentTextIcon,
    PaperAirplaneIcon,
    CalculatorIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";

const QUOTE_CATEGORY_SLUG = "quote-request";

export default function Contact({ auth, categories = [] }) {
    const breadcrumbs = [{ label: "お問い合わせ" }];
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        contact_category_id: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("contact.store"), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const selectedCategory = categories.find(
        (cat) => String(cat.id) === String(data.contact_category_id),
    );
    const isQuoteCategorySelected =
        selectedCategory?.slug === QUOTE_CATEGORY_SLUG;

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
            icon: DocumentTextIcon,
            title: "フォームでのお問い合わせ",
            content: "下記フォームより送信",
            description: "24時間受付・2営業日以内に返信",
        },
    ];

    return (
        <PublicLayout auth={auth}>
            <PageHero
                title="Contact"
                subtitle="お問い合わせ"
                breadcrumbs={breadcrumbs}
            />

            {/* フラッシュメッセージ（中央モーダル表示） */}
            <PublicFlashMessage />

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        {/* 連絡方法 */}
                        <div className="mb-16">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    連絡方法
                                </h2>
                                <p className="text-gray-600">
                                    お電話・メール・フォームのいずれかでお問い合わせください。
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-6">
                                {contactInfo.map((info, index) => {
                                    const Icon = info.icon;
                                    const isForm =
                                        info.title === "フォームでのお問い合わせ";
                                    const content = (
                                        <div className="flex flex-col items-start gap-4">
                                            <div className="flex-shrink-0 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
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
                                    );

                                    return isForm ? (
                                        <a
                                            key={index}
                                            href="#contact-form"
                                            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow block"
                                        >
                                            {content}
                                            <p className="mt-4 text-sm font-semibold text-blue-600 flex items-center gap-1">
                                                フォームはこちら
                                                <ArrowRightIcon className="w-4 h-4" />
                                            </p>
                                        </a>
                                    ) : (
                                        <div
                                            key={index}
                                            className="bg-white rounded-2xl shadow-md p-6"
                                        >
                                            {content}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* お問い合わせフォーム */}
                        <div id="contact-form">
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

                                {/* 会社名・団体名 */}
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
                                        placeholder="○○○ 株式会社"
                                    />
                                </div>

                                {/* カテゴリ選択 */}
                                {categories.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            お問い合わせ種別{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            value={data.contact_category_id}
                                            onChange={(e) =>
                                                setData(
                                                    "contact_category_id",
                                                    e.target.value,
                                                )
                                            }
                                            disabled={processing}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">
                                                選択してください
                                            </option>
                                            {categories.map((cat) => (
                                                <option
                                                    key={cat.id}
                                                    value={cat.id}
                                                >
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.contact_category_id && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.contact_category_id}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* 見積シミュレーター誘導バナー */}
                                {isQuoteCategorySelected && (
                                    <div className="flex items-start gap-4 bg-blue-50 border border-blue-200 rounded-xl p-5">
                                        <div className="flex-shrink-0 p-2 bg-blue-600 rounded-lg">
                                            <CalculatorIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 mb-1">
                                                詳細な見積もりは見積シミュレーターが便利です
                                            </p>
                                            <p className="text-sm text-gray-600 mb-3">
                                                ご要望を入力するだけで、その場で概算費用を確認できます。もちろん、このままフォームから送信いただいても構いません。
                                            </p>
                                            <a
                                                href={route("estimate.simulator")}
                                                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                                            >
                                                見積シミュレーターを使う
                                                <ArrowRightIcon className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                )}

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
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
