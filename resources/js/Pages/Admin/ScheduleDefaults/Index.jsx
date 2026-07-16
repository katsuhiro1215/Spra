import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader } from "@/Components/Card";
import { PrimaryButton } from "@/Components/Buttons";
import { FlashMessage } from "@/Components/Notifications";
import DayScheduleCard from "./_components/DayScheduleCard";
import ErrorMessage from "./_components/ErrorMessage";
import {
    PlusIcon,
    ArrowLeftIcon,
    FunnelIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function DefaultSchedule({ auth, schedules }) {
    const { data, setData, post, processing, errors } = useForm({
        schedules: schedules.map((schedule) => ({
            day_of_week: schedule.day_of_week,
            is_open: schedule.is_open || false,
            open_time: schedule.open_time || "09:00",
            close_time: schedule.close_time || "18:00",
            break_start: schedule.break_start || "12:00",
            break_end: schedule.break_end || "13:00",
        })),
    });

    const handleChange = (index, field, value) => {
        const newSchedules = [...data.schedules];
        newSchedules[index] = {
            ...newSchedules[index],
            [field]: value,
        };
        setData("schedules", newSchedules);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.schedules.defaults.bulk-update"), {
            preserveScroll: true,
        });
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.defaults.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.schedules.index"),
        },
    ];

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: PageConfig.defaults.title, href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.defaults.title}
                    description={PageConfig.defaults.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.defaults.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {PageConfig.defaults.labels.sectionTitle}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {PageConfig.defaults.labels.sectionDescription}
                        </p>
                    </CardHeader>

                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <form onSubmit={handleSubmit}>
                            {/* ヒントテキスト */}
                            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-5 w-5 text-blue-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            {
                                                PageConfig.defaults.hints
                                                    .toggleHelp
                                            }
                                        </p>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                            {PageConfig.defaults.hints.saveHelp}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {data.schedules.map((schedule, index) => (
                                    <DayScheduleCard
                                        key={schedule.day_of_week}
                                        schedule={schedule}
                                        dayIndex={index}
                                        onChange={(field, value) =>
                                            handleChange(index, field, value)
                                        }
                                    />
                                ))}
                            </div>

                            {/* エラーメッセージ */}
                            {Object.keys(errors).length > 0 && (
                                <ErrorMessage
                                    errors={Object.values(errors).flat()}
                                />
                            )}

                            {/* 保存ボタン */}
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {processing && (
                                        <span className="flex items-center">
                                            <svg
                                                className="animate-spin h-4 w-4 mr-2"
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
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            保存中...
                                        </span>
                                    )}
                                </div>
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                    loading={processing}
                                >
                                    {PageConfig.defaults.actions.save}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
