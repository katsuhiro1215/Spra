import React, { useMemo } from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Badge } from "@/Components/Badge";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import SectionDiffCard from "./_components/SectionDiffCard";
import { diffDocumentVersions } from "./_shared/diff";
import { VERSION_STATUS_LABELS } from "./_shared/constants";

export default function Compare({ project, document, fromVersion, toVersion }) {
    const diffs = useMemo(() => diffDocumentVersions(fromVersion, toVersion), [fromVersion, toVersion]);
    const changedCount = diffs.filter((d) => d.status !== "unchanged").length;

    const breadcrumbs = [
        { label: "プロジェクト", href: route("admin.project.index") },
        { label: project.title, href: route("admin.project.show", project.id) },
        { label: document.display_title, href: route("admin.project.documents.show", [project.id, document.id]) },
        { label: "バージョン比較" },
    ];

    const headerActions = [
        {
            label: "文書に戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.project.documents.show", [project.id, document.id]),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`バージョン比較: ${document.display_title}`}
                    description={`v${fromVersion.version}（${VERSION_STATUS_LABELS[fromVersion.status]}） → v${toVersion.version}（${VERSION_STATUS_LABELS[toVersion.status]}）`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`バージョン比較 - ${document.display_title}`} />

            <FlashMessage />

            <div className="w-full space-y-4">
                <div className="flex items-center gap-2">
                    <Badge variant={changedCount > 0 ? "warning" : "secondary"}>
                        変更のあるセクション: {changedCount} / {diffs.length}
                    </Badge>
                </div>

                {diffs.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        セクションがありません
                    </div>
                ) : (
                    <div className="space-y-3">
                        {diffs.map((diff) => (
                            <SectionDiffCard key={diff.key} diff={diff} />
                        ))}
                    </div>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
