import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    CalendarDaysIcon,
    ClockIcon,
    Cog6ToothIcon,
    CheckIcon,
    XMarkIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ReservationSettings() {
    const { data, setData, post, processing, errors, reset } = useForm({
        business_hours: {
            monday: { enabled: true, start: "09:00", end: "18:00" },
            tuesday: { enabled: true, start: "09:00", end: "18:00" },
            wednesday: { enabled: true, start: "09:00", end: "18:00" },
            thursday: { enabled: true, start: "09:00", end: "18:00" },
            friday: { enabled: true, start: "09:00", end: "18:00" },
            saturday: { enabled: false, start: "09:00", end: "18:00" },
            sunday: { enabled: false, start: "09:00", end: "18:00" },
        },
        time_slots: [
            "09:00",
            "10:00",
            "11:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
        ],
        holidays: [
            "2024-12-29",
            "2024-12-30",
            "2024-12-31",
            "2025-01-01",
            "2025-01-02",
            "2025-01-03",
        ],
        consultation_duration: 60,
        advance_booking_days: 30,
    });

    const weekDays = [
        { key: "monday", label: "月曜日" },
        { key: "tuesday", label: "火曜日" },
        { key: "wednesday", label: "水曜日" },
        { key: "thursday", label: "木曜日" },
        { key: "friday", label: "金曜日" },
        { key: "saturday", label: "土曜日" },
        { key: "sunday", label: "日曜日" },
    ];

    const [newTimeSlot, setNewTimeSlot] = useState("");
    const [newHoliday, setNewHoliday] = useState("");

    const updateBusinessHour = (day, field, value) => {
        setData("business_hours", {
            ...data.business_hours,
            [day]: {
                ...data.business_hours[day],
                [field]: value,
            },
        });
    };

    const addTimeSlot = () => {
        if (newTimeSlot && !data.time_slots.includes(newTimeSlot)) {
            setData("time_slots", [...data.time_slots, newTimeSlot].sort());
            setNewTimeSlot("");
        }
    };

    const removeTimeSlot = (slot) => {
        setData(
            "time_slots",
            data.time_slots.filter((s) => s !== slot)
        );
    };

    const addHoliday = () => {
        if (newHoliday && !data.holidays.includes(newHoliday)) {
            setData("holidays", [...data.holidays, newHoliday].sort());
            setNewHoliday("");
        }
    };

    const removeHoliday = (holiday) => {
        setData(
            "holidays",
            data.holidays.filter((h) => h !== holiday)
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("user.reservation.settings.store"));
    };

    return (
        <AuthenticatedLayout header="予約設定">
            <Head title="予約設定 | Smart Sprouts" />

            <div className="space-y-8">
                <form onSubmit={submit} className="space-y-8">
                    {/* 営業時間設定 */}
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                                営業時間設定
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                各曜日の営業時間を設定してください。チェックを外すと休業日になります。
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            {weekDays.map((day) => (
                                <div
                                    key={day.key}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    data.business_hours[day.key]
                                                        .enabled
                                                }
                                                onChange={(e) =>
                                                    updateBusinessHour(
                                                        day.key,
                                                        "enabled",
                                                        e.target.checked
                                                    )
                                                }
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700 w-16">
                                                {day.label}
                                            </span>
                                        </label>
                                    </div>
                                    {data.business_hours[day.key].enabled && (
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="time"
                                                value={
                                                    data.business_hours[day.key]
                                                        .start
                                                }
                                                onChange={(e) =>
                                                    updateBusinessHour(
                                                        day.key,
                                                        "start",
                                                        e.target.value
                                                    )
                                                }
                                                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-500">
                                                〜
                                            </span>
                                            <input
                                                type="time"
                                                value={
                                                    data.business_hours[day.key]
                                                        .end
                                                }
                                                onChange={(e) =>
                                                    updateBusinessHour(
                                                        day.key,
                                                        "end",
                                                        e.target.value
                                                    )
                                                }
                                                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}
                                    {!data.business_hours[day.key].enabled && (
                                        <span className="text-red-500 text-sm font-medium">
                                            休業日
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 予約時間枠設定 */}
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <CalendarDaysIcon className="h-5 w-5 text-green-600 mr-2" />
                                予約時間枠設定
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                予約可能な時間枠を設定してください。
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                                {data.time_slots.map((slot) => (
                                    <div
                                        key={slot}
                                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                                    >
                                        <span className="text-sm font-medium text-gray-700">
                                            {slot}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeTimeSlot(slot)}
                                            className="text-red-500 hover:text-red-700 ml-2"
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="time"
                                    value={newTimeSlot}
                                    onChange={(e) =>
                                        setNewTimeSlot(e.target.value)
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="新しい時間枠"
                                />
                                <button
                                    type="button"
                                    onClick={addTimeSlot}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    追加
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 休業日設定 */}
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <XMarkIcon className="h-5 w-5 text-red-600 mr-2" />
                                休業日設定
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                祝日や特別休業日を設定してください。
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                                {data.holidays.map((holiday) => (
                                    <div
                                        key={holiday}
                                        className="flex items-center justify-between bg-red-50 px-3 py-2 rounded-lg"
                                    >
                                        <span className="text-sm font-medium text-gray-700">
                                            {new Date(
                                                holiday
                                            ).toLocaleDateString("ja-JP")}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeHoliday(holiday)
                                            }
                                            className="text-red-500 hover:text-red-700 ml-2"
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="date"
                                    value={newHoliday}
                                    onChange={(e) =>
                                        setNewHoliday(e.target.value)
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                <button
                                    type="button"
                                    onClick={addHoliday}
                                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    追加
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* その他の設定 */}
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <Cog6ToothIcon className="h-5 w-5 text-purple-600 mr-2" />
                                その他の設定
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    相談時間（分）
                                </label>
                                <select
                                    value={data.consultation_duration}
                                    onChange={(e) =>
                                        setData(
                                            "consultation_duration",
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value={30}>30分</option>
                                    <option value={45}>45分</option>
                                    <option value={60}>60分</option>
                                    <option value={90}>90分</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    予約可能日数（日前まで）
                                </label>
                                <select
                                    value={data.advance_booking_days}
                                    onChange={(e) =>
                                        setData(
                                            "advance_booking_days",
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value={7}>7日前まで</option>
                                    <option value={14}>14日前まで</option>
                                    <option value={30}>30日前まで</option>
                                    <option value={60}>60日前まで</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 保存ボタン */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className={`inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                processing
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                            } text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        >
                            {processing ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                                    保存中...
                                </>
                            ) : (
                                <>
                                    <CheckIcon className="h-4 w-4 mr-2" />
                                    設定を保存
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
