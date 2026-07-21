import React from "react";
import { useForm } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { FormGroup, NumberInput, SelectInput, InputError } from "@/Components/Forms";
import { PrimaryButton } from "@/Components/Buttons";

export default function BillingInfo({ contract }) {
    const { data, setData, patch, processing, errors, isDirty } = useForm({
        billing_day: contract.billing_day ?? 10,
        payment_due_days: contract.payment_due_days ?? 15,
        auto_invoice_generation: contract.auto_invoice_generation ?? true,
        billing_user_id: contract.billing_user_id ?? "",
    });

    // 契約に紐づく会社に所属するユーザーのみを送付先候補にする
    const companyUsers = contract.company?.users || [];

    const userLabel = (u) =>
        (u.profile?.full_name || u.email) +
        (u.pivot?.is_primary ? "（主担当）" : "");

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("ja-JP");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route("admin.contract.billing-settings.update", contract.id), {
            preserveScroll: true,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>請求設定（月額契約）</CardTitle>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormGroup>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                毎月の請求日
                            </label>
                            <div className="flex items-center gap-2">
                                <NumberInput
                                    min={1}
                                    max={31}
                                    value={data.billing_day}
                                    onChange={(val) =>
                                        setData("billing_day", val || 1)
                                    }
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    日（月末を超える場合は月末に自動調整）
                                </span>
                            </div>
                            <InputError message={errors.billing_day} />
                        </FormGroup>

                        <FormGroup>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                支払期限
                            </label>
                            <div className="flex items-center gap-2">
                                <NumberInput
                                    min={1}
                                    max={90}
                                    value={data.payment_due_days}
                                    onChange={(val) =>
                                        setData("payment_due_days", val || 1)
                                    }
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    日後
                                </span>
                            </div>
                            <InputError message={errors.payment_due_days} />
                        </FormGroup>
                    </div>

                    <FormGroup>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            請求書・領収書の送付先ユーザー
                        </label>
                        <SelectInput
                            id="billing_user_id"
                            value={data.billing_user_id || ""}
                            onChange={(e) =>
                                setData("billing_user_id", e.target.value)
                            }
                            options={[
                                {
                                    value: "",
                                    label: `契約者と同じ（${
                                        contract.user?.profile?.full_name ||
                                        contract.user?.email ||
                                        "未設定"
                                    }）`,
                                },
                                ...companyUsers.map((u) => ({
                                    value: u.id,
                                    label: userLabel(u),
                                })),
                            ]}
                        />
                        {companyUsers.length > 0 && (
                            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                                自動請求・自動送付される請求書・領収書の宛先です。契約者と異なる担当者（経理担当など）を指定できます。
                            </p>
                        )}
                        <InputError message={errors.billing_user_id} />
                    </FormGroup>

                    <FormGroup>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.auto_invoice_generation}
                                onChange={(e) =>
                                    setData(
                                        "auto_invoice_generation",
                                        e.target.checked,
                                    )
                                }
                                className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                毎日9時のバッチ処理で自動的に請求書を生成・送付する
                            </span>
                        </label>
                        <InputError
                            message={errors.auto_invoice_generation}
                        />
                    </FormGroup>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <PrimaryButton
                            type="submit"
                            disabled={processing || !isDirty}
                        >
                            {processing ? "保存中..." : "請求設定を保存"}
                        </PrimaryButton>
                    </div>
                </form>

                <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        請求日時情報
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">
                                次回請求予定日
                            </p>
                            <p className="text-gray-900 dark:text-gray-100 font-medium">
                                {formatDate(contract.next_billing_date)}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">
                                最終請求日時
                            </p>
                            <p className="text-gray-900 dark:text-gray-100 font-medium">
                                {formatDate(contract.last_invoiced_at)}
                            </p>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
