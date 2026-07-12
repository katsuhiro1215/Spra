import React, { useMemo } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserPageHeader from "@/Components/Layout/UserPageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { InputLabel, TextInput, InputError } from "@/Components/Forms";
import SlotCalendar from "./_components/SlotCalendar";

const meetingToolOptions = [
    { value: "zoom", label: "Zoom" },
    { value: "teams", label: "Microsoft Teams" },
    { value: "google_meet", label: "Google Meet" },
    { value: "other", label: "その他" },
];

export default function Create({ availableSlots, projects, ticketBalances }) {
    const { data, setData, post, processing, errors } = useForm({
        appointment_slot_id: "",
        project_id: "",
        subject: "",
        description: "",
        location_type: "online",
        meeting_tool: "",
        client_notes: "",
    });

    const selectedProjectTickets = data.project_id
        ? ticketBalances[data.project_id]
        : null;

    const hasNoTickets =
        !!data.project_id &&
        (!selectedProjectTickets || selectedProjectTickets.balance <= 0);

    const canSubmit = useMemo(() => {
        return (
            !!data.project_id &&
            !!selectedProjectTickets &&
            selectedProjectTickets.balance > 0 &&
            !!data.appointment_slot_id
        );
    }, [data.project_id, data.appointment_slot_id, selectedProjectTickets]);

    const submit = (e) => {
        e.preventDefault();
        if (
            !confirm(
                "1チケット消費します。予約しますか？",
            )
        ) {
            return;
        }
        post(route("user.appointments.store"));
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: route("user.dashboard") },
        { label: "予約", href: route("user.appointments.index") },
        { label: "新規予約", href: null },
    ];

    return (
        <AuthenticatedLayout
            header={
                <UserPageHeader
                    title="予約する"
                    description="ご都合の良い日時を選んで面談・相談を予約できます"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="予約する" />
            <FlashMessage />

            <div className="max-w-2xl mx-auto sm:px-6 lg:px-8 py-8">
                {projects.length === 0 ? (
                    <Card>
                        <CardBody>
                            <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                                予約可能なプロジェクトがありません
                            </p>
                        </CardBody>
                    </Card>
                ) : (
                    <Card>
                        <CardBody>
                            <form onSubmit={submit} className="space-y-6">
                                {/* プロジェクト選択 */}
                                <div>
                                    <InputLabel
                                        htmlFor="project_id"
                                        value="関連プロジェクト *"
                                        required
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
                                        required
                                    >
                                        <option value="">
                                            選択してください
                                        </option>
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

                                {/* チケット残数表示 */}
                                {data.project_id && (
                                    <div
                                        className={`rounded-md p-4 text-sm ${
                                            hasNoTickets
                                                ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                                : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                                        }`}
                                    >
                                        {selectedProjectTickets ? (
                                            <>
                                                <p className="font-medium">
                                                    残り{" "}
                                                    {
                                                        selectedProjectTickets.balance
                                                    }{" "}
                                                    枚のミーティングチケットをご利用いただけます
                                                    {selectedProjectTickets.unitMinutes
                                                        ? `（1枚 = ${selectedProjectTickets.unitMinutes}分）`
                                                        : ""}
                                                </p>
                                                {hasNoTickets && (
                                                    <p className="mt-1">
                                                        チケットが不足しているため予約できません。
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <p>
                                                このプロジェクトには予約に利用できる契約特典がありません。
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* 予約枠選択（カレンダー） */}
                                <div>
                                    <InputLabel value="日時 *" required />
                                    {availableSlots.length === 0 ? (
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            現在予約可能な日時がありません
                                        </p>
                                    ) : (
                                        <div className="mt-1">
                                            <SlotCalendar
                                                slots={availableSlots}
                                                value={
                                                    data.appointment_slot_id
                                                }
                                                onChange={(slotId) =>
                                                    setData(
                                                        "appointment_slot_id",
                                                        slotId,
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
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
                                        placeholder="例: プロジェクトの進捗について相談したい"
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
                                            setData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        rows="4"
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="事前に共有しておきたい内容があればご記入ください"
                                    />
                                    <InputError
                                        message={errors.description}
                                        className="mt-2"
                                    />
                                </div>

                                {/* 会議形式 */}
                                <div>
                                    <InputLabel value="会議形式 *" required />
                                    <div className="mt-2 flex items-center gap-6">
                                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <input
                                                type="radio"
                                                name="location_type"
                                                checked={
                                                    data.location_type ===
                                                    "online"
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
                                            {meetingToolOptions.map(
                                                (tool) => (
                                                    <option
                                                        key={tool.value}
                                                        value={tool.value}
                                                    >
                                                        {tool.label}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        <InputError
                                            message={errors.meeting_tool}
                                            className="mt-2"
                                        />
                                    </div>
                                )}

                                {/* 送信ボタン */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route(
                                            "user.appointments.index",
                                        )}
                                    >
                                        <SecondaryButton type="button">
                                            キャンセル
                                        </SecondaryButton>
                                    </Link>
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing || !canSubmit}
                                    >
                                        {processing
                                            ? "予約中..."
                                            : "1チケットで予約する"}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
