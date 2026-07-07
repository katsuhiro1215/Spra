import React, { useState, useMemo } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    InputError,
} from "@/Components/Forms";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Create({ contract, templates, admins }) {
    // ========================================
    // State & Form
    // ========================================
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedMilestones, setSelectedMilestones] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        contract_id: contract?.id || null,
        admin_id: "",
        start_date: new Date().toISOString().split("T")[0],
        estimated_end_date: "",
        template_id: null,
        milestone_ids: [],
    });

    const getFullName = (admin) => {
        return admin.profile
            ? `${admin.profile.last_name} ${admin.profile.first_name}`
            : "-";
    };

    // テンプレート選択時の処理
    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setData("template_id", template.id);
        // 全マイルストーンをデフォルトで選択
        const milestoneIds = template.milestones.map((m) => m.id);
        setSelectedMilestones(milestoneIds);
        setData("milestone_ids", milestoneIds);
    };

    // マイルストーンのチェックボックス切り替え
    const toggleMilestone = (milestoneId) => {
        const updated = selectedMilestones.includes(milestoneId)
            ? selectedMilestones.filter((id) => id !== milestoneId)
            : [...selectedMilestones, milestoneId];
        setSelectedMilestones(updated);
        setData("milestone_ids", updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.project.store"));
    };

    // ========================================
    // Constants - Header Actions & Breadcrumbs
    // ========================================
    const headerActions = [
        {
            label: PageConfig.projects.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.project.index"),
        },
    ];

    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.projects.breadcrumbs,
        PageConfig.projects.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.projects.pages.create.title}
                    description={PageConfig.projects.pages.create.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.projects.pages.create.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 契約情報（表示用） */}
                {contract && (
                    <Card>
                        <CardHeader>
                            <CardTitle>契約情報</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                        契約名
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {contract.title}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                        契約者
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {contract.user?.profile?.name ||
                                            contract.user?.email}
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                )}

                {/* 基本情報入力 */}
                <Card>
                    <CardHeader>
                        <CardTitle>基本情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            <FormGroup
                                label="プロジェクト名"
                                htmlFor="title"
                                required
                            >
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title || ""}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    placeholder="例：Webサイト制作プロジェクト"
                                    error={!!errors.title}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.title}
                                />
                            </FormGroup>

                            <FormGroup
                                label="説明（任意）"
                                htmlFor="description"
                            >
                                <TextArea
                                    id="description"
                                    rows="3"
                                    value={data.description || ""}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.description}
                                />
                            </FormGroup>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormGroup
                                    label="開始予定日"
                                    htmlFor="start_date"
                                    required
                                >
                                    <TextInput
                                        id="start_date"
                                        type="date"
                                        value={data.start_date || ""}
                                        onChange={(e) =>
                                            setData(
                                                "start_date",
                                                e.target.value,
                                            )
                                        }
                                        error={!!errors.start_date}
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.start_date}
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="納期"
                                    htmlFor="estimated_end_date"
                                    required
                                >
                                    <TextInput
                                        id="estimated_end_date"
                                        type="date"
                                        value={data.estimated_end_date || ""}
                                        onChange={(e) =>
                                            setData(
                                                "estimated_end_date",
                                                e.target.value,
                                            )
                                        }
                                        error={!!errors.estimated_end_date}
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.estimated_end_date}
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="担当者"
                                    htmlFor="admin_id"
                                    required
                                >
                                    <SelectInput
                                        id="admin_id"
                                        value={data.admin_id || ""}
                                        onChange={(e) =>
                                            setData("admin_id", e.target.value)
                                        }
                                        error={!!errors.admin_id}
                                    >
                                        <option value="">担当者を選択</option>
                                        {admins.map((admin) => (
                                            <option
                                                key={admin.id}
                                                value={admin.id}
                                            >
                                                {getFullName(admin)} ({admin.email})
                                            </option>
                                        ))}
                                    </SelectInput>
                                    <InputError
                                        className="mt-2"
                                        message={errors.admin_id}
                                    />
                                </FormGroup>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* プロジェクトテンプレート選択 */}
                <Card>
                    <CardHeader>
                        <CardTitle>プロジェクトテンプレート</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    onClick={() =>
                                        handleTemplateSelect(template)
                                    }
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedTemplate?.id === template.id
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
                                    }`}
                                >
                                    <div className="text-2xl mb-2">
                                        {template.icon || "📋"}
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                        {template.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                        {template.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <InputError
                            className="mt-2"
                            message={errors.template_id}
                        />
                    </CardBody>
                </Card>

                {/* テンプレートプレビュー */}
                {selectedTemplate && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                作成される内容 - {selectedTemplate.name}
                            </CardTitle>
                        </CardHeader>
                            <CardBody>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                以下のマイルストーンが自動で作成されます。不要な項目はチェックを外してください。
                            </p>
                            <div className="space-y-2">
                                {selectedTemplate.milestones.map(
                                    (milestone) => (
                                        <div
                                            key={milestone.id}
                                            className="flex items-start"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedMilestones.includes(
                                                    milestone.id,
                                                )}
                                                onChange={() =>
                                                    toggleMilestone(
                                                        milestone.id,
                                                    )
                                                }
                                                className="mt-1 rounded"
                                            />
                                            <div className="ml-3">
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    ■ {milestone.milestone_name}
                                                </p>
                                                {milestone.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {milestone.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </CardBody>
                    </Card>
                )}

                {/* 送信ボタン */}
                <div className="flex justify-end gap-3">
                    <SecondaryButton onClick={() => window.history.back()}>
                        キャンセル
                    </SecondaryButton>
                    <PrimaryButton
                        type="submit"
                        disabled={
                            processing ||
                            !data.title ||
                            !data.admin_id ||
                            !selectedTemplate
                        }
                    >
                        {processing ? "処理中..." : "プロジェクト作成"}
                    </PrimaryButton>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
