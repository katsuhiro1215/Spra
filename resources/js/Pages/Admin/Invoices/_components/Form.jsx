import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    FormGroup,
    TextInput,
    SelectInput,
    FormTextarea,
} from "@/Components/Forms";
import {
    INVOICE_STATUS_OPTIONS,
    INVOICE_TYPE_OPTIONS,
} from "@/Constants/SelectOptions";

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
    remainingAmount = null,
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    // 選択中の会社に所属するユーザーに絞り込む。会社未選択の場合は全ユーザーから選べるようにする
    const selectedCompany = companies.find((c) => c.id === data.company_id);
    const companyUsers = selectedCompany?.users || [];
    const userChoices = companyUsers.length > 0 ? companyUsers : users;

    const userLabel = (u) =>
        (u.profile?.full_name || u.email) +
        (u.pivot?.is_primary ? "（主担当）" : "");

    // 会社を変更したら、その会社の主担当者をユーザーの初期値として設定する
    const handleCompanyChange = (companyId) => {
        const company = companies.find((c) => c.id === companyId);
        const primaryUser = company?.users?.find((u) => u.pivot?.is_primary);
        setData((prev) => ({
            ...prev,
            company_id: companyId,
            user_id: primaryUser?.id || company?.users?.[0]?.id || "",
        }));
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    // 合計金額を計算（tax_rate はパーセント表記、例: 10 = 10%）
    const subtotal = parseFloat(data.subtotal) || 0;
    const taxRate = parseFloat(data.tax_rate) || 0;
    const taxAmount = Math.round(subtotal * (taxRate / 100));
    const totalAmount = subtotal + taxAmount;

    // 契約に紐づく請求書の場合、契約の残金（税込）を超えていないかチェックする
    // remainingAmount が null の場合は継続契約(月額/年額)など残金の概念が無いケース
    const hasRemainingCap = remainingAmount !== null;
    const noRemainingLeft = hasRemainingCap && remainingAmount <= 0;
    const exceedsRemaining =
        hasRemainingCap && !noRemainingLeft && totalAmount > remainingAmount;

    // 送信されるデータ（data.tax_amount / data.total_amount）を計算結果と同期する。
    // useForm の data はサーバーへ送信される唯一の値なので、ここで同期しないと
    // 画面表示上は正しい合計でも 0 円で送信されてしまう。
    useEffect(() => {
        if (data.tax_amount !== taxAmount) {
            setData("tax_amount", taxAmount);
        }
        if (data.total_amount !== totalAmount) {
            setData("total_amount", totalAmount);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subtotal, taxRate]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {noRemainingLeft && (
                <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 p-4">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                        この契約は既に契約金額の全額を請求済みです。新しい請求書は作成できません。
                    </p>
                </div>
            )}

            {/* 基本情報 */}
            <Card>
                <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="space-y-6">
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
                                    error={errors.contract_id}
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
                                    />
                                </FormGroup>
                            )}

                            <FormGroup
                                label="発行日"
                                htmlFor="issue_date"
                                required
                                error={errors.issue_date}
                            >
                                <TextInput
                                    id="issue_date"
                                    name="issue_date"
                                    type="date"
                                    value={
                                        data.issue_date ||
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    onChange={(e) =>
                                        setData(
                                            "issue_date",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormGroup>

                            <FormGroup
                                label="請求期間（開始）"
                                htmlFor="billing_period_start"
                                required
                                error={errors.billing_period_start}
                            >
                                <TextInput
                                    id="billing_period_start"
                                    name="billing_period_start"
                                    type="date"
                                    value={
                                        data.billing_period_start ||
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    onChange={(e) =>
                                        setData(
                                            "billing_period_start",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormGroup>

                            <FormGroup
                                label="請求期間（終了）"
                                htmlFor="billing_period_end"
                                required
                                error={errors.billing_period_end}
                            >
                                <TextInput
                                    id="billing_period_end"
                                    name="billing_period_end"
                                    type="date"
                                    value={
                                        data.billing_period_end || ""
                                    }
                                    onChange={(e) =>
                                        setData(
                                            "billing_period_end",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormGroup>

                            <FormGroup
                                label="支払期限"
                                htmlFor="due_date"
                                required
                                error={errors.due_date}
                            >
                                <TextInput
                                    id="due_date"
                                    name="due_date"
                                    type="date"
                                    value={data.due_date || ""}
                                    onChange={(e) =>
                                        setData(
                                            "due_date",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormGroup>

                            <FormGroup
                                label="ステータス"
                                htmlFor="status"
                                required
                                error={errors.status}
                            >
                                <SelectInput
                                    id="status"
                                    name="status"
                                    value={data.status || "draft"}
                                    onChange={(e) =>
                                        setData(
                                            "status",
                                            e.target.value,
                                        )
                                    }
                                    options={INVOICE_STATUS_OPTIONS}
                                />
                            </FormGroup>

                            <FormGroup
                                label="請求区分"
                                htmlFor="invoice_type"
                                error={errors.invoice_type}
                            >
                                <SelectInput
                                    id="invoice_type"
                                    name="invoice_type"
                                    value={data.invoice_type || "full"}
                                    onChange={(e) =>
                                        setData(
                                            "invoice_type",
                                            e.target.value,
                                        )
                                    }
                                    options={INVOICE_TYPE_OPTIONS}
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
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormGroup
                                label="会社"
                                htmlFor="company_id"
                                error={errors.company_id}
                            >
                                <SelectInput
                                    id="company_id"
                                    name="company_id"
                                    value={data.company_id || ""}
                                    onChange={(e) =>
                                        handleCompanyChange(e.target.value)
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
                                />
                            </FormGroup>

                            <FormGroup
                                label="送付先ユーザー"
                                htmlFor="user_id"
                                required
                                error={errors.user_id}
                            >
                                <SelectInput
                                    id="user_id"
                                    name="user_id"
                                    value={data.user_id || ""}
                                    onChange={(e) =>
                                        setData(
                                            "user_id",
                                            e.target.value,
                                        )
                                    }
                                    options={[
                                        {
                                            value: "",
                                            label: "選択してください",
                                        },
                                        ...userChoices.map((u) => ({
                                            value: u.id,
                                            label: userLabel(u),
                                        })),
                                    ]}
                                />
                                {companyUsers.length > 0 && (
                                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                                        この会社に所属するユーザーから選択できます
                                    </p>
                                )}
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
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormGroup
                                label="請求額（消費税抜き）"
                                htmlFor="subtotal"
                                required
                                error={errors.subtotal}
                            >
                                <TextInput
                                    id="subtotal"
                                    name="subtotal"
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={data.subtotal || 0}
                                    onChange={(e) =>
                                        setData(
                                            "subtotal",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormGroup>

                            <FormGroup
                                label="消費税率（%）"
                                htmlFor="tax_rate"
                                required
                                error={errors.tax_rate}
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
                                        setData(
                                            "tax_rate",
                                            e.target.value,
                                        )
                                    }
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

                                {hasRemainingCap && (
                                    <div className="flex justify-between text-sm pt-2">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            この契約の残金（税込）
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {formatAmount(remainingAmount)}
                                        </span>
                                    </div>
                                )}

                                {exceedsRemaining && (
                                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                        合計金額が契約の残金（
                                        {formatAmount(remainingAmount)}
                                        ）を超えています。金額を見直してください。
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* 備考 */}
            <Card>
                <CardHeader>
                    <CardTitle>備考</CardTitle>
                </CardHeader>
                <CardBody>
                    <FormGroup
                        label="備考"
                        htmlFor="notes"
                        error={errors.notes}
                    >
                        <FormTextarea
                            id="notes"
                            name="notes"
                            value={data.notes || ""}
                            onChange={(e) =>
                                setData("notes", e.target.value)
                            }
                            rows={4}
                            placeholder="その他の備考があればこちらに記入してください"
                        />
                    </FormGroup>
                </CardBody>
            </Card>
            {/* フォーム操作 */}
            <div className="flex justify-end gap-4">
                <SecondaryButton href={cancelRoute}>
                    キャンセル
                </SecondaryButton>
                <PrimaryButton
                    type="submit"
                    disabled={
                        processing || exceedsRemaining || noRemainingLeft
                    }
                >
                    {processing
                        ? "処理中..."
                        : isEdit
                            ? "更新する"
                            : "作成する"}
                </PrimaryButton>
            </div>
        </form>
    );
}
