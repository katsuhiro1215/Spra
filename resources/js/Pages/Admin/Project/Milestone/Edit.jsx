import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import Form from "./_components/Form";

export default function Edit({ template, milestone }) {
    const { data, setData, put, processing, errors } = useForm({
        milestones: [
            {
                milestone_name: milestone.milestone_name || "",
                description: milestone.description || "",
                order: milestone.order || 0,
            },
        ],
    });

    const handleAddMilestone = () => {
        const newMilestones = [
            ...data.milestones,
            {
                milestone_name: "",
                description: "",
                order: data.milestones.length,
            },
        ];
        setData("milestones", newMilestones);
    };

    const handleRemoveMilestone = (index) => {
        const newMilestones = data.milestones.filter((_, i) => i !== index);
        setData("milestones", newMilestones);
    };

    const handleMilestoneChange = (index, field, value) => {
        const newMilestones = [...data.milestones];
        newMilestones[index] = {
            ...newMilestones[index],
            [field]: value,
        };
        setData("milestones", newMilestones);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(
            route("admin.project.template.milestone.update", [
                template.id,
                milestone.id,
            ]),
        );
    };

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        {
            label: "プロジェクトテンプレート",
            href: route("admin.project.template.index"),
        },
        {
            label: template.name,
            href: route("admin.project.template.show", template.id),
        },
        { label: "マイルストーン編集", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="マイルストーン編集"
                    description={`${milestone.milestone_name} を編集`}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="マイルストーン編集" />

            <FlashMessage />

            <form onSubmit={handleSubmit} className="space-y-6">
                <Form
                    data={data}
                    errors={errors}
                    onMilestoneChange={handleMilestoneChange}
                    onRemoveMilestone={handleRemoveMilestone}
                    onAddMilestone={handleAddMilestone}
                />

                {/* アクションボタン */}
                <div className="flex items-center justify-end gap-4">
                    <a
                        href={route("admin.project.template.show", template.id)}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    >
                        キャンセル
                    </a>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 rounded-lg transition-colors"
                    >
                        {processing ? "更新中..." : "更新"}
                    </button>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
