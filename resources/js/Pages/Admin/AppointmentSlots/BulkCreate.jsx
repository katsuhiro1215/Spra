import React, { useEffect, useMemo, useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FormGroup, TextInput, SelectInput, Checkbox } from "@/Components/Forms";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function BulkCreate({
    admins,
    slotTypes,
    preview,
    rangeError,
    form,
    maxDays,
}) {
    // 検索条件フォーム（変更のたびにサーバーへ再取得し、候補プレビューを更新する）
    const { data, setData } = useForm({
        start_date: form.start_date,
        end_date: form.end_date,
        assigned_admin_id: form.assigned_admin_id || "",
        slot_type: form.slot_type,
        duration_minutes: form.duration_minutes,
        interval_minutes: form.interval_minutes,
        max_capacity: form.max_capacity,
    });

    const regeneratePreview = (overrides = {}) => {
        router.get(
            route("admin.appointment-slots.bulk-create"),
            { ...data, ...overrides },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleFieldChange = (key, value) => {
        setData(key, value);
        regeneratePreview({ [key]: value });
    };

    // プレビュー行の選択・編集用ローカル状態（サーバーから新しいプレビューが来るたびに同期する）
    const [days, setDays] = useState(() => clonePreview(preview));

    useEffect(() => {
        setDays(clonePreview(preview));
    }, [preview]);

    function clonePreview(p) {
        if (!p) return [];
        return p.map((day) => ({
            ...day,
            rows: day.rows.map((row) => ({ ...row })),
        }));
    }

    const totalSelected = useMemo(() => {
        return days.reduce(
            (sum, day) =>
                sum + day.rows.filter((row) => row.include).length,
            0,
        );
    }, [days]);

    const toggleRow = (dateIndex, rowIndex) => {
        setDays((prev) => {
            const next = [...prev];
            const rows = [...next[dateIndex].rows];
            rows[rowIndex] = {
                ...rows[rowIndex],
                include: !rows[rowIndex].include,
            };
            next[dateIndex] = { ...next[dateIndex], rows };
            return next;
        });
    };

    const toggleDay = (dateIndex, include) => {
        setDays((prev) => {
            const next = [...prev];
            next[dateIndex] = {
                ...next[dateIndex],
                rows: next[dateIndex].rows.map((row) => ({
                    ...row,
                    include,
                })),
            };
            return next;
        });
    };

    const updateRowTime = (dateIndex, rowIndex, field, value) => {
        setDays((prev) => {
            const next = [...prev];
            const rows = [...next[dateIndex].rows];
            rows[rowIndex] = { ...rows[rowIndex], [field]: value };
            next[dateIndex] = { ...next[dateIndex], rows };
            return next;
        });
    };

    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const slots = days.flatMap((day) =>
            day.rows
                .filter((row) => row.include)
                .map((row) => ({
                    date: row.date,
                    start_time: row.start_time,
                    end_time: row.end_time,
                })),
        );

        router.post(
            route("admin.appointment-slots.bulk-store"),
            {
                slot_type: data.slot_type,
                max_capacity: data.max_capacity,
                assigned_admin_id: data.assigned_admin_id || null,
                slots,
            },
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            },
        );
    };

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
                    title="予約枠をまとめて作成"
                    description={`営業時間内の候補を自動生成します。確認・調整のうえ保存してください（最大${maxDays}日間まで）`}
                    actions={headerActions}
                    breadcrumbs={[
                        ...PageConfig.appointmentSlots.breadcrumbs,
                        "まとめて作成",
                    ]}
                />
            }
        >
            <Head title="予約枠をまとめて作成" />
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 生成条件 */}
                <Card>
                    <CardHeader>
                        <CardTitle>生成条件</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <FormGroup label="開始日" required>
                                <TextInput
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "start_date",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormGroup>
                            <FormGroup label="終了日" required>
                                <TextInput
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "end_date",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormGroup>
                            <FormGroup label="担当者">
                                <SelectInput
                                    options={[
                                        { value: "", label: "未割り当て" },
                                        ...admins,
                                    ]}
                                    value={data.assigned_admin_id}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "assigned_admin_id",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormGroup>
                            <FormGroup label="予約タイプ" required>
                                <SelectInput
                                    options={slotTypes}
                                    value={data.slot_type}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "slot_type",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormGroup>
                            <FormGroup label="1枠の時間（分）" required>
                                <TextInput
                                    type="number"
                                    min="10"
                                    max="480"
                                    value={data.duration_minutes}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "duration_minutes",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormGroup>
                            <FormGroup label="枠の間隔（分）" required>
                                <TextInput
                                    type="number"
                                    min="10"
                                    max="480"
                                    value={data.interval_minutes}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "interval_minutes",
                                            e.target.value,
                                        )
                                    }
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    60分に設定すると9:00-9:50, 10:00-10:50…と毎時0分始まりで続きます
                                </p>
                            </FormGroup>
                            <FormGroup label="最大予約数" required>
                                <TextInput
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={data.max_capacity}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "max_capacity",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormGroup>
                        </div>
                    </CardBody>
                </Card>

                {rangeError && (
                    <Card>
                        <CardBody>
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {rangeError}
                            </p>
                        </CardBody>
                    </Card>
                )}

                {/* プレビュー */}
                {!rangeError && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between w-full">
                                <CardTitle>候補プレビュー</CardTitle>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    選択中: {totalSelected}件
                                </span>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {days.length === 0 ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
                                    指定した期間に作成できる候補がありません（営業日がない、または既存の予約枠とすべて重複しています）
                                </p>
                            ) : (
                                <div className="space-y-6">
                                    {days.map((day, dateIndex) => (
                                        <div key={day.date}>
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                                    {day.date}（{day.day_name}）
                                                </h4>
                                                <div className="flex gap-3 text-xs">
                                                    <button
                                                        type="button"
                                                        className="text-indigo-600 hover:underline"
                                                        onClick={() =>
                                                            toggleDay(
                                                                dateIndex,
                                                                true,
                                                            )
                                                        }
                                                    >
                                                        すべて選択
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="text-gray-500 hover:underline"
                                                        onClick={() =>
                                                            toggleDay(
                                                                dateIndex,
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        すべて解除
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {day.rows.map(
                                                    (row, rowIndex) => (
                                                        <div
                                                            key={`${row.date}-${row.start_time}`}
                                                            className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm ${
                                                                row.include
                                                                    ? "border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/30"
                                                                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 opacity-60"
                                                            }`}
                                                        >
                                                            <Checkbox
                                                                checked={
                                                                    row.include
                                                                }
                                                                onChange={() =>
                                                                    toggleRow(
                                                                        dateIndex,
                                                                        rowIndex,
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="time"
                                                                value={
                                                                    row.start_time
                                                                }
                                                                onChange={(e) =>
                                                                    updateRowTime(
                                                                        dateIndex,
                                                                        rowIndex,
                                                                        "start_time",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-24 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs"
                                                            />
                                                            <span className="text-gray-400">
                                                                -
                                                            </span>
                                                            <input
                                                                type="time"
                                                                value={
                                                                    row.end_time
                                                                }
                                                                onChange={(e) =>
                                                                    updateRowTime(
                                                                        dateIndex,
                                                                        rowIndex,
                                                                        "end_time",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-24 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs"
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                )}

                {/* アクション */}
                <div className="flex items-center justify-end gap-3">
                    <Link href={route("admin.appointment-slots.index")}>
                        <SecondaryButton type="button">
                            キャンセル
                        </SecondaryButton>
                    </Link>
                    <PrimaryButton
                        type="button"
                        disabled={processing || totalSelected === 0}
                        onClick={handleSubmit}
                    >
                        {processing
                            ? "作成中..."
                            : `${totalSelected}件の予約枠を作成する`}
                    </PrimaryButton>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
