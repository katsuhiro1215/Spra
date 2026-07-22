import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { FormGroup, TextInput, SelectInput, TextArea } from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";

export default function ReceiptForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    invoices = [],
    users = [],
    companies = [],
    statuses = {},
    isEdit = false,
}) {
    // 請求書が選択されたときに自動入力
    useEffect(() => {
        if (data.invoice_id && invoices.length > 0) {
            const selectedInvoice = invoices.find(
                (inv) => inv.id === data.invoice_id,
            );
            if (selectedInvoice) {
                setData((prev) => ({
                    ...prev,
                    user_id: selectedInvoice.user_id || prev.user_id,
                    company_id: selectedInvoice.company_id || prev.company_id,
                    amount: selectedInvoice.subtotal || prev.amount,
                    tax_amount: selectedInvoice.tax_amount || prev.tax_amount,
                    total_amount:
                        selectedInvoice.total_amount || prev.total_amount,
                }));
            }
        }
    }, [data.invoice_id]);

    // 小計と税額から合計を計算
    useEffect(() => {
        const amount = parseFloat(data.amount) || 0;
        const taxAmount = parseFloat(data.tax_amount) || 0;
        const total = amount + taxAmount;

        if (data.total_amount !== total) {
            setData((prev) => ({
                ...prev,
                total_amount: total,
            }));
        }
    }, [data.amount, data.tax_amount]);

    const statusOptions = Object.entries(statuses).map(([value, label]) => ({
        value,
        label,
    }));

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
            company_id: companyId || null,
            user_id: primaryUser?.id || company?.users?.[0]?.id || prev.user_id,
        }));
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* 基本情報 */}
            <Card>
                <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <FormGroup
                            label="請求書"
                            htmlFor="invoice_id"
                            error={errors.invoice_id}
                            required
                        >
                            <SelectInput
                                id="invoice_id"
                                value={data.invoice_id}
                                onChange={(e) =>
                                    setData("invoice_id", e.target.value)
                                }
                                disabled={isEdit}
                                options={[
                                    { value: "", label: "請求書を選択" },
                                    ...invoices.map((invoice) => ({
                                        value: invoice.id,
                                        label: `${invoice.invoice_number} - ¥${invoice.total_amount?.toLocaleString()}`,
                                    })),
                                ]}
                            />
                        </FormGroup>

                        <div className="grid grid-cols-2 gap-4">
                            <FormGroup
                                label="会社"
                                htmlFor="company_id"
                                error={errors.company_id}
                            >
                                <SelectInput
                                    id="company_id"
                                    value={data.company_id || ""}
                                    onChange={(e) =>
                                        handleCompanyChange(e.target.value)
                                    }
                                    options={[
                                        {
                                            value: "",
                                            label: "会社を選択（任意）",
                                        },
                                        ...companies.map((company) => ({
                                            value: company.id,
                                            label: company.name,
                                        })),
                                    ]}
                                />
                            </FormGroup>

                            <FormGroup
                                label="送付先ユーザー"
                                htmlFor="user_id"
                                error={errors.user_id}
                                required
                            >
                                <SelectInput
                                    id="user_id"
                                    value={data.user_id}
                                    onChange={(e) =>
                                        setData("user_id", e.target.value)
                                    }
                                    options={[
                                        { value: "", label: "ユーザーを選択" },
                                        ...userChoices.map((user) => ({
                                            value: user.id,
                                            label: userLabel(user),
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

                        <div className="grid grid-cols-2 gap-4">
                            <FormGroup
                                label="ステータス"
                                htmlFor="status"
                                error={errors.status}
                                required
                            >
                                <SelectInput
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    options={statusOptions}
                                />
                            </FormGroup>

                            <FormGroup
                                label="発行日"
                                htmlFor="issued_at"
                                error={errors.issued_at}
                            >
                                <TextInput
                                    id="issued_at"
                                    type="date"
                                    value={data.issued_at || ""}
                                    onChange={(e) =>
                                        setData("issued_at", e.target.value)
                                    }
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
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <FormGroup
                                label="小計（税抜）"
                                htmlFor="amount"
                                error={errors.amount}
                                required
                            >
                                <TextInput
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData("amount", e.target.value)
                                    }
                                    placeholder="0.00"
                                />
                            </FormGroup>

                            <FormGroup
                                label="消費税"
                                htmlFor="tax_amount"
                                error={errors.tax_amount}
                                required
                            >
                                <TextInput
                                    id="tax_amount"
                                    type="number"
                                    step="0.01"
                                    value={data.tax_amount}
                                    onChange={(e) =>
                                        setData("tax_amount", e.target.value)
                                    }
                                    placeholder="0.00"
                                />
                            </FormGroup>

                            <FormGroup
                                label="合計（税込）"
                                htmlFor="total_amount"
                                error={errors.total_amount}
                                required
                            >
                                <TextInput
                                    id="total_amount"
                                    type="number"
                                    step="0.01"
                                    value={data.total_amount}
                                    onChange={(e) =>
                                        setData(
                                            "total_amount",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="0.00"
                                    disabled
                                />
                            </FormGroup>
                        </div>

                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 text-center">
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">
                                領収金額
                            </p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                ¥
                                {parseFloat(
                                    data.total_amount || 0,
                                ).toLocaleString()}
                            </p>
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
                        <TextArea
                            id="notes"
                            value={data.notes || ""}
                            onChange={(e) =>
                                setData("notes", e.target.value)
                            }
                            rows={4}
                            placeholder="備考を入力してください"
                        />
                    </FormGroup>
                </CardBody>
            </Card>

            {/* アクションボタン */}
            <Card>
                <CardBody>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton
                            href={route("admin.receipt.index")}
                        >
                            キャンセル
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing
                                ? "保存中..."
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
