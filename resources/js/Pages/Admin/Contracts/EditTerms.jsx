import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody, CardHeader, CardTitle } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    ArrowLeftIcon,
    DocumentTextIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function EditTerms({ contract, templates = [] }) {
    const currentVersion = contract.currentVersion || contract.versions?.[0];

    const { data, setData, post, processing, errors } = useForm({
        terms_and_conditions: currentVersion?.terms_and_conditions || "",
        special_provisions: currentVersion?.special_provisions || "",
        notes: currentVersion?.notes || "",
    });

    const [selectedTemplate, setSelectedTemplate] = useState("");

    const applyTemplate = () => {
        if (!selectedTemplate) return;

        const template = templates.find((t) => t.id === selectedTemplate);
        if (template) {
            setData({
                terms_and_conditions: template.terms_and_conditions || "",
                special_provisions: template.special_provisions || "",
                notes: data.notes, // 備考は上書きしない
            });
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.contract.terms.update", contract.id), {
            onSuccess: () => {
                router.visit(route("admin.contract.show", contract.id));
            },
        });
    };

    const headerActions = [
        {
            label: "戻る",
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contract.show", contract.id),
        },
    ];

    const breadcrumbs = [
        { label: "ダッシュボード", href: "/admin/dashboard" },
        { label: "契約一覧", href: route("admin.contract.index") },
        {
            label: contract.contract_number,
            href: route("admin.contract.show", contract.id),
        },
        { label: "契約条項編集", href: null },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="契約条項の編集"
                    description={`契約書「${contract.contract_number}」の契約条項を編集します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="契約条項の編集" />
            <FlashMessage />

            <div className="max-w-5xl space-y-6">
                {/* テンプレート選択 */}
                <Card>
                    <CardHeader>
                        <CardTitle>📄 契約書テンプレートを使用</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            テンプレートを選択して、標準的な契約条項を適用できます。適用後、必要に応じて修正してください。
                        </p>
                    </CardHeader>
                    <CardBody>
                        <div className="flex gap-3">
                            <select
                                value={selectedTemplate}
                                onChange={(e) =>
                                    setSelectedTemplate(e.target.value)
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                            >
                                <option value="">テンプレートを選択...</option>
                                {templates.map((template) => (
                                    <option
                                        key={template.id}
                                        value={template.id}
                                    >
                                        {template.name} - {template.description}
                                    </option>
                                ))}
                            </select>
                            <SecondaryButton
                                onClick={applyTemplate}
                                disabled={!selectedTemplate}
                            >
                                <DocumentTextIcon className="h-4 w-4 mr-2" />
                                適用
                            </SecondaryButton>
                        </div>
                    </CardBody>
                </Card>

                {/* 契約条項編集フォーム */}
                <Card>
                    <CardHeader>
                        <CardTitle>✍️ 契約条項の記入</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Version {currentVersion?.version || 1}{" "}
                            の契約書テキストを編集しています。
                            下書き状態では何度でも保存できます（バージョンは増えません）。
                        </p>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={submit} className="space-y-6">
                            {/* 契約条項 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    契約条項（甲乙丙などの契約条文）
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    value={data.terms_and_conditions}
                                    onChange={(e) =>
                                        setData(
                                            "terms_and_conditions",
                                            e.target.value,
                                        )
                                    }
                                    rows={15}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 font-mono text-sm"
                                    placeholder={`第1条（目的）\n本契約は、甲と乙の間で行われる...\n\n第2条（契約期間）\n本契約の有効期間は...`}
                                />
                                {errors.terms_and_conditions && (
                                    <div className="mt-1 text-red-600 text-sm">
                                        {errors.terms_and_conditions}
                                    </div>
                                )}
                            </div>

                            {/* 特別条項 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    特別条項
                                </label>
                                <textarea
                                    value={data.special_provisions}
                                    onChange={(e) =>
                                        setData(
                                            "special_provisions",
                                            e.target.value,
                                        )
                                    }
                                    rows={8}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 font-mono text-sm"
                                    placeholder="本契約に規定のない事項については..."
                                />
                                {errors.special_provisions && (
                                    <div className="mt-1 text-red-600 text-sm">
                                        {errors.special_provisions}
                                    </div>
                                )}
                            </div>

                            {/* 備考 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    備考・内部メモ
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                                    placeholder="内部用のメモや注意事項..."
                                />
                                {errors.notes && (
                                    <div className="mt-1 text-red-600 text-sm">
                                        {errors.notes}
                                    </div>
                                )}
                            </div>

                            {/* アクション */}
                            <div className="flex justify-end gap-3">
                                <SecondaryButton
                                    type="button"
                                    onClick={() =>
                                        router.visit(
                                            route(
                                                "admin.contract.show",
                                                contract.id,
                                            ),
                                        )
                                    }
                                >
                                    キャンセル
                                </SecondaryButton>
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                >
                                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                                    保存
                                </PrimaryButton>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
