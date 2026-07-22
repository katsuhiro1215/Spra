import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badge";
import { ChartBarIcon } from "@heroicons/react/24/outline";

const statusConfig = {
    planning: { variant: "default", label: "計画中" },
    design: { variant: "info", label: "デザイン中" },
    development: { variant: "warning", label: "開発中" },
    testing: { variant: "default", label: "テスト中" },
    review: { variant: "info", label: "レビュー中" },
    completed: { variant: "success", label: "完了" },
    on_hold: { variant: "secondary", label: "保留" },
    cancelled: { variant: "secondary", label: "キャンセル" },
};

export default function Index({ projects = [] }) {
    const breadcrumbs = [
        { label: "プロジェクト", href: route("admin.project.index") },
        { label: "ガントチャート" },
    ];

    const getStatusBadge = (status) =>
        statusConfig[status] || { variant: "secondary", label: status };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="ガントチャート"
                    description="ガントチャートを表示するプロジェクトを選択してください"
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="ガントチャート" />

            <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <Card>
                    <CardBody>
                        {projects.length > 0 ? (
                            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                {projects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={route(
                                            "admin.project.gantt.show",
                                            project.id,
                                        )}
                                        className="flex items-center justify-between gap-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 -mx-4 px-4 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <ChartBarIcon className="h-5 w-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                                    {project.title}
                                                </p>
                                                {project.project_code && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-500 font-mono">
                                                        {project.project_code}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <Badge
                                            variant={
                                                getStatusBadge(project.status)
                                                    .variant
                                            }
                                        >
                                            {
                                                getStatusBadge(project.status)
                                                    .label
                                            }
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                プロジェクトがまだありません
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
