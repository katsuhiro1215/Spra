import React, { useMemo } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { FormGroup, TextInput, TextArea, InputError } from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

const formatAmount = (amount) =>
    new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(amount || 0);

export default function Create({ draftContracts = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        contract_ids: [],
        title: "",
        description: "",
    });

    const selectedContracts = useMemo(
        () =>
            draftContracts.filter((c) => data.contract_ids.includes(c.id)),
        [data.contract_ids, draftContracts],
    );

    const toggleContract = (id) => {
        setData(
            "contract_ids",
            data.contract_ids.includes(id)
                ? data.contract_ids.filter((cid) => cid !== id)
                : [...data.contract_ids, id],
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.contract-group.store"));
    };

    const headerActions = [
        {
            label: PageConfig.contractGroups.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.contract-group.index"),
        },
    ];

    const breadcrumbs = [
        ...PageConfig.contractGroups.breadcrumbs,
        PageConfig.contractGroups.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.contractGroups.pages.create.title}
                    description="既存の下書き契約を複数選んでグループ化します"
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.contractGroups.pages.create.title} />
            <FlashMessage />

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>グループ情報</CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-4">
                        <FormGroup>
                            <TextInput
                                label="グループ名"
                                placeholder="例: Webサイト制作＋保守運用契約"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.title} />
                        </FormGroup>
                        <FormGroup>
                            <TextArea
                                label="説明（任意）"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows={3}
                            />
                            <InputError message={errors.description} />
                        </FormGroup>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            グループ化する契約を選択（下書き状態のみ）
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        {draftContracts.length === 0 ? (
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                下書き状態の契約書がありません。先に契約書を作成してください。
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {draftContracts.map((contract) => (
                                    <label
                                        key={contract.id}
                                        className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.contract_ids.includes(
                                                contract.id,
                                            )}
                                            onChange={() =>
                                                toggleContract(contract.id)
                                            }
                                            className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {contract.contract_number} -{" "}
                                                {contract.title}
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                {contract.user?.profile
                                                    ?.full_name ||
                                                    contract.user?.email}{" "}
                                                ・
                                                {formatAmount(
                                                    contract.current_version
                                                        ?.total_amount,
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                        <InputError message={errors.contract_ids} />
                        {selectedContracts.length > 0 && (
                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                                {selectedContracts.length}
                                件を選択中（グループの担当ユーザー・会社は最初に選んだ契約から引き継がれます）
                            </p>
                        )}
                    </CardBody>
                </Card>

                <div className="flex gap-3">
                    <PrimaryButton
                        type="submit"
                        disabled={
                            processing || data.contract_ids.length === 0
                        }
                    >
                        {processing ? "作成中..." : "グループを作成"}
                    </PrimaryButton>
                    <SecondaryButton
                        type="button"
                        href={route("admin.contract-group.index")}
                        disabled={processing}
                    >
                        キャンセル
                    </SecondaryButton>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
