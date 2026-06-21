import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Edit({ appointmentSlot, admins, slotTypes, statuses }) {
    const { data, setData, put, processing, errors } = useForm({
        date: appointmentSlot.date || "",
        start_time: appointmentSlot.start_time || "",
        end_time: appointmentSlot.end_time || "",
        slot_type: appointmentSlot.slot_type || "meeting",
        max_capacity: appointmentSlot.max_capacity || 1,
        assigned_admin_id: appointmentSlot.assigned_admin_id || "",
        status: appointmentSlot.status || "available",
        notes: appointmentSlot.notes || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.appointment-slots.update", appointmentSlot.id));
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.appointment-slots.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="予約枠を編集"
                    description="予約枠の情報を編集します"
                    actions={headerActions}
                    breadcrumbs={[
                        ...PageConfig.appointmentSlots.breadcrumbs,
                        "予約枠編集",
                    ]}
                />
            }
        >
            <Head title="予約枠編集" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <FlashMessage />

                    <Card>
                        <form onSubmit={submit} className="space-y-6">
                            {/* 日付 */}
                            <div>
                                <InputLabel
                                    htmlFor="date"
                                    value="日付 *"
                                    required
                                />
                                <TextInput
                                    id="date"
                                    type="date"
                                    value={data.date}
                                    onChange={(e) =>
                                        setData("date", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.date}
                                    className="mt-2"
                                />
                            </div>

                            {/* 時間帯 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="start_time"
                                        value="開始時刻 *"
                                        required
                                    />
                                    <TextInput
                                        id="start_time"
                                        type="time"
                                        value={data.start_time}
                                        onChange={(e) =>
                                            setData(
                                                "start_time",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError
                                        message={errors.start_time}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="end_time"
                                        value="終了時刻 *"
                                        required
                                    />
                                    <TextInput
                                        id="end_time"
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) =>
                                            setData("end_time", e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError
                                        message={errors.end_time}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* 予約タイプ */}
                            <div>
                                <InputLabel
                                    htmlFor="slot_type"
                                    value="予約タイプ *"
                                    required
                                />
                                <select
                                    id="slot_type"
                                    value={data.slot_type}
                                    onChange={(e) =>
                                        setData("slot_type", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                >
                                    {slotTypes.map((type) => (
                                        <option
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.slot_type}
                                    className="mt-2"
                                />
                            </div>

                            {/* 最大予約数 */}
                            <div>
                                <InputLabel
                                    htmlFor="max_capacity"
                                    value="最大予約数 *"
                                    required
                                />
                                <TextInput
                                    id="max_capacity"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={data.max_capacity}
                                    onChange={(e) =>
                                        setData("max_capacity", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    この時間枠で受け付ける予約の最大数を設定します（1〜100）
                                </p>
                                <p className="mt-1 text-sm text-amber-600">
                                    現在の予約数:{" "}
                                    {appointmentSlot.current_bookings} /{" "}
                                    {appointmentSlot.max_capacity}
                                </p>
                                <InputError
                                    message={errors.max_capacity}
                                    className="mt-2"
                                />
                            </div>

                            {/* 担当者 */}
                            <div>
                                <InputLabel
                                    htmlFor="assigned_admin_id"
                                    value="担当者"
                                />
                                <select
                                    id="assigned_admin_id"
                                    value={data.assigned_admin_id}
                                    onChange={(e) =>
                                        setData(
                                            "assigned_admin_id",
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">未割り当て</option>
                                    {admins.map((admin) => (
                                        <option
                                            key={admin.value}
                                            value={admin.value}
                                        >
                                            {admin.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.assigned_admin_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* ステータス */}
                            <div>
                                <InputLabel
                                    htmlFor="status"
                                    value="ステータス *"
                                    required
                                />
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                >
                                    {statuses.map((status) => (
                                        <option
                                            key={status.value}
                                            value={status.value}
                                        >
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-sm text-gray-500">
                                    ブロック中の枠は予約受付されません
                                </p>
                                <InputError
                                    message={errors.status}
                                    className="mt-2"
                                />
                            </div>

                            {/* メモ */}
                            <div>
                                <InputLabel htmlFor="notes" value="メモ" />
                                <textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    rows="4"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="この時間枠に関する補足事項があれば記入してください"
                                />
                                <InputError
                                    message={errors.notes}
                                    className="mt-2"
                                />
                            </div>

                            {/* アクションボタン */}
                            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                                <Link
                                    href={route(
                                        "admin.appointment-slots.index",
                                    )}
                                >
                                    <SecondaryButton type="button">
                                        キャンセル
                                    </SecondaryButton>
                                </Link>
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing ? "更新中..." : "更新"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
