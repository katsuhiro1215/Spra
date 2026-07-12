import React from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton, DangerButton } from "@/Components/Buttons";
import { InputLabel, TextInput, InputError } from "@/Components/Forms";
import SlotCalendar from "./_components/SlotCalendar";

const meetingToolOptions = [
    { value: "zoom", label: "Zoom" },
    { value: "teams", label: "Microsoft Teams" },
    { value: "google_meet", label: "Google Meet" },
    { value: "other", label: "その他" },
];

export default function Edit({ appointment, availableSlots, projects }) {
    const { data, setData, put, processing, errors } = useForm({
        appointment_slot_id: appointment.appointment_slot_id || "",
        project_id: appointment.project_id || "",
        subject: appointment.subject || "",
        description: appointment.description || "",
        location_type: appointment.location_type || "online",
        meeting_tool: appointment.meeting_tool || "",
        client_notes: appointment.client_notes || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("user.appointments.update", appointment.id));
    };

    const handleCancel = () => {
        const reason = prompt("キャンセル理由があればご記入ください（任意）:");
        if (reason !== null) {
            router.post(route("user.appointments.cancel", appointment.id), {
                cancellation_reason: reason,
            });
        }
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: route("user.dashboard") },
        { label: "予約", href: route("user.appointments.index") },
        { label: "予約の変更", href: null },
    ];

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="予約の変更"
                    description="日時や内容を変更できます"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="予約の変更" />
            <FlashMessage />

            <div className="max-w-2xl mx-auto sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardBody>
                        <form onSubmit={submit} className="space-y-6">
                            {/* 予約枠選択（カレンダー） */}
                            <div>
                                <InputLabel value="日時 *" required />
                                <div className="mt-1">
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
                                </div>
                                <InputError
                                    message={errors.appointment_slot_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* 件名 */}
                            <div>
                                <InputLabel
                                    htmlFor="subject"
                                    value="ご相談内容（件名） *"
                                    required
                                />
                                <TextInput
                                    id="subject"
                                    type="text"
                                    value={data.subject}
                                    onChange={(e) =>
                                        setData("subject", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.subject}
                                    className="mt-2"
                                />
                            </div>

                            {/* 詳細 */}
                            <div>
                                <InputLabel
                                    htmlFor="description"
                                    value="詳細"
                                />
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows="4"
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>

                            {/* プロジェクト */}
                            {projects.length > 0 && (
                                <div>
                                    <InputLabel
                                        htmlFor="project_id"
                                        value="関連プロジェクト"
                                    />
                                    <select
                                        id="project_id"
                                        value={data.project_id}
                                        onChange={(e) =>
                                            setData(
                                                "project_id",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">選択なし</option>
                                        {projects.map((project) => (
                                            <option
                                                key={project.id}
                                                value={project.id}
                                            >
                                                {project.title}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        message={errors.project_id}
                                        className="mt-2"
                                    />
                                </div>
                            )}

                            {/* 会議形式 */}
                            <div>
                                <InputLabel value="会議形式 *" required />
                                <div className="mt-2 flex items-center gap-6">
                                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <input
                                            type="radio"
                                            name="location_type"
                                            checked={
                                                data.location_type === "online"
                                            }
                                            onChange={() =>
                                                setData(
                                                    "location_type",
                                                    "online",
                                                )
                                            }
                                        />
                                        オンライン（Web会議）
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <input
                                            type="radio"
                                            name="location_type"
                                            checked={
                                                data.location_type ===
                                                "in_person"
                                            }
                                            onChange={() =>
                                                setData(
                                                    "location_type",
                                                    "in_person",
                                                )
                                            }
                                        />
                                        対面
                                    </label>
                                </div>
                                <InputError
                                    message={errors.location_type}
                                    className="mt-2"
                                />
                            </div>

                            {/* Web会議ツール */}
                            {data.location_type === "online" && (
                                <div>
                                    <InputLabel
                                        htmlFor="meeting_tool"
                                        value="使用するツール *"
                                        required
                                    />
                                    <select
                                        id="meeting_tool"
                                        value={data.meeting_tool}
                                        onChange={(e) =>
                                            setData(
                                                "meeting_tool",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">
                                            選択してください
                                        </option>
                                        {meetingToolOptions.map((tool) => (
                                            <option
                                                key={tool.value}
                                                value={tool.value}
                                            >
                                                {tool.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        message={errors.meeting_tool}
                                        className="mt-2"
                                    />
                                </div>
                            )}

                            {appointment.meeting_url && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    会議URL:{" "}
                                    <a
                                        href={appointment.meeting_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        {appointment.meeting_url}
                                    </a>
                                </p>
                            )}

                            {/* アクションボタン */}
                            <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <DangerButton
                                    type="button"
                                    onClick={handleCancel}
                                >
                                    この予約をキャンセル
                                </DangerButton>
                                <div className="flex gap-3">
                                    <Link
                                        href={route(
                                            "user.appointments.index",
                                        )}
                                    >
                                        <SecondaryButton type="button">
                                            戻る
                                        </SecondaryButton>
                                    </Link>
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? "更新中..." : "更新する"}
                                    </PrimaryButton>
                                </div>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
