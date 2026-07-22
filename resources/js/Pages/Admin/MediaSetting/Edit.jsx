import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { FormGroup, TextInput, SelectInput, Toggle } from "@/Components/Forms";
import { PrimaryButton } from "@/Components/Buttons";
import { CheckIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

const OUTPUT_FORMAT_OPTIONS = [
    { value: "webp", label: "WebP" },
    { value: "jpg", label: "JPEG" },
    { value: "png", label: "PNG" },
];

export default function Edit({ settings }) {
    const { data, setData, put, processing, errors } = useForm({
        max_file_size_kb: settings.max_file_size_kb,
        max_total_storage_mb: settings.max_total_storage_mb,
        auto_compress: settings.auto_compress,
        compression_quality: settings.compression_quality,
        output_format: settings.output_format,
        large_width: settings.large_width,
        large_height: settings.large_height,
        medium_width: settings.medium_width,
        medium_height: settings.medium_height,
        small_width: settings.small_width,
        small_height: settings.small_height,
        generate_large: settings.generate_large,
        generate_medium: settings.generate_medium,
        generate_small: settings.generate_small,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.mediaSettings.update"));
    };

    const headerActions = [
        {
            label: "メディア一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.media.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.mediaSettings.title}
                    description={PageConfig.mediaSettings.description}
                    actions={headerActions}
                    breadcrumbs={PageConfig.mediaSettings.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.mediaSettings.documentTitle} />
            <FlashMessage />

            <div className="max-w-4xl">
                <form onSubmit={submit} className="space-y-6">
                    {/* アップロード制限 */}
                    <Card>
                        <CardHeader>アップロード制限</CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormGroup
                                    label="最大ファイルサイズ（KB）"
                                    htmlFor="max_file_size_kb"
                                    error={errors.max_file_size_kb}
                                >
                                    <TextInput
                                        id="max_file_size_kb"
                                        type="number"
                                        min="1"
                                        value={data.max_file_size_kb}
                                        onChange={(e) =>
                                            setData(
                                                "max_file_size_kb",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </FormGroup>
                                <FormGroup
                                    label="総容量制限（MB）"
                                    htmlFor="max_total_storage_mb"
                                    error={errors.max_total_storage_mb}
                                >
                                    <TextInput
                                        id="max_total_storage_mb"
                                        type="number"
                                        min="1"
                                        value={data.max_total_storage_mb}
                                        onChange={(e) =>
                                            setData(
                                                "max_total_storage_mb",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </FormGroup>
                            </div>
                        </CardBody>
                    </Card>

                    {/* 自動圧縮 */}
                    <Card>
                        <CardHeader>自動圧縮</CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            自動圧縮
                                        </label>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            アップロード時にオリジナル画像を圧縮します
                                        </p>
                                    </div>
                                    <Toggle
                                        enabled={data.auto_compress}
                                        onChange={(value) =>
                                            setData("auto_compress", value)
                                        }
                                        disabled={processing}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormGroup
                                        label="圧縮品質（1-100）"
                                        htmlFor="compression_quality"
                                        error={errors.compression_quality}
                                    >
                                        <TextInput
                                            id="compression_quality"
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={data.compression_quality}
                                            onChange={(e) =>
                                                setData(
                                                    "compression_quality",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </FormGroup>
                                    <FormGroup
                                        label="出力フォーマット"
                                        htmlFor="output_format"
                                        error={errors.output_format}
                                    >
                                        <SelectInput
                                            id="output_format"
                                            value={data.output_format}
                                            onChange={(e) =>
                                                setData(
                                                    "output_format",
                                                    e.target.value,
                                                )
                                            }
                                            options={OUTPUT_FORMAT_OPTIONS}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* 自動生成バリアント */}
                    <Card>
                        <CardHeader>
                            自動生成バリアント（アップロード時にLarge/Medium/Smallを自動生成）
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-6">
                                {[
                                    {
                                        key: "large",
                                        label: "Large",
                                    },
                                    {
                                        key: "medium",
                                        label: "Medium",
                                    },
                                    {
                                        key: "small",
                                        label: "Small",
                                    },
                                ].map(({ key, label }) => (
                                    <div
                                        key={key}
                                        className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {label}を生成
                                            </label>
                                            <Toggle
                                                enabled={
                                                    data[`generate_${key}`]
                                                }
                                                onChange={(value) =>
                                                    setData(
                                                        `generate_${key}`,
                                                        value,
                                                    )
                                                }
                                                disabled={processing}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormGroup
                                                label="幅（px）"
                                                htmlFor={`${key}_width`}
                                                error={errors[`${key}_width`]}
                                            >
                                                <TextInput
                                                    id={`${key}_width`}
                                                    type="number"
                                                    min="1"
                                                    value={data[`${key}_width`]}
                                                    onChange={(e) =>
                                                        setData(
                                                            `${key}_width`,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup
                                                label="高さ（px）"
                                                htmlFor={`${key}_height`}
                                                error={errors[`${key}_height`]}
                                            >
                                                <TextInput
                                                    id={`${key}_height`}
                                                    type="number"
                                                    min="1"
                                                    value={
                                                        data[`${key}_height`]
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            `${key}_height`,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </FormGroup>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    <div className="flex justify-end">
                        <PrimaryButton type="submit" disabled={processing}>
                            <CheckIcon className="h-4 w-4 mr-2" />
                            保存
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminAuthenticatedLayout>
    );
}
