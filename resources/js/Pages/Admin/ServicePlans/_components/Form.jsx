import React, { useState } from "react";
import { Card, CardTitle, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    NumberInput,
    ColorInput,
    Checkbox,
    InputError,
} from "@/Components/Forms";
import { StoreButton, SecondaryButton } from "@/Components/Buttons";

const ServicePlanForm = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    statuses,
    billingCycles,
    services,
    mode = "create",
}) => {
    const [autoSlug, setAutoSlug] = useState(mode === "create");

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim("-");
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setData("name", name);

        if (autoSlug) {
            setData("slug", generateSlug(name));
        }
    };

    const handleSlugChange = (e) => {
        setData("slug", e.target.value);
        setAutoSlug(false);
    };

    const handleAutoGenerateSlug = () => {
        setAutoSlug(true);
        setData("slug", generateSlug(data.name));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>基本情報</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* プラン名 */}
                                    <FormGroup
                                        label="プラン名"
                                        required
                                        error={errors.name}
                                    >
                                        <TextInput
                                            value={data.name}
                                            onChange={handleNameChange}
                                            placeholder="例: スタンダードプラン"
                                        />
                                    </FormGroup>

                                    {/* スラッグ */}
                                    <FormGroup
                                        label="スラッグ"
                                        error={errors.slug}
                                    >
                                        <div className="flex gap-2">
                                            <TextInput
                                                value={data.slug}
                                                onChange={handleSlugChange}
                                                placeholder="例: standard-plan"
                                            />
                                            <button
                                                type="button"
                                                onClick={
                                                    handleAutoGenerateSlug
                                                }
                                                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 whitespace-nowrap"
                                            >
                                                自動生成
                                            </button>
                                        </div>
                                    </FormGroup>

                                    {/* サービス選択 */}
                                    <FormGroup
                                        label="サービス"
                                        required
                                        error={errors.service_id}
                                    >
                                        <SelectInput
                                            value={data.service_id}
                                            onChange={(e) =>
                                                setData(
                                                    "service_id",
                                                    e.target.value,
                                                )
                                            }
                                            options={services.map(
                                                (service) => ({
                                                    value: service.id,
                                                    label: service.name,
                                                }),
                                            )}
                                        >
                                            <option value="">
                                                選択してください
                                            </option>
                                        </SelectInput>
                                    </FormGroup>

                                    {/* ステータス */}
                                    <FormGroup
                                        label="ステータス"
                                        required
                                        error={errors.status}
                                    >
                                        <SelectInput
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value,
                                                )
                                            }
                                            options={statuses.map(
                                                (status) => ({
                                                    value: status.value,
                                                    label: status.label,
                                                }),
                                            )}
                                        />
                                    </FormGroup>
                                </div>
                                {/* 説明 */}
                                <FormGroup
                                    label="説明"
                                    error={errors.description}
                                >
                                    <TextArea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        rows={3}
                                        placeholder="プランの簡潔な説明"
                                    />
                                </FormGroup>
                                {/* 詳細説明 */}
                                <FormGroup
                                    label="詳細説明"
                                    error={errors.details}
                                >
                                    <TextArea
                                        value={data.details}
                                        onChange={(e) =>
                                            setData(
                                                "details",
                                                e.target.value,
                                            )
                                        }
                                        rows={5}
                                        placeholder="プランの詳細な説明"
                                    />
                                </FormGroup>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>料金設定</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 基本料金 */}
                                <FormGroup
                                    label="基本料金 (円)"
                                    required
                                    error={errors.base_price}
                                >
                                    <NumberInput
                                        value={data.base_price}
                                        onChange={(value) =>
                                            setData("base_price", value)
                                        }
                                        min={0}
                                        step={1000}
                                        placeholder="100000"
                                    />
                                </FormGroup>

                                {/* 請求サイクル */}
                                <FormGroup
                                    label="請求サイクル"
                                    required
                                    error={errors.billing_cycle}
                                >
                                    <SelectInput
                                        value={data.billing_cycle}
                                        onChange={(e) =>
                                            setData(
                                                "billing_cycle",
                                                e.target.value,
                                            )
                                        }
                                        options={billingCycles.map(
                                            (cycle) => ({
                                                value: cycle.value,
                                                label: cycle.label,
                                            }),
                                        )}
                                    />
                                </FormGroup>

                                {/* 初期費用 */}
                                <FormGroup
                                    label="初期費用 (円)"
                                    error={errors.setup_fee}
                                >
                                    <NumberInput
                                        value={data.setup_fee}
                                        onChange={(value) =>
                                            setData("setup_fee", value)
                                        }
                                        min={0}
                                        step={1000}
                                        placeholder="0"
                                    />
                                </FormGroup>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>プラン詳細</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 最大修正回数 */}
                                <FormGroup
                                    label="最大修正回数"
                                    error={errors.max_revisions}
                                >
                                    <NumberInput
                                        value={data.max_revisions}
                                        onChange={(value) =>
                                            setData("max_revisions", value)
                                        }
                                        min={0}
                                        step={1}
                                        placeholder="3"
                                    />
                                </FormGroup>

                                {/* 納期目安 */}
                                <FormGroup
                                    label="納期目安 (日)"
                                    error={errors.estimated_delivery_days}
                                >
                                    <NumberInput
                                        value={data.estimated_delivery_days}
                                        onChange={(value) =>
                                            setData(
                                                "estimated_delivery_days",
                                                value,
                                            )
                                        }
                                        min={0}
                                        step={1}
                                        placeholder="30"
                                    />
                                </FormGroup>

                                {/* チケット繰越上限 */}
                                <FormGroup
                                    label="チケット繰越上限（枚）"
                                    error={errors.max_carryover_tickets}
                                    className="md:col-span-2"
                                >
                                    <NumberInput
                                        value={data.max_carryover_tickets}
                                        onChange={(value) =>
                                            setData(
                                                "max_carryover_tickets",
                                                value,
                                            )
                                        }
                                        min={0}
                                        step={1}
                                        placeholder="未設定（繰越不可）"
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        契約特典（ミーティングチケット）を翌期間へ繰り越せる上限枚数です。空欄の場合は繰越されません（残数は失効）。
                                    </p>
                                </FormGroup>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>表示設定</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 表示順 */}
                                <FormGroup
                                    label="表示順"
                                    error={errors.sort_order}
                                >
                                    <NumberInput
                                        value={data.sort_order}
                                        onChange={(value) =>
                                            setData("sort_order", value)
                                        }
                                        min={0}
                                        step={1}
                                        placeholder="0"
                                    />
                                </FormGroup>

                                {/* 注目プラン */}
                                <div>
                                    <label className="flex items-center mt-6">
                                        <Checkbox
                                            checked={data.is_featured}
                                            onChange={(e) =>
                                                setData(
                                                    "is_featured",
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            注目プラン
                                        </span>
                                    </label>
                                </div>

                                {/* Web公開 */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center mt-6">
                                        <Checkbox
                                            checked={data.is_displayed ?? true}
                                            onChange={(e) =>
                                                setData(
                                                    "is_displayed",
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            Webサイト・見積もりシミュレーターに表示する
                                        </span>
                                    </label>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        チェックを外すと、このプランは公開サイトやシミュレーターに表示されなくなります（管理画面では引き続き操作できます）
                                    </p>
                                    <InputError
                                        message={errors.is_displayed}
                                    />
                                </div>

                                {/* カラー */}
                                <FormGroup
                                    label="カラー"
                                    error={errors.color}
                                >
                                    <ColorInput
                                        value={data.color}
                                        onChange={(color) =>
                                            setData("color", color)
                                        }
                                    />
                                </FormGroup>

                                {/* バッジテキスト */}
                                <FormGroup
                                    label="バッジテキスト"
                                    error={errors.badge_text}
                                >
                                    <TextInput
                                        value={data.badge_text}
                                        onChange={(e) =>
                                            setData(
                                                "badge_text",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="おすすめ"
                                    />
                                </FormGroup>

                                {/* アイコン */}
                                <FormGroup
                                    label="アイコン"
                                    error={errors.icon}
                                >
                                    <TextInput
                                        value={data.icon}
                                        onChange={(e) =>
                                            setData("icon", e.target.value)
                                        }
                                        placeholder="例: RocketLaunchIcon"
                                    />
                                </FormGroup>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* アクション */}
                <div className="flex items-center justify-end gap-4">
                    <SecondaryButton href={cancelRoute} disabled={processing}>
                        キャンセル
                    </SecondaryButton>
                    <StoreButton
                        type="submit"
                        processing={processing}
                        disabled={processing}
                    >
                        {mode === "edit" ? "更新" : "作成"}
                    </StoreButton>
                </div>
            </div>
        </form>
    );
};

export default ServicePlanForm;
