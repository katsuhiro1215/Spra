import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import Form from "./_components/Form";

export default function Create({ template }) {
    const { data, setData, post, processing, errors } = useForm({
        milestones: [
            {
                milestone_name: "",
                description: "",
                order: 0,
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
        post(route("admin.project.template.milestone.store", template.id));
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
        { label: "マイルストーン作成", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="マイルストーン作成"
                    description={`${template.name} にマイルストーンを追加`}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="マイルストーン作成" />

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
                        {processing ? "作成中..." : "作成"}
                    </button>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
