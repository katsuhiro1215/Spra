import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { InputLabel, TextInput, InputError } from "@/Components/Forms";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Create({
    appointmentSlot,
    availableSlots,
    companies,
    projects,
}) {
    const [filteredProjects, setFilteredProjects] = useState(projects);

    const { data, setData, post, processing, errors } = useForm({
        appointment_slot_id: appointmentSlot?.id || "",
        company_id: "",
        project_id: "",
        subject: "",
        description: "",
        client_notes: "",
        send_reminder: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.appointments.store"));
    };

    // 企業選択時にプロジェクトをフィルター
    const handleCompanyChange = (companyId) => {
        setData({
            ...data,
            company_id: companyId,
            project_id: "", // プロジェクトをリセット
        });

        if (companyId) {
            setFilteredProjects(
                projects.filter((p) => p.company_id === parseInt(companyId)),
            );
        } else {
            setFilteredProjects(projects);
        }
    };

    // 予約枠選択時の情報表示
    const selectedSlot = availableSlots.find(
        (s) => s.value === parseInt(data.appointment_slot_id),
    );

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.appointments.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.appointments.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.appointments.breadcrumbs,
        PageConfig.appointments.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.appointments.pages.create.title}
                    description={
                        PageConfig.appointments.pages.create.description
                    }
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.appointments.pages.create.title} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full sm:max-w-7xl lg:max-w-4xl">
                <Card>
                    <form onSubmit={submit} className="space-y-6">
                        {/* 予約枠選択 */}
                        <div>
                            <InputLabel
                                htmlFor="appointment_slot_id"
                                value="予約枠 *"
                                required
                            />
                            <select
                                id="appointment_slot_id"
                                value={data.appointment_slot_id}
                                onChange={(e) =>
                                    setData(
                                        "appointment_slot_id",
                                        e.target.value,
                                    )
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            >
                                <option value="">予約枠を選択</option>
                                {availableSlots.map((slot) => (
                                    <option key={slot.value} value={slot.value}>
                                        {slot.label}
                                    </option>
                                ))}
                            </select>
                            {selectedSlot && selectedSlot.assigned_admin && (
                                <p className="mt-1 text-sm text-gray-500">
                                    担当者: {selectedSlot.assigned_admin.name}
                                </p>
                            )}
                            <InputError
                                message={errors.appointment_slot_id}
                                className="mt-2"
                            />
                        </div>

                        {/* 企業選択 */}
                        <div>
                            <InputLabel htmlFor="company_id" value="企業" />
                            <select
                                id="company_id"
                                value={data.company_id}
                                onChange={(e) =>
                                    handleCompanyChange(e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">選択なし</option>
                                {companies.map((company) => (
                                    <option
                                        key={company.value}
                                        value={company.value}
                                    >
                                        {company.label}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.company_id}
                                className="mt-2"
                            />
                        </div>

                        {/* プロジェクト選択 */}
                        <div>
                            <InputLabel
                                htmlFor="project_id"
                                value="プロジェクト"
                            />
                            <select
                                id="project_id"
                                value={data.project_id}
                                onChange={(e) =>
                                    setData("project_id", e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                disabled={!data.company_id}
                            >
                                <option value="">選択なし</option>
                                {filteredProjects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                            {!data.company_id && (
                                <p className="mt-1 text-sm text-gray-500">
                                    企業を選択するとプロジェクトが表示されます
                                </p>
                            )}
                            <InputError
                                message={errors.project_id}
                                className="mt-2"
                            />
                        </div>

                        {/* 件名 */}
                        <div>
                            <InputLabel
                                htmlFor="subject"
                                value="件名 *"
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
                                placeholder="例: プロジェクト進捗会、初回打ち合わせ"
                                required
                            />
                            <InputError
                                message={errors.subject}
                                className="mt-2"
                            />
                        </div>

                        {/* 詳細説明 */}
                        <div>
                            <InputLabel
                                htmlFor="description"
                                value="詳細説明"
                            />
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows="4"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="予約に関する詳細情報を記入してください"
                            />
                            <InputError
                                message={errors.description}
                                className="mt-2"
                            />
                        </div>

                        {/* クライアント向けメモ */}
                        <div>
                            <InputLabel
                                htmlFor="client_notes"
                                value="クライアント向けメモ"
                            />
                            <textarea
                                id="client_notes"
                                value={data.client_notes}
                                onChange={(e) =>
                                    setData("client_notes", e.target.value)
                                }
                                rows="3"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="クライアントと共有するメモや注意事項"
                            />
                            <InputError
                                message={errors.client_notes}
                                className="mt-2"
                            />
                        </div>

                        {/* リマインダー送信 */}
                        <div className="flex items-center">
                            <input
                                id="send_reminder"
                                type="checkbox"
                                checked={data.send_reminder}
                                onChange={(e) =>
                                    setData("send_reminder", e.target.checked)
                                }
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <InputLabel
                                htmlFor="send_reminder"
                                value="予約のリマインダーを送信する"
                                className="ml-2 mb-0"
                            />
                        </div>
                        <InputError
                            message={errors.send_reminder}
                            className="mt-2"
                        />

                        {/* アクションボタン */}
                        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                            <Link href={route("admin.appointments.index")}>
                                <SecondaryButton type="button">
                                    キャンセル
                                </SecondaryButton>
                            </Link>
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? "作成中..." : "作成"}
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
