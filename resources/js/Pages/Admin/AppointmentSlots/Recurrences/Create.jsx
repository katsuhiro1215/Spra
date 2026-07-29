import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FormGroup, TextInput, SelectInput, TextArea } from "@/Components/Forms";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const DAY_OPTIONS = [
    { value: "0", label: "日曜日" },
    { value: "1", label: "月曜日" },
    { value: "2", label: "火曜日" },
    { value: "3", label: "水曜日" },
    { value: "4", label: "木曜日" },
    { value: "5", label: "金曜日" },
    { value: "6", label: "土曜日" },
];

const SLOT_TYPE_OPTIONS = [
    { value: "meeting", label: "面談" },
    { value: "progress_review", label: "進捗会" },
    { value: "consultation", label: "相談" },
    { value: "other", label: "その他" },
];

export default function Create({ admins = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        day_of_week: "2",
        start_time: "",
        end_time: "",
        slot_type: "meeting",
        max_capacity: 1,
        assigned_admin_id: "",
        starts_on: "",
        ends_on: "",
        notes: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.appointment-slot-recurrences.store"));
    };

    const breadcrumbs = [
        { label: "ホーム" },
        { label: "スケジュール管理" },
        {
            label: "予約枠の繰り返し設定",
            href: route("admin.appointment-slot-recurrences.index"),
        },
        { label: "新規作成" },
    ];

    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.appointment-slot-recurrences.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="繰り返し予約枠を作成"
                    description="毎週決まった曜日・時間の予約枠を自動生成します"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="繰り返し予約枠を作成" />

            <FlashMessage />

            <div className="w-full sm:max-w-7xl lg:max-w-4xl">
                <Card>
                    <CardBody>
                        <form onSubmit={submit} className="space-y-6">
                            <FormGroup
                                label="曜日"
                                htmlFor="day_of_week"
                                required
                                error={errors.day_of_week}
                            >
                                <SelectInput
                                    id="day_of_week"
                                    value={data.day_of_week}
                                    onChange={(e) =>
                                        setData("day_of_week", e.target.value)
                                    }
                                    options={DAY_OPTIONS}
                                    required
                                />
                            </FormGroup>

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
                                            setData("start_time", e.target.value)
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
                                            setData("end_time", e.target.value)
                                        }
                                        required
                                    />
                                </FormGroup>
                            </div>

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
                                    options={SLOT_TYPE_OPTIONS}
                                    required
                                />
                            </FormGroup>

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
                                        setData("max_capacity", e.target.value)
                                    }
                                    required
                                />
                            </FormGroup>

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

                            <div className="grid grid-cols-2 gap-4">
                                <FormGroup
                                    label="繰り返し開始日"
                                    htmlFor="starts_on"
                                    required
                                    error={errors.starts_on}
                                >
                                    <TextInput
                                        id="starts_on"
                                        type="date"
                                        value={data.starts_on}
                                        onChange={(e) =>
                                            setData("starts_on", e.target.value)
                                        }
                                        required
                                    />
                                </FormGroup>
                                <FormGroup
                                    label="繰り返し終了日"
                                    htmlFor="ends_on"
                                    error={errors.ends_on}
                                >
                                    <TextInput
                                        id="ends_on"
                                        type="date"
                                        value={data.ends_on}
                                        onChange={(e) =>
                                            setData("ends_on", e.target.value)
                                        }
                                    />
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        未指定の場合は無期限（90日先まで先行生成し、以降は自動で継ぎ足されます）
                                    </p>
                                </FormGroup>
                            </div>

                            <FormGroup label="メモ" htmlFor="notes" error={errors.notes}>
                                <TextArea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    rows={4}
                                />
                            </FormGroup>

                            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route(
                                        "admin.appointment-slot-recurrences.index",
                                    )}
                                >
                                    <SecondaryButton type="button">
                                        キャンセル
                                    </SecondaryButton>
                                </Link>
                                <PrimaryButton type="submit" disabled={processing}>
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
