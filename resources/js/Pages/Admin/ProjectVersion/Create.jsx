import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    Checkbox,
    InputError,
} from "@/Components/Forms";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const statusOptions = [
    { value: "draft", label: "下書き" },
    { value: "approved", label: "承認済み" },
    { value: "active", label: "有効" },
    { value: "superseded", label: "置き換え済み" },
    { value: "cancelled", label: "キャンセル" },
];

export default function Create({
    project,
    currentVersion,
    contractItems = [],
}) {
    const [copyFromCurrent, setCopyFromCurrent] = useState(false);
    const [importFromContract, setImportFromContract] = useState(false);
    const [autoGenerateMilestones, setAutoGenerateMilestones] = useState(true);

    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        start_date: project?.start_date || "",
        estimated_end_date: project?.estimated_end_date || "",
        total_estimated_hours: "",
        status: "draft",
        revision_reason: "",
        copy_from_current: false,
        import_from_contract: false,
        auto_generate_milestones: true,
        milestone_count: 3,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.project.versions.store", project.id));
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="新規バージョン作成"
                    description={`${project.title} の新しいバージョンを作成します`}
                    actions={[
                        {
                            label: "戻る",
                            icon: ArrowLeftIcon,
                            variant: "ghost",
                            route: route(
                                "admin.project.versions.index",
                                project.id,
                            ),
                        },
                    ]}
                    breadcrumbs={[
                        { label: "ダッシュボード", href: "/admin/dashboard" },
                        {
                            label: "プロジェクト",
                            href: route("admin.project.index"),
                        },
                        {
                            label: project.title,
                            href: route("admin.project.show", project.id),
                        },
                        {
                            label: "バージョン",
                            href: route(
                                "admin.project.versions.index",
                                project.id,
                            ),
                        },
                        { label: "新規作成", href: null },
                    ]}
                />
            }
        >
            <Head title="新規バージョン作成" />

            <FlashMessage />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* プロジェクト情報 */}
                <Card>
                    <CardHeader>
                        <CardTitle>プロジェクト情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    プロジェクト名
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {project.title}
                                </p>
                            </div>
                            {currentVersion && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                        現在のバージョン
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        v{currentVersion.version} -{" "}
                                        {currentVersion.title}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>

                {/* バージョン情報入力 */}
                <Card>
                    <CardHeader>
                        <CardTitle>バージョン情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            <FormGroup
                                label="タイトル"
                                htmlFor="title"
                                required
                            >
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    placeholder="例：リリース v1.0"
                                    error={!!errors.title}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.title}
                                />
                            </FormGroup>

                            <FormGroup label="説明" htmlFor="description">
                                <TextArea
                                    id="description"
                                    rows="3"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    placeholder="このバージョンの説明を入力してください"
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
                                >
                                    <TextInput
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) =>
                                            setData(
                                                "start_date",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.start_date}
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="納期"
                                    htmlFor="estimated_end_date"
                                >
                                    <TextInput
                                        id="estimated_end_date"
                                        type="date"
                                        value={data.estimated_end_date}
                                        onChange={(e) =>
                                            setData(
                                                "estimated_end_date",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.estimated_end_date}
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="見積もり時間"
                                    htmlFor="total_estimated_hours"
                                >
                                    <TextInput
                                        id="total_estimated_hours"
                                        type="number"
                                        value={data.total_estimated_hours}
                                        onChange={(e) =>
                                            setData(
                                                "total_estimated_hours",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="時間単位"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.total_estimated_hours}
                                    />
                                </FormGroup>
                            </div>

                            <FormGroup
                                label="ステータス"
                                htmlFor="status"
                                required
                            >
                                <SelectInput
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                >
                                    <option value="">ステータスを選択</option>
                                    {statusOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </SelectInput>
                                <InputError
                                    className="mt-2"
                                    message={errors.status}
                                />
                            </FormGroup>

                            <FormGroup
                                label="修正理由"
                                htmlFor="revision_reason"
                            >
                                <TextArea
                                    id="revision_reason"
                                    rows="2"
                                    value={data.revision_reason}
                                    onChange={(e) =>
                                        setData(
                                            "revision_reason",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="このバージョンが作成された理由を記入してください"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.revision_reason}
                                />
                            </FormGroup>
                        </div>
                    </CardBody>
                </Card>

                {/* 現在のバージョンからコピー */}
                {currentVersion && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                マイルストーン・アイテムの引継ぎ
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Checkbox
                                checked={data.copy_from_current}
                                onChange={(e) => {
                                    setData(
                                        "copy_from_current",
                                        e.target.checked,
                                    );
                                    if (e.target.checked) {
                                        setData("import_from_contract", false);
                                    }
                                }}
                                label="現在のバージョン（v1）からマイルストーン・アイテムをコピーします"
                                description="有効にすると、現在のバージョンのマイルストーンと全アイテムが新しいバージョンにコピーされます"
                            />
                        </CardBody>
                    </Card>
                )}

                {/* ContractItemから取り込み */}
                {contractItems.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>ContractItemから取り込み</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Checkbox
                                checked={data.import_from_contract}
                                onChange={(e) => {
                                    setData(
                                        "import_from_contract",
                                        e.target.checked,
                                    );
                                    if (e.target.checked) {
                                        setData("copy_from_current", false);
                                    }
                                }}
                                label={`契約アイテムから取り込む（${contractItems.length}件）`}
                                description="有効にすると、契約アイテムがProjectItemとして自動的に追加されます。期間は均等に分割されます。"
                            />

                            {data.import_from_contract && (
                                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                        取り込まれるアイテム一覧
                                    </p>
                                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                        {contractItems.map((item, index) => (
                                            <li key={item.id}>
                                                {index + 1}. {item.name}
                                                {item.estimated_days && (
                                                    <span className="ml-2 text-xs">
                                                        （見積:{" "}
                                                        {item.estimated_days}
                                                        日）
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                )}

                {/* マイルストーン自動生成 */}
                <Card>
                    <CardHeader>
                        <CardTitle>マイルストーン自動生成</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            <Checkbox
                                checked={data.auto_generate_milestones}
                                onChange={(e) =>
                                    setData(
                                        "auto_generate_milestones",
                                        e.target.checked,
                                    )
                                }
                                label="フェーズごとにマイルストーンを自動生成する"
                                description="プロジェクト期間を均等に分割してマイルストーンを自動作成します"
                            />

                            {data.auto_generate_milestones && (
                                <FormGroup
                                    label="マイルストーン数"
                                    htmlFor="milestone_count"
                                >
                                    <SelectInput
                                        id="milestone_count"
                                        value={data.milestone_count}
                                        onChange={(e) =>
                                            setData(
                                                "milestone_count",
                                                parseInt(e.target.value),
                                            )
                                        }
                                    >
                                        <option value="2">2フェーズ</option>
                                        <option value="3">3フェーズ</option>
                                        <option value="4">4フェーズ</option>
                                        <option value="5">5フェーズ</option>
                                        <option value="6">6フェーズ</option>
                                    </SelectInput>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        例: 要件定義・設計 → 開発 → テスト →
                                        リリース
                                    </p>
                                    <InputError
                                        className="mt-2"
                                        message={errors.milestone_count}
                                    />
                                </FormGroup>
                            )}
                        </div>
                    </CardBody>
                </Card>

                {/* 送信ボタン */}
                <div className="flex justify-end gap-3">
                    <SecondaryButton onClick={() => window.history.back()}>
                        キャンセル
                    </SecondaryButton>
                    <PrimaryButton
                        type="submit"
                        disabled={processing || !data.title}
                    >
                        {processing ? "処理中..." : "バージョン作成"}
                    </PrimaryButton>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
