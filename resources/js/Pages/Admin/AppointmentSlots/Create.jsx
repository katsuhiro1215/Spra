import React, { useEffect, useMemo } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FormGroup, TextInput, SelectInput, TextArea } from "@/Components/Forms";
import { ArrowLeftIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function Create({ admins, slotTypes, shiftInfo }) {
    const { data, setData, post, processing, errors } = useForm({
        date: "",
        start_time: "",
        end_time: "",
        slot_type: "meeting",
        max_capacity: 1,
        assigned_admin_id: "",
        status: "available",
        notes: "",
    });

    // 担当者・日付を選んだら、その担当者のシフトを注意喚起表示用に取得する
    useEffect(() => {
        if (!data.assigned_admin_id || !data.date) return;

        router.get(
            route("admin.appointment-slots.create"),
            {
                assigned_admin_id: data.assigned_admin_id,
                date: data.date,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ["shiftInfo"],
            },
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.assigned_admin_id, data.date]);

    // シフト外・シフト未登録の場合の注意喚起メッセージ（登録自体はブロックしない）
    const shiftWarning = useMemo(() => {
        if (!data.assigned_admin_id || !data.date || !shiftInfo) {
            return null;
        }

        const shifts = shiftInfo.shifts || [];

        if (shifts.length === 0) {
            return "この担当者は指定した日のシフトが登録されていません。残業やイレギュラー対応で問題なければ、このまま登録できます。";
        }

        if (!data.start_time || !data.end_time) {
            return null;
        }

        const withinAnyShift = shifts.some(
            (shift) =>
                data.start_time >= shift.start_time &&
                data.end_time <= shift.end_time,
        );

        if (!withinAnyShift) {
            const ranges = shifts
                .map((shift) => `${shift.start_time}〜${shift.end_time}`)
                .join("、");
            return `選択した時間帯は担当者のシフト（${ranges}）の時間外です。残業等で問題なければ、このまま登録できます。`;
        }

        return null;
    }, [
        data.assigned_admin_id,
        data.date,
        data.start_time,
        data.end_time,
        shiftInfo,
    ]);

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.appointment-slots.store"));
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.appointmentSlots.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.appointment-slots.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.appointmentSlots.breadcrumbs,
        PageConfig.appointmentSlots.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.appointmentSlots.pages.create.title}
                    description={
                        PageConfig.appointmentSlots.pages.create.description
                    }
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.appointmentSlots.pages.create.title} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full sm:max-w-7xl lg:max-w-4xl">
                <Card>
                    <CardBody>
                        <form onSubmit={submit} className="space-y-6">
                            {/* 日付 */}
                            <FormGroup
                                label="日付"
                                htmlFor="date"
                                required
                                error={errors.date}
                            >
                                <TextInput
                                    id="date"
                                    type="date"
                                    value={data.date}
                                    onChange={(e) =>
                                        setData("date", e.target.value)
                                    }
                                    required
                                />
                            </FormGroup>

                            {/* 時間帯 */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormGroup
                                    label="開始時刻"
                                    htmlFor="start_time"
                                    required
                                    error={errors.start_time}
                                >
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
                                        required
                                    />
                                </FormGroup>
                                <FormGroup
                                    label="終了時刻"
                                    htmlFor="end_time"
                                    required
                                    error={errors.end_time}
                                >
                                    <TextInput
                                        id="end_time"
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) =>
                                            setData(
                                                "end_time",
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </FormGroup>
                            </div>

                            {/* シフト注意喚起（ブロックはしない） */}
                            {shiftWarning && (
                                <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/30 p-3">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-amber-800 dark:text-amber-300">
                                        {shiftWarning}
                                    </p>
                                </div>
                            )}

                            {/* 予約タイプ */}
                            <FormGroup
                                label="予約タイプ"
                                htmlFor="slot_type"
                                required
                                error={errors.slot_type}
                            >
                                <SelectInput
                                    id="slot_type"
                                    value={data.slot_type}
                                    onChange={(e) =>
                                        setData("slot_type", e.target.value)
                                    }
                                    options={slotTypes}
                                    required
                                />
                            </FormGroup>

                            {/* 最大予約数 */}
                            <FormGroup
                                label="最大予約数"
                                htmlFor="max_capacity"
                                required
                                error={errors.max_capacity}
                            >
                                <TextInput
                                    id="max_capacity"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={data.max_capacity}
                                    onChange={(e) =>
                                        setData(
                                            "max_capacity",
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    この時間枠で受け付ける予約の最大数を設定します（1〜100）
                                </p>
                            </FormGroup>

                            {/* 担当者 */}
                            <FormGroup
                                label="担当者"
                                htmlFor="assigned_admin_id"
                                error={errors.assigned_admin_id}
                            >
                                <SelectInput
                                    id="assigned_admin_id"
                                    value={data.assigned_admin_id}
                                    onChange={(e) =>
                                        setData(
                                            "assigned_admin_id",
                                            e.target.value,
                                        )
                                    }
                                    options={[
                                        { value: "", label: "未割り当て" },
                                        ...admins,
                                    ]}
                                />
                            </FormGroup>

                            {/* ステータス */}
                            <FormGroup
                                label="ステータス"
                                htmlFor="status"
                                required
                                error={errors.status}
                            >
                                <SelectInput
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    options={[
                                        {
                                            value: "available",
                                            label: "予約可能",
                                        },
                                        {
                                            value: "blocked",
                                            label: "ブロック中",
                                        },
                                    ]}
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    ブロック中の枠は予約受付されません
                                </p>
                            </FormGroup>

                            {/* メモ */}
                            <FormGroup
                                label="メモ"
                                htmlFor="notes"
                                error={errors.notes}
                            >
                                <TextArea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    rows={4}
                                    placeholder="この時間枠に関する補足事項があれば記入してください"
                                />
                            </FormGroup>

                            {/* アクションボタン */}
                            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
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
                                    {processing ? "作成中..." : "作成"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
