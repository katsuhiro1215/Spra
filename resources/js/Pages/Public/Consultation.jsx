import { useForm } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import { PublicFlashMessage } from "@/Components/Notifications";
import SlotCalendar from "@/Pages/User/Appointments/_components/SlotCalendar";
import {
    ExclamationTriangleIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

export default function Consultation({
    auth,
    availableSlots = [],
    source = "web",
    ref = null,
}) {
    const breadcrumbs = [{ label: "無料相談" }];
    const { data, setData, post, processing, errors, reset } = useForm({
        appointment_slot_id: "",
        guest_name: "",
        guest_email: "",
        guest_phone: "",
        description: "",
        website: "", // ハニーポット（人間には見えない欄）
        source, // 予約経路（SNS等の外部導線から流入した場合に設定される）
        ref, // 外部プラットフォームのユーザー識別子
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("consultation.store"), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <PublicLayout auth={auth}>
            <PageHero
                title="無料相談"
                subtitle="無料相談のご予約"
                breadcrumbs={breadcrumbs}
            />

            {/* フラッシュメッセージ（中央モーダル表示） */}
            <PublicFlashMessage />

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                無料相談のご予約
                            </h2>
                            <p className="text-gray-600">
                                アカウント登録は不要です。ご都合の良い日時を選んで、そのままご予約いただけます。
                            </p>
                        </div>

                        {/* 注意書き */}
                        <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
                            <div className="flex-shrink-0 p-2 bg-amber-500 rounded-lg">
                                <ExclamationTriangleIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 text-sm text-amber-800 space-y-1">
                                <p>※ 営業目的でのご予約はご遠慮ください。</p>
                                <p>
                                    ※
                                    ご予約は本日から2週間先までの日程からお選びいただけます。
                                </p>
                                <p>
                                    ※
                                    ご予約後の日程変更・キャンセルはお電話またはメールにてご連絡ください。
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
                        >
                            {/* ハニーポット（人間には見えない欄） */}
                            <input
                                type="text"
                                name="website"
                                value={data.website}
                                onChange={(e) =>
                                    setData("website", e.target.value)
                                }
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                className="absolute -left-[9999px] w-px h-px overflow-hidden"
                            />

                            {/* お名前 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    お名前{" "}
                                    <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.guest_name}
                                    onChange={(e) =>
                                        setData("guest_name", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="山田 太郎"
                                    required
                                />
                                {errors.guest_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.guest_name}
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
                                    value={data.guest_email}
                                    onChange={(e) =>
                                        setData("guest_email", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="example@email.com"
                                    required
                                />
                                {errors.guest_email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.guest_email}
                                    </p>
                                )}
                            </div>

                            {/* 電話番号 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    電話番号{" "}
                                    <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={data.guest_phone}
                                    onChange={(e) =>
                                        setData("guest_phone", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="090-1234-5678"
                                    required
                                />
                                {errors.guest_phone && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.guest_phone}
                                    </p>
                                )}
                            </div>

                            {/* ご相談内容 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    ご相談内容
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder="事前に共有しておきたい内容があればご記入ください（任意）"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* 日時選択 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    ご希望日時{" "}
                                    <span className="text-red-600">*</span>
                                </label>
                                {availableSlots.length === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        現在予約可能な日時がありません
                                    </p>
                                ) : (
                                    <SlotCalendar
                                        slots={availableSlots}
                                        value={data.appointment_slot_id}
                                        onChange={(slotId) =>
                                            setData(
                                                "appointment_slot_id",
                                                slotId,
                                            )
                                        }
                                    />
                                )}
                                {errors.appointment_slot_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.appointment_slot_id}
                                    </p>
                                )}
                            </div>

                            {/* 送信ボタン */}
                            <button
                                type="submit"
                                disabled={
                                    processing ||
                                    !data.appointment_slot_id ||
                                    availableSlots.length === 0
                                }
                                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                                {processing ? "送信中..." : "無料相談を予約する"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
