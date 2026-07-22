import { useEffect, useMemo, useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FormGroup, TextInput, SelectInput, Checkbox } from "@/Components/Forms";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

export default function ShiftsBulkCreate({
    admins,
    preview,
    rangeError,
    form,
    maxDays,
}) {
    const { data, setData } = useForm({
        admin_id: form.admin_id || "",
        start_date: form.start_date,
        end_date: form.end_date,
        weekdays: form.weekdays,
        start_time: form.start_time,
        end_time: form.end_time,
    });

    const regeneratePreview = (overrides = {}) => {
        router.get(
            route("admin.attendance.shifts.bulk-create"),
            { ...data, ...overrides },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleFieldChange = (key, value) => {
        setData(key, value);
        regeneratePreview({ [key]: value });
    };

    const toggleWeekday = (day) => {
        const next = data.weekdays.includes(day)
            ? data.weekdays.filter((d) => d !== day)
            : [...data.weekdays, day];
        handleFieldChange("weekdays", next);
    };

    const [rows, setRows] = useState(() => clonePreview(preview));

    useEffect(() => {
        setRows(clonePreview(preview));
    }, [preview]);

    function clonePreview(p) {
        if (!p) return [];
        return p.map((row) => ({ ...row }));
    }

    const totalSelected = useMemo(
        () => rows.filter((row) => row.include).length,
        [rows],
    );

    const toggleRow = (index) => {
        setRows((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], include: !next[index].include };
            return next;
        });
    };

    const updateRowTime = (index, field, value) => {
        setRows((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const shifts = rows
            .filter((row) => row.include)
            .map((row) => ({
                date: row.date,
                start_time: row.start_time,
                end_time: row.end_time,
            }));

        router.post(
            route("admin.attendance.shifts.bulk-store"),
            {
                admin_id: data.admin_id,
                shifts,
            },
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="シフトをまとめて作成"
                    description={`期間と曜日を指定して候補を生成します。確認・調整のうえ保存してください（最大${maxDays}日間まで）`}
                    actions={[
                        {
                            label: "一覧に戻る",
                            icon: ArrowLeftIcon,
                            variant: "ghost",
                            route: route("admin.attendance.shifts.index"),
                        },
                    ]}
                    breadcrumbs={[
                        ...PageConfig.attendance.breadcrumbs,
                        "シフト管理",
                        "まとめて作成",
                    ]}
                />
            }
        >
            <Head title="シフトをまとめて作成" />
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>生成条件</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <FormGroup label="担当者" required>
                                <SelectInput
                                    options={[
                                        { value: "", label: "選択してください" },
                                        ...admins,
                                    ]}
                                    value={data.admin_id}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "admin_id",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormGroup>
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
                            <FormGroup label="開始予定時刻" required>
                                <TextInput
                                    type="time"
                                    value={data.start_time}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "start_time",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormGroup>
                            <FormGroup label="終了予定時刻" required>
                                <TextInput
                                    type="time"
                                    value={data.end_time}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "end_time",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormGroup>
                            <FormGroup label="対象曜日" required>
                                <div className="flex flex-wrap gap-3 pt-2">
                                    {DAY_NAMES.map((name, index) => (
                                        <label
                                            key={index}
                                            className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300"
                                        >
                                            <Checkbox
                                                checked={data.weekdays.includes(
                                                    index,
                                                )}
                                                onChange={() =>
                                                    toggleWeekday(index)
                                                }
                                            />
                                            {name}
                                        </label>
                                    ))}
                                </div>
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
                            {!data.admin_id ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
                                    担当者を選択してください
                                </p>
                            ) : rows.length === 0 ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
                                    指定した期間・曜日に該当する日がありません
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {rows.map((row, index) => (
                                        <div
                                            key={row.date}
                                            className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm ${
                                                row.already_exists
                                                    ? "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 opacity-60"
                                                    : row.include
                                                      ? "border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/30"
                                                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 opacity-60"
                                            }`}
                                        >
                                            <Checkbox
                                                checked={row.include}
                                                disabled={row.already_exists}
                                                onChange={() =>
                                                    toggleRow(index)
                                                }
                                            />
                                            <span className="text-xs w-24">
                                                {row.date}（{row.day_name}）
                                            </span>
                                            <input
                                                type="time"
                                                value={row.start_time}
                                                disabled={row.already_exists}
                                                onChange={(e) =>
                                                    updateRowTime(
                                                        index,
                                                        "start_time",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-24 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs"
                                            />
                                            <span className="text-gray-400 dark:text-gray-500">
                                                -
                                            </span>
                                            <input
                                                type="time"
                                                value={row.end_time}
                                                disabled={row.already_exists}
                                                onChange={(e) =>
                                                    updateRowTime(
                                                        index,
                                                        "end_time",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-24 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs"
                                            />
                                            {row.already_exists && (
                                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                                    登録済み
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                )}

                <div className="flex items-center justify-end gap-3">
                    <Link href={route("admin.attendance.shifts.index")}>
                        <SecondaryButton type="button">
                            キャンセル
                        </SecondaryButton>
                    </Link>
                    <PrimaryButton
                        type="button"
                        disabled={
                            processing || totalSelected === 0 || !data.admin_id
                        }
                        onClick={handleSubmit}
                    >
                        {processing
                            ? "作成中..."
                            : `${totalSelected}件のシフトを作成する`}
                    </PrimaryButton>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
