import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    FormGroup,
    TextInput,
    SelectInput,
    InputError,
    FormTextarea,
} from "@/Components/Forms";
import { INVOICE_STATUS_OPTIONS } from "@/Constants/SelectOptions";

export default function InvoiceForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    isEdit = false,
    contract = null,
    contracts = [],
    users = [],
    companies = [],
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    // 合計金額を計算
    const subtotal = parseFloat(data.subtotal) || 0;
    const taxRate = parseFloat(data.tax_rate) || 0.1;
    const taxAmount = Math.round(subtotal * taxRate);
    const totalAmount = subtotal + taxAmount;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報 */}
            <Card>
                <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {contract ? (
                                <FormGroup
                                    label="契約"
                                    htmlFor="contract_display"
                                >
                                    <div className="pt-3 text-sm font-medium text-gray-900 dark:text-white">
                                        <p className="text-blue-700 dark:text-blue-300">
                                            {contract.contract_number} -{" "}
                                            {contract.title}
                                        </p>
                                    </div>
                                    <input
                                        type="hidden"
                                        name="contract_id"
                                        value={contract.id}
                                    />
                                </FormGroup>
                            ) : (
                                <FormGroup
                                    label="契約"
                                    htmlFor="contract_id"
                                    required
                                >
                                    <SelectInput
                                        id="contract_id"
                                        name="contract_id"
                                        value={data.contract_id || ""}
                                        onChange={(e) =>
                                            setData(
                                                "contract_id",
                                                e.target.value,
                                            )
                                        }
                                        options={[
                                            {
                                                value: "",
                                                label: "選択してください",
                                            },
                                            ...contracts.map((c) => ({
                                                value: c.id,
                                                label: `${c.contract_number || c.id.substring(0, 8)} - ${c.title}`,
                                            })),
                                        ]}
                                        error={errors.contract_id}
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.contract_id}
                                    />
                                </FormGroup>
                            )}

                            <FormGroup
                                label="発行日"
                                htmlFor="issue_date"
                                required
                            >
                                <TextInput
                                    id="issue_date"
                                    name="issue_date"
                                    type="date"
                                    value={
                                        data.issue_date ||
                                        new Date().toISOString().split("T")[0]
                                    }
                                    onChange={(e) =>
                                        setData("issue_date", e.target.value)
                                    }
                                    error={errors.issue_date}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.issue_date}
                                />
                            </FormGroup>

                            <FormGroup
                                label="請求期間（開始）"
                                htmlFor="billing_period_start"
                                required
                            >
                                <TextInput
                                    id="billing_period_start"
                                    name="billing_period_start"
                                    type="date"
                                    value={
                                        data.billing_period_start ||
                                        new Date().toISOString().split("T")[0]
                                    }
                                    onChange={(e) =>
                                        setData(
                                            "billing_period_start",
                                            e.target.value,
                                        )
                                    }
                                    error={errors.billing_period_start}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.billing_period_start}
                                />
                            </FormGroup>

                            <FormGroup
                                label="請求期間（終了）"
                                htmlFor="billing_period_end"
                                required
                            >
                                <TextInput
                                    id="billing_period_end"
                                    name="billing_period_end"
                                    type="date"
                                    value={data.billing_period_end || ""}
                                    onChange={(e) =>
                                        setData(
                                            "billing_period_end",
                                            e.target.value,
                                        )
                                    }
                                    error={errors.billing_period_end}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.billing_period_end}
                                />
                            </FormGroup>

                            <FormGroup
                                label="支払期限"
                                htmlFor="due_date"
                                required
                            >
                                <TextInput
                                    id="due_date"
                                    name="due_date"
                                    type="date"
                                    value={data.due_date || ""}
                                    onChange={(e) =>
                                        setData("due_date", e.target.value)
                                    }
                                    error={errors.due_date}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.due_date}
                                />
                            </FormGroup>

                            <FormGroup
                                label="ステータス"
                                htmlFor="status"
                                required
                            >
                                <SelectInput
                                    id="status"
                                    name="status"
                                    value={data.status || "draft"}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    options={INVOICE_STATUS_OPTIONS}
                                    error={errors.status}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.status}
                                />
                            </FormGroup>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* クライアント情報 */}
            <Card>
                <CardHeader>
                    <CardTitle>クライアント情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormGroup
                                label="ユーザー"
                                htmlFor="user_id"
                                required
                            >
                                <SelectInput
                                    id="user_id"
                                    name="user_id"
                                    value={data.user_id || ""}
                                    onChange={(e) =>
                                        setData("user_id", e.target.value)
                                    }
                                    options={[
                                        {
                                            value: "",
                                            label: "選択してください",
                                        },
                                        ...users.map((u) => ({
                                            value: u.id,
                                            label:
                                                u.profile?.full_name || u.email,
                                        })),
                                    ]}
                                    error={errors.user_id}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.user_id}
                                />
                            </FormGroup>

                            <FormGroup label="会社" htmlFor="company_id">
                                <SelectInput
                                    id="company_id"
                                    name="company_id"
                                    value={data.company_id || ""}
                                    onChange={(e) =>
                                        setData("company_id", e.target.value)
                                    }
                                    options={[
                                        {
                                            value: "",
                                            label: "選択してください",
                                        },
                                        ...companies.map((c) => ({
                                            value: c.id,
                                            label: c.name,
                                        })),
                                    ]}
                                    error={errors.company_id}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.company_id}
                                />
                            </FormGroup>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* 金額情報 */}
            <Card>
                <CardHeader>
                    <CardTitle>金額情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormGroup
                                label="請求額（消費税抜き）"
                                htmlFor="subtotal"
                                required
                            >
                                <TextInput
                                    id="subtotal"
                                    name="subtotal"
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={data.subtotal || 0}
                                    onChange={(e) =>
                                        setData("subtotal", e.target.value)
                                    }
                                    error={errors.subtotal}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.subtotal}
                                />
                            </FormGroup>

                            <FormGroup
                                label="消費税率（%）"
                                htmlFor="tax_rate"
                                required
                            >
                                <TextInput
                                    id="tax_rate"
                                    name="tax_rate"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    value={data.tax_rate || 10}
                                    onChange={(e) =>
                                        setData("tax_rate", e.target.value)
                                    }
                                    error={errors.tax_rate}
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.tax_rate}
                                />
                            </FormGroup>
                        </div>

                        {/* 金額サマリー */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        小計（税抜き）
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {formatAmount(subtotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        消費税（{data.tax_rate || 10}%）
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {formatAmount(taxAmount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        合計
                                    </span>
                                    <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                                        {formatAmount(totalAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 隠し入力で合計を設定 */}
                        <input
                            type="hidden"
                            name="tax_amount"
                            value={taxAmount}
                        />
                        <input
                            type="hidden"
                            name="total_amount"
                            value={totalAmount}
                        />
                    </div>
                </CardBody>
            </Card>

            {/* 備考 */}
            <Card>
                <CardHeader>
                    <CardTitle>備考</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="p-6">
                        <FormGroup label="備考" htmlFor="notes">
                            <FormTextarea
                                id="notes"
                                name="notes"
                                value={data.notes || ""}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                rows={4}
                                placeholder="その他の備考があればこちらに記入してください"
                                error={errors.notes}
                            />
                            <InputError
                                className="mt-2"
                                message={errors.notes}
                            />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            {/* フォーム操作 */}
            <Card>
                <CardBody>
                    <div className="flex justify-end gap-4">
                        <SecondaryButton
                            onClick={() => (window.location.href = cancelRoute)}
                        >
                            キャンセル
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing
                                ? "処理中..."
                                : isEdit
                                  ? "更新する"
                                  : "作成する"}
                        </PrimaryButton>
                    </div>
                </CardBody>
            </Card>
        </form>
    );
}
