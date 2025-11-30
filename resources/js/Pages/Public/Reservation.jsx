import { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    CalendarDaysIcon,
    ClockIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import PublicLayout from "@/Layouts/PublicLayout";

export default function Reservation() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        consultation_type: "",
        message: "",
        date: "",
        time: "",
    });

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // 営業時間設定（後で管理画面から取得）
    const businessHours = [
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
    ];

    // 相談内容のオプション
    const consultationTypes = [
        { value: "web_development", label: "Webサイト開発" },
        { value: "system_development", label: "システム開発" },
        { value: "ecommerce", label: "ECサイト構築" },
        { value: "ai_dx", label: "AI・DX支援" },
        { value: "consulting", label: "ITコンサルティング" },
        { value: "maintenance", label: "保守・運用" },
        { value: "other", label: "その他" },
    ];

    // カレンダー生成
    const generateCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay()); // 週の始まりを日曜日に

        const calendar = [];
        const today = new Date();

        for (let week = 0; week < 6; week++) {
            const weekDays = [];
            for (let day = 0; day < 7; day++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + week * 7 + day);

                const isCurrentMonth = date.getMonth() === month;
                const isToday = date.toDateString() === today.toDateString();
                const isPast = date < today;
                const isWeekend = date.getDay() === 0 || date.getDay() === 6; // 日曜日または土曜日
                const isAvailable = isCurrentMonth && !isPast && !isWeekend;

                weekDays.push({
                    date,
                    isCurrentMonth,
                    isToday,
                    isPast,
                    isWeekend,
                    isAvailable,
                    dayNumber: date.getDate(),
                });
            }
            calendar.push(weekDays);
        }
        return calendar;
    };

    // 時間枠の空き状況（実際は管理画面から取得）
    const getTimeSlotStatus = (date, time) => {
        // モックデータ：ランダムに空き状況を決定
        const mockBookedSlots = [
            { date: "2024-11-29", time: "09:00" },
            { date: "2024-11-29", time: "14:00" },
            { date: "2024-12-02", time: "10:00" },
            { date: "2024-12-02", time: "15:00" },
        ];

        const dateStr = date.toISOString().split("T")[0];
        return !mockBookedSlots.some(
            (slot) => slot.date === dateStr && slot.time === time
        );
    };

    const handleDateSelect = (date) => {
        if (date.isAvailable) {
            setSelectedDate(date.date);
            setSelectedTime(null);
            setData("date", date.date.toISOString().split("T")[0]);
        }
    };

    const handleTimeSelect = (time) => {
        if (selectedDate && getTimeSlotStatus(selectedDate, time)) {
            setSelectedTime(time);
            setData("time", time);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("reservation.store"), {
            onSuccess: () => {
                reset();
                setSelectedDate(null);
                setSelectedTime(null);
            },
        });
    };

    const monthNames = [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
    ];

    const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

    return (
        <PublicLayout>
            <Head title="無料相談予約 | Smart Sprouts" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* ヘッダー */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6">
                            <CalendarDaysIcon className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            無料相談予約
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Smart
                            Sproutsの専門スタッフがあなたのビジネス課題について、
                            <br />
                            無料でご相談に応じます。お気軽にお申し込みください。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* 左側：カレンダーと時間選択 */}
                        <div className="space-y-8">
                            {/* カレンダー */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                        <CalendarDaysIcon className="w-6 h-6 text-green-600 mr-2" />
                                        日付選択
                                    </h2>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() =>
                                                setCurrentMonth(
                                                    new Date(
                                                        currentMonth.setMonth(
                                                            currentMonth.getMonth() -
                                                                1
                                                        )
                                                    )
                                                )
                                            }
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                        >
                                            <svg
                                                className="w-5 h-5 text-gray-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 19l-7-7 7-7"
                                                />
                                            </svg>
                                        </button>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {currentMonth.getFullYear()}年{" "}
                                            {
                                                monthNames[
                                                    currentMonth.getMonth()
                                                ]
                                            }
                                        </h3>
                                        <button
                                            onClick={() =>
                                                setCurrentMonth(
                                                    new Date(
                                                        currentMonth.setMonth(
                                                            currentMonth.getMonth() +
                                                                1
                                                        )
                                                    )
                                                )
                                            }
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                        >
                                            <svg
                                                className="w-5 h-5 text-gray-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* カレンダーグリッド */}
                                <div className="grid grid-cols-7 gap-1">
                                    {weekDays.map((day) => (
                                        <div
                                            key={day}
                                            className="text-center text-sm font-medium text-gray-500 p-2"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                    {generateCalendar().map((week, weekIndex) =>
                                        week.map((day, dayIndex) => (
                                            <button
                                                key={`${weekIndex}-${dayIndex}`}
                                                onClick={() =>
                                                    handleDateSelect(day)
                                                }
                                                disabled={!day.isAvailable}
                                                className={`
                                                    p-2 text-sm rounded-lg transition-all duration-200 relative
                                                    ${
                                                        !day.isCurrentMonth
                                                            ? "text-gray-300 cursor-not-allowed"
                                                            : day.isAvailable
                                                            ? selectedDate?.toDateString() ===
                                                              day.date.toDateString()
                                                                ? "bg-green-600 text-white shadow-md"
                                                                : "hover:bg-green-100 text-gray-700"
                                                            : "text-gray-400 cursor-not-allowed"
                                                    }
                                                    ${
                                                        day.isToday
                                                            ? "ring-2 ring-blue-500"
                                                            : ""
                                                    }
                                                `}
                                            >
                                                {day.dayNumber}
                                                {day.isAvailable && (
                                                    <span className="absolute -top-1 -right-1 text-green-500 text-xs">
                                                        ○
                                                    </span>
                                                )}
                                                {!day.isAvailable &&
                                                    day.isCurrentMonth && (
                                                        <span className="absolute -top-1 -right-1 text-red-500 text-xs">
                                                            ×
                                                        </span>
                                                    )}
                                            </button>
                                        ))
                                    )}
                                </div>

                                <div className="mt-4 flex items-center text-xs text-gray-600 space-x-4">
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-1">
                                            ○
                                        </span>
                                        予約可能
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-red-500 mr-1">
                                            ×
                                        </span>
                                        予約不可
                                    </div>
                                </div>
                            </div>

                            {/* 時間選択 */}
                            {selectedDate && (
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <ClockIcon className="w-6 h-6 text-blue-600 mr-2" />
                                        時間選択
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {businessHours.map((time) => {
                                            const isAvailable =
                                                getTimeSlotStatus(
                                                    selectedDate,
                                                    time
                                                );
                                            return (
                                                <button
                                                    key={time}
                                                    onClick={() =>
                                                        handleTimeSelect(time)
                                                    }
                                                    disabled={!isAvailable}
                                                    className={`
                                                        p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center
                                                        ${
                                                            isAvailable
                                                                ? selectedTime ===
                                                                  time
                                                                    ? "bg-blue-600 text-white shadow-md"
                                                                    : "bg-gray-50 hover:bg-blue-100 text-gray-700"
                                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        }
                                                    `}
                                                >
                                                    {time}
                                                    <span className="ml-1 text-xs">
                                                        {isAvailable
                                                            ? "○"
                                                            : "×"}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 右側：予約フォーム */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-600 mr-2" />
                                お客様情報
                            </h2>

                            <form onSubmit={submit} className="space-y-6">
                                {/* お名前 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        お名前{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <UserIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                                                errors.name
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                    : "border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                                            }`}
                                            placeholder="山田 太郎"
                                            required
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* メールアドレス */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        メールアドレス{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                                                errors.email
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                    : "border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                                            }`}
                                            placeholder="yamada@example.com"
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* 電話番号 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        電話番号
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors duration-200"
                                            placeholder="090-1234-5678"
                                        />
                                    </div>
                                </div>

                                {/* 会社名 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        会社名・団体名
                                    </label>
                                    <input
                                        type="text"
                                        value={data.company}
                                        onChange={(e) =>
                                            setData("company", e.target.value)
                                        }
                                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors duration-200"
                                        placeholder="株式会社〇〇"
                                    />
                                </div>

                                {/* 相談内容 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        相談内容{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.consultation_type}
                                        onChange={(e) =>
                                            setData(
                                                "consultation_type",
                                                e.target.value
                                            )
                                        }
                                        className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                                            errors.consultation_type
                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                                : "border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                                        }`}
                                        required
                                    >
                                        <option value="">
                                            選択してください
                                        </option>
                                        {consultationTypes.map((type) => (
                                            <option
                                                key={type.value}
                                                value={type.value}
                                            >
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.consultation_type && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.consultation_type}
                                        </p>
                                    )}
                                </div>

                                {/* 詳細メッセージ */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        詳細・ご質問
                                    </label>
                                    <textarea
                                        value={data.message}
                                        onChange={(e) =>
                                            setData("message", e.target.value)
                                        }
                                        rows={4}
                                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors duration-200"
                                        placeholder="具体的なご要望やご質問がございましたら、お気軽にお書きください..."
                                    />
                                </div>

                                {/* 選択された予約内容の確認 */}
                                {selectedDate && selectedTime && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <h3 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                                            予約内容の確認
                                        </h3>
                                        <p className="text-sm text-green-700">
                                            📅{" "}
                                            {selectedDate.toLocaleDateString(
                                                "ja-JP",
                                                {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    weekday: "long",
                                                }
                                            )}
                                            <br />
                                            🕐 {selectedTime}〜
                                        </p>
                                    </div>
                                )}

                                {/* 送信ボタン */}
                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !selectedDate ||
                                        !selectedTime
                                    }
                                    className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 ${
                                        processing ||
                                        !selectedDate ||
                                        !selectedTime
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 active:transform active:scale-[0.98]"
                                    } text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            送信中...
                                        </div>
                                    ) : (
                                        <>
                                            <CalendarDaysIcon className="w-5 h-5 inline-block mr-2" />
                                            無料相談を予約する
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    予約完了後、確認メールをお送りいたします。
                                    <br />
                                    ご質問がございましたら、お気軽にお問い合わせください。
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
