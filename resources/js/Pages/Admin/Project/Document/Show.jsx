import React, { useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import Modal from "@/Components/Layout/Modal";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badge";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import TextArea from "@/Components/Forms/TextArea";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon, ArrowDownTrayIcon, CheckCircleIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import SectionList from "./_components/SectionList";
import ErDiagramView from "./_components/ErDiagramView";
import { buildErDiagram } from "./_shared/erDiagram";
import { ALLOWED_SECTION_TYPES, DOCUMENT_TYPE_LABELS, VERSION_STATUS_LABELS } from "./_shared/constants";

export default function Show({ project, document }) {
    const [releaseModalOpen, setReleaseModalOpen] = useState(false);
    const [nextRevisionReason, setNextRevisionReason] = useState("");
    const [releasing, setReleasing] = useState(false);

    const currentVersion = document.current_version;
    const allVersions = document.versions || [];
    const releasedVersions = allVersions.filter((v) => v.status === "released");
    const [compareFrom, setCompareFrom] = useState(allVersions[1]?.id || "");
    const [compareTo, setCompareTo] = useState(allVersions[0]?.id || "");
    const sections = currentVersion?.sections || [];
    const allowedTypes = ALLOWED_SECTION_TYPES[document.document_type] || ["text"];
    const hasDbTableSections = sections.some((s) => s.section_type === "db_table");
    const erDiagram = useMemo(() => buildErDiagram(sections), [sections]);

    const breadcrumbs = [
        { label: "プロジェクト", href: route("admin.project.index") },
        { label: project.title, href: route("admin.project.show", project.id) },
        { label: document.display_title },
    ];

    const headerActions = [
        {
            label: "プロジェクトに戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.project.show", project.id),
        },
    ];

    const handleCompare = () => {
        if (!compareFrom || !compareTo || compareFrom === compareTo) return;
        router.get(route("admin.project.documents.compare", [project.id, document.id]), {
            from: compareFrom,
            to: compareTo,
        });
    };

    const handleRelease = () => {
        setReleasing(true);
        router.post(
            route("admin.project.documents.versions.store", [project.id, document.id]),
            { next_revision_reason: nextRevisionReason },
            {
                preserveScroll: true,
                onFinish: () => {
                    setReleasing(false);
                    setReleaseModalOpen(false);
                    setNextRevisionReason("");
                },
            },
        );
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={document.display_title}
                    description={`${DOCUMENT_TYPE_LABELS[document.document_type] || document.document_type} ／ ${project.title}`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={`${document.display_title} - ${project.title}`} />

            <FlashMessage />

            <div className="w-full space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        {currentVersion && (
                            <Badge variant="info">
                                v{currentVersion.version}（{VERSION_STATUS_LABELS[currentVersion.status]}）
                            </Badge>
                        )}
                        {releasedVersions.length > 0 && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                確定版: {releasedVersions.length}件
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {releasedVersions.map((v) => (
                            // Inertia の <Link> はクリックをXHRで横取りしてしまい、
                            // PDFのようなファイルダウンロードでは動作しないため、
                            // ここだけは意図的に素の <a> タグでブラウザに直接遷移させる。
                            <a
                                key={v.id}
                                href={route("admin.project.documents.versions.pdf", [project.id, document.id, v.id])}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
                            >
                                <ArrowDownTrayIcon className="h-4 w-4" />
                                v{v.version} PDF
                            </a>
                        ))}
                        <PrimaryButton
                            onClick={() => setReleaseModalOpen(true)}
                            disabled={!currentVersion || sections.length === 0}
                            icon={CheckCircleIcon}
                        >
                            版を確定
                        </PrimaryButton>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                            セクション
                        </h2>
                    </CardHeader>
                    <CardBody>
                        {currentVersion ? (
                            <SectionList
                                projectId={project.id}
                                documentId={document.id}
                                sections={sections}
                                allowedTypes={allowedTypes}
                            />
                        ) : (
                            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                編集中のバージョンがありません
                            </div>
                        )}
                    </CardBody>
                </Card>

                {hasDbTableSections && (
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                ER図（自動生成）
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                DBテーブル定義セクションのカラム情報から自動生成されます。カラムの「参照先テーブル」を設定すると関連線が引かれます。
                            </p>
                        </CardHeader>
                        <CardBody>
                            <ErDiagramView diagram={erDiagram} />
                        </CardBody>
                    </Card>
                )}

                {allVersions.length >= 2 && (
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                バージョン比較
                            </h2>
                        </CardHeader>
                        <CardBody>
                            <div className="flex flex-wrap items-end gap-3">
                                <div>
                                    <InputLabel htmlFor="compare_from" value="比較元" />
                                    <SelectInput
                                        id="compare_from"
                                        className="mt-1"
                                        value={compareFrom}
                                        onChange={(e) => setCompareFrom(e.target.value)}
                                        options={allVersions.map((v) => ({
                                            value: v.id,
                                            label: `v${v.version}（${VERSION_STATUS_LABELS[v.status]}）`,
                                        }))}
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="compare_to" value="比較先" />
                                    <SelectInput
                                        id="compare_to"
                                        className="mt-1"
                                        value={compareTo}
                                        onChange={(e) => setCompareTo(e.target.value)}
                                        options={allVersions.map((v) => ({
                                            value: v.id,
                                            label: `v${v.version}（${VERSION_STATUS_LABELS[v.status]}）`,
                                        }))}
                                    />
                                </div>
                                <SecondaryButton
                                    onClick={handleCompare}
                                    disabled={!compareFrom || !compareTo || compareFrom === compareTo}
                                    icon={ArrowsRightLeftIcon}
                                >
                                    比較する
                                </SecondaryButton>
                            </div>
                        </CardBody>
                    </Card>
                )}
            </div>

            <Modal show={releaseModalOpen} onClose={() => setReleaseModalOpen(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                        v{currentVersion?.version} を確定しますか？
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        確定すると現在の内容がv{currentVersion?.version}として保存され、PDF出力できるようになります。
                        続けて編集するための新しいドラフト（v{(currentVersion?.version || 0) + 1}）が自動的に作成されます。
                    </p>

                    <InputLabel htmlFor="next_revision_reason" value="次バージョンの改訂理由（任意）" />
                    <TextArea
                        id="next_revision_reason"
                        value={nextRevisionReason}
                        onChange={(e) => setNextRevisionReason(e.target.value)}
                        rows={3}
                        className="mt-1"
                    />

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setReleaseModalOpen(false)}>
                            キャンセル
                        </SecondaryButton>
                        <PrimaryButton onClick={handleRelease} disabled={releasing}>
                            確定する
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AdminAuthenticatedLayout>
    );
}
