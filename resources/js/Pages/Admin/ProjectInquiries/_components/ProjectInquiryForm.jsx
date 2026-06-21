import React from "react";
import FormGroup from "@/Components/Forms/FormGroup";
import TextInput from "@/Components/Forms/TextInput";
import TextArea from "@/Components/Forms/TextArea";
import SelectInput from "@/Components/Forms/SelectInput";
import NumberInput from "@/Components/Forms/NumberInput";
import { Card, CardHeader, CardBody } from "@/Components/Card";

export default function ProjectInquiryForm({
    data,
    setData,
    errors,
    users = [],
    companies = [],
    admins = [],
    quotes = [],
    isEdit = false,
}) {
    const STATUS_OPTIONS = [
        { value: "new", label: "新規受付" },
        { value: "in_discussion", label: "相談中" },
        { value: "estimated", label: "見積済み" },
        { value: "contracted", label: "契約済み" },
        { value: "cancelled", label: "キャンセル" },
    ];

    const userOptions = [
        { value: "", label: "選択してください" },
        ...users.map((user) => ({
            value: user.id,
            label: `${user.name} (${user.email})`,
        })),
    ];

    const companyOptions = [
        { value: "", label: "なし" },
        ...companies.map((company) => ({
            value: company.id,
            label: company.name,
        })),
    ];

    const adminOptions = [
        { value: "", label: "未割当" },
        ...admins.map((admin) => ({
            value: admin.id,
            label: `${admin.name} (${admin.email})`,
        })),
    ];

    const quoteOptions = [
        { value: "", label: "なし" },
        ...quotes.map((quote) => ({
            value: quote.id,
            label: `${quote.quote_number} - ${quote.title}`,
        })),
    ];

    return (
        <div className="space-y-6">
            {/* 基本情報 */}
            <Card>
                <CardHeader>基本情報</CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        {isEdit && data.inquiry_code && (
                            <FormGroup label="問い合わせ番号">
                                <div className="text-slate-900 dark:text-slate-100 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded">
                                    {data.inquiry_code}
                                </div>
                            </FormGroup>
                        )}

                        <FormGroup
                            label="タイトル"
                            required
                            error={errors.title}
                        >
                            <TextInput
                                value={data.title || ""}
                                onChange={(value) =>
                                    setData({ ...data, title: value })
                                }
                                placeholder="例: コーポレートサイトリニューアル"
                                error={errors.title}
                            />
                        </FormGroup>

                        <FormGroup label="概要" error={errors.summary}>
                            <TextArea
                                value={data.summary || ""}
                                onChange={(value) =>
                                    setData({ ...data, summary: value })
                                }
                                placeholder="プロジェクトの概要を入力してください"
                                rows={4}
                                error={errors.summary}
                            />
                        </FormGroup>

                        <FormGroup
                            label="ステータス"
                            required
                            error={errors.status}
                        >
                            <SelectInput
                                value={data.status || "new"}
                                onChange={(value) =>
                                    setData({ ...data, status: value })
                                }
                                options={STATUS_OPTIONS}
                                error={errors.status}
                            />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            {/* クライアント情報 */}
            <Card>
                <CardHeader>クライアント情報</CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <FormGroup
                            label="クライアント"
                            required
                            error={errors.user_id}
                        >
                            <SelectInput
                                value={data.user_id || ""}
                                onChange={(value) =>
                                    setData({ ...data, user_id: value })
                                }
                                options={userOptions}
                                error={errors.user_id}
                            />
                        </FormGroup>

                        <FormGroup label="企業" error={errors.company_id}>
                            <SelectInput
                                value={data.company_id || ""}
                                onChange={(value) =>
                                    setData({ ...data, company_id: value })
                                }
                                options={companyOptions}
                                error={errors.company_id}
                            />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            {/* プロジェクト詳細 */}
            <Card>
                <CardHeader>プロジェクト詳細</CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormGroup
                                label="最小予算"
                                error={errors.budget_min}
                            >
                                <NumberInput
                                    value={data.budget_min || ""}
                                    onChange={(value) =>
                                        setData({ ...data, budget_min: value })
                                    }
                                    placeholder="0"
                                    min="0"
                                    step="10000"
                                    error={errors.budget_min}
                                    suffix="円"
                                />
                            </FormGroup>

                            <FormGroup
                                label="最大予算"
                                error={errors.budget_max}
                            >
                                <NumberInput
                                    value={data.budget_max || ""}
                                    onChange={(value) =>
                                        setData({ ...data, budget_max: value })
                                    }
                                    placeholder="0"
                                    min="0"
                                    step="10000"
                                    error={errors.budget_max}
                                    suffix="円"
                                />
                            </FormGroup>
                        </div>

                        <FormGroup
                            label="希望納期"
                            error={errors.desired_delivery_date}
                        >
                            <TextInput
                                type="date"
                                value={data.desired_delivery_date || ""}
                                onChange={(value) =>
                                    setData({
                                        ...data,
                                        desired_delivery_date: value,
                                    })
                                }
                                error={errors.desired_delivery_date}
                            />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            {/* ヒアリング・管理情報 */}
            <Card>
                <CardHeader>ヒアリング・管理情報</CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <FormGroup
                            label="ヒアリング内容"
                            error={errors.hearing_notes}
                        >
                            <TextArea
                                value={data.hearing_notes || ""}
                                onChange={(value) =>
                                    setData({ ...data, hearing_notes: value })
                                }
                                placeholder="クライアントとのヒアリング内容を記録"
                                rows={5}
                                error={errors.hearing_notes}
                            />
                        </FormGroup>

                        <FormGroup
                            label="管理者メモ"
                            error={errors.admin_notes}
                            hint="内部用のメモ（クライアントには表示されません）"
                        >
                            <TextArea
                                value={data.admin_notes || ""}
                                onChange={(value) =>
                                    setData({ ...data, admin_notes: value })
                                }
                                placeholder="内部メモ・備考"
                                rows={3}
                                error={errors.admin_notes}
                            />
                        </FormGroup>

                        <FormGroup
                            label="担当管理者"
                            error={errors.assigned_admin_id}
                        >
                            <SelectInput
                                value={data.assigned_admin_id || ""}
                                onChange={(value) =>
                                    setData({
                                        ...data,
                                        assigned_admin_id: value,
                                    })
                                }
                                options={adminOptions}
                                error={errors.assigned_admin_id}
                            />
                        </FormGroup>

                        {isEdit && quotes.length > 0 && (
                            <FormGroup label="関連見積" error={errors.quote_id}>
                                <SelectInput
                                    value={data.quote_id || ""}
                                    onChange={(value) =>
                                        setData({ ...data, quote_id: value })
                                    }
                                    options={quoteOptions}
                                    error={errors.quote_id}
                                />
                            </FormGroup>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
