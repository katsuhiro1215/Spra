import { useForm } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody } from "@/Components/Card";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function Index({ categories = [], defaults = {} }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: defaults.name || "",
        email: defaults.email || "",
        phone: defaults.phone || "",
        company: defaults.company || "",
        contact_category_id: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("user.contact.send"), {
            onSuccess: () => {
                reset("contact_category_id", "subject", "message");
            },
        });
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: route("user.dashboard") },
        { label: "お問い合わせ", href: null },
    ];

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="お問い合わせ"
                    description="ご質問・ご相談は下記フォームよりお気軽にお問い合わせください"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="お問い合わせ" />

            <FlashMessage />

            <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardBody>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* お名前 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    お名前{" "}
                                    <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                                    <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                                        setData("company", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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

                            {/* 件名 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    件名{" "}
                                    <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.subject}
                                    onChange={(e) =>
                                        setData("subject", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                                    <span className="text-red-600">*</span>
                                </label>
                                <textarea
                                    value={data.message}
                                    onChange={(e) =>
                                        setData("message", e.target.value)
                                    }
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
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
                                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                                {processing ? "送信中..." : "送信する"}
                            </button>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
