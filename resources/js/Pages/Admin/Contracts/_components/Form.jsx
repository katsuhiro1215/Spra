import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FormGroup, TextInput, SelectInput, TextArea } from "@/Components/Forms";
import {
    CONTRACT_STATUS_OPTIONS,
    CONTRACT_TYPE_OPTIONS,
} from "@/Constants/SelectOptions";

export default function ContractForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    onDraftSave,
    cancelRoute,
    isEdit = false,
    projects = [],
    users = [],
    companies = [],
    services = [],
    quotes = [],
    requirementStatus = null,
    fromQuoteResponse = false,
    quote = null,
    quoteResponse = null,
}) {
    // ========================================
    // State
    // ========================================
    const [showAdvanced, setShowAdvanced] = useState(false);

    // ========================================
    // Handlers
    // ========================================
    const handleDraftSave = () => {
        // props の onDraftSave があればそれを使用、なければ setData => onSubmit のフローを使用
        if (onDraftSave) {
            onDraftSave();
        } else {
            setData("status", "draft");
            setTimeout(() => {
                onSubmit();
            }, 50);
        }
    };

    const handleSend = () => {
        // 送信ボタンは status をそのまま送信
        onSubmit();
    };
    // ========================================
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    // 金額をフォーマット
    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                    {/* 基本情報 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>基本情報</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormGroup
                                    label="契約タイトル"
                                    htmlFor="title"
                                    required
                                    error={errors.title}
                                >
                                    <TextInput
                                        id="title"
                                        name="title"
                                        type="text"
                                        value={data.title || ""}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        required
                                    />
                                </FormGroup>

                                {!isEdit && (
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
                                            options={CONTRACT_STATUS_OPTIONS}
                                        />
                                    </FormGroup>
                                )}

                                {!isEdit && (
                                    <FormGroup
                                        label="契約タイプ"
                                        htmlFor="type"
                                        required
                                        error={errors.type}
                                    >
                                        <SelectInput
                                            id="type"
                                            name="type"
                                            value={data.type || "one_time"}
                                            onChange={(e) =>
                                                setData(
                                                    "type",
                                                    e.target.value,
                                                )
                                            }
                                            options={CONTRACT_TYPE_OPTIONS}
                                        />
                                    </FormGroup>
                                )}

                                {!isEdit && quotes && quotes.length > 0 && (
                                    <FormGroup
                                        label="見積もりから作成"
                                        htmlFor="quote_id"
                                    >
                                        <SelectInput
                                            id="quote_id"
                                            name="quote_id"
                                            value={data.quote_id || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "quote_id",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="">選択しない</option>
                                            {quotes.map((quote) => (
                                                <option
                                                    key={quote.id}
                                                    value={quote.id}
                                                >
                                                    {quote.quote_number} -{" "}
                                                    {quote.title} (
                                                    {quote.status})
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </FormGroup>
                                )}

                                <div className="md:col-span-2">
                                    <FormGroup
                                        label="契約内容"
                                        htmlFor="description"
                                        error={errors.description}
                                    >
                                        <TextArea
                                            id="description"
                                            name="description"
                                            value={data.description || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            rows={4}
                                            placeholder="契約の詳細な内容を入力してください"
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* クライアント情報(作成時のみ編集可能。編集画面では変更できないため非表示) */}
                    {!isEdit && (
                    <Card>
                        <CardHeader>
                            <CardTitle>クライアント情報</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {users && users.length > 0 && (
                                    <FormGroup
                                        label={
                                            <>
                                                ユーザー
                                                {fromQuoteResponse && (
                                                    <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                                                        (自動設定)
                                                    </span>
                                                )}
                                            </>
                                        }
                                        htmlFor="user_id"
                                        error={errors.user_id}
                                    >
                                        <SelectInput
                                            id="user_id"
                                            name="user_id"
                                            value={data.user_id || ""}
                                            onChange={(e) => {
                                                // QuoteResponse 経由の場合は変更を無視
                                                if (!fromQuoteResponse) {
                                                    setData(
                                                        "user_id",
                                                        e.target.value,
                                                    );
                                                }
                                            }}
                                            className={
                                                fromQuoteResponse
                                                    ? "bg-gray-100 dark:bg-gray-800 opacity-75"
                                                    : ""
                                            }
                                            style={
                                                fromQuoteResponse
                                                    ? { pointerEvents: "none" }
                                                    : {}
                                            }
                                        >
                                            <option value="">
                                                選択してください
                                            </option>
                                            {users.map((user) => (
                                                <option
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.profile?.full_name ||
                                                        user.email}
                                                </option>
                                            ))}
                                        </SelectInput>
                                        {/* disabled フィールドの値を送信するための hidden input */}
                                        {fromQuoteResponse && data.user_id && (
                                            <input
                                                type="hidden"
                                                name="user_id"
                                                value={data.user_id}
                                            />
                                        )}
                                    </FormGroup>
                                )}

                                {companies && companies.length > 0 && (
                                    <FormGroup
                                        label={
                                            <>
                                                会社
                                                {fromQuoteResponse && (
                                                    <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                                                        (自動設定)
                                                    </span>
                                                )}
                                            </>
                                        }
                                        htmlFor="company_id"
                                    >
                                        <SelectInput
                                            id="company_id"
                                            name="company_id"
                                            value={data.company_id || ""}
                                            onChange={(e) => {
                                                // QuoteResponse 経由の場合は変更を無視
                                                if (!fromQuoteResponse) {
                                                    setData(
                                                        "company_id",
                                                        e.target.value,
                                                    );
                                                }
                                            }}
                                            className={
                                                fromQuoteResponse
                                                    ? "bg-gray-100 dark:bg-gray-800 opacity-75"
                                                    : ""
                                            }
                                            style={
                                                fromQuoteResponse
                                                    ? { pointerEvents: "none" }
                                                    : {}
                                            }
                                        >
                                            <option value="">選択しない</option>
                                            {companies.map((company) => (
                                                <option
                                                    key={company.id}
                                                    value={company.id}
                                                >
                                                    {company.name}
                                                </option>
                                            ))}
                                        </SelectInput>
                                        {/* disabled フィールドの値を送信するための hidden input */}
                                        {fromQuoteResponse &&
                                            data.company_id && (
                                                <input
                                                    type="hidden"
                                                    name="company_id"
                                                    value={data.company_id}
                                                />
                                            )}
                                    </FormGroup>
                                )}

                                {projects && projects.length > 0 && (
                                    <div className="md:col-span-2">
                                        <FormGroup
                                            label="プロジェクト"
                                            htmlFor="project_id"
                                        >
                                            <SelectInput
                                                id="project_id"
                                                name="project_id"
                                                value={data.project_id || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "project_id",
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    選択しない
                                                </option>
                                                {projects.map((project) => (
                                                    <option
                                                        key={project.id}
                                                        value={project.id}
                                                    >
                                                        {project.project_code ||
                                                            project.title}
                                                    </option>
                                                ))}
                                            </SelectInput>
                                        </FormGroup>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                    )}

                    {/* 契約金額 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>契約金額</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {!isEdit && (
                                    <FormGroup
                                        label="基本金額"
                                        htmlFor="base_amount"
                                        required
                                        error={errors.base_amount}
                                    >
                                        <TextInput
                                            id="base_amount"
                                            name="base_amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.base_amount}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setData(
                                                    "base_amount",
                                                    value === ""
                                                        ? ""
                                                        : parseFloat(value),
                                                );
                                            }}
                                        />
                                    </FormGroup>
                                )}

                                <FormGroup
                                    label="割引金額"
                                    htmlFor="discount_amount"
                                    error={errors.discount_amount}
                                >
                                    <TextInput
                                        id="discount_amount"
                                        name="discount_amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.discount_amount}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setData(
                                                "discount_amount",
                                                value === ""
                                                    ? ""
                                                    : parseFloat(value),
                                            );
                                        }}
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="消費税率 (%)"
                                    htmlFor="tax_rate"
                                    error={errors.tax_rate}
                                >
                                    <TextInput
                                        id="tax_rate"
                                        name="tax_rate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={data.tax_rate}
                                        onChange={(e) =>
                                            setData(
                                                "tax_rate",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </FormGroup>

                                {!isEdit && (
                                    <FormGroup
                                        label="消費税額"
                                        htmlFor="tax_amount"
                                        error={errors.tax_amount}
                                    >
                                        <TextInput
                                            id="tax_amount"
                                            name="tax_amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.tax_amount}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setData(
                                                    "tax_amount",
                                                    value === ""
                                                        ? ""
                                                        : parseFloat(value),
                                                );
                                            }}
                                        />
                                    </FormGroup>
                                )}

                                {!isEdit &&
                                    (data.base_amount ||
                                    data.discount_amount ||
                                    data.total_amount) && (
                                    <div className="md:col-span-2">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        基本金額:
                                                    </span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                        {formatAmount(
                                                            data.base_amount,
                                                        )}
                                                    </span>
                                                </div>
                                                {data.discount_amount && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            割引:
                                                        </span>
                                                        <span className="font-medium text-red-600 dark:text-red-400">
                                                            -
                                                            {formatAmount(
                                                                data.discount_amount,
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-sm border-t border-blue-200 dark:border-blue-800 pt-2">
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        税抜合計:
                                                    </span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                        {formatAmount(
                                                            (parseFloat(
                                                                data.base_amount,
                                                            ) || 0) -
                                                                (parseFloat(
                                                                    data.discount_amount,
                                                                ) || 0),
                                                        )}
                                                    </span>
                                                </div>
                                                {data.tax_amount && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            消費税 (
                                                            {data.tax_rate ||
                                                                10}
                                                            %):
                                                        </span>
                                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                                            {formatAmount(
                                                                data.tax_amount,
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-blue-200 dark:border-blue-800">
                                                    <span className="text-gray-900 dark:text-gray-100">
                                                        税込合計:
                                                    </span>
                                                    <span className="text-blue-600 dark:text-blue-400">
                                                        {formatAmount(
                                                            (parseFloat(
                                                                data.base_amount,
                                                            ) || 0) -
                                                                (parseFloat(
                                                                    data.discount_amount,
                                                                ) || 0) +
                                                                (parseFloat(
                                                                    data.tax_amount,
                                                                ) || 0),
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!isEdit && (
                                    <FormGroup
                                        label="合計金額"
                                        htmlFor="total_amount"
                                        error={errors.total_amount}
                                    >
                                        <TextInput
                                            id="total_amount"
                                            name="total_amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.total_amount}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setData(
                                                    "total_amount",
                                                    value === ""
                                                        ? ""
                                                        : parseFloat(value),
                                                );
                                            }}
                                        />
                                    </FormGroup>
                                )}
                            </div>
                        </CardBody>
                    </Card>

                    {/* 契約期間 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>契約期間</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormGroup
                                    label="開始日"
                                    htmlFor="start_date"
                                    required
                                    error={errors.start_date}
                                >
                                    <TextInput
                                        id="start_date"
                                        name="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) =>
                                            setData(
                                                "start_date",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="終了日"
                                    htmlFor="end_date"
                                    error={errors.end_date}
                                >
                                    <TextInput
                                        id="end_date"
                                        name="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) =>
                                            setData(
                                                "end_date",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </FormGroup>

                                {!isEdit && (
                                <div className="flex items-center md:col-span-2">
                                    <input
                                        type="checkbox"
                                        id="auto_renewal"
                                        checked={data.auto_renewal || false}
                                        onChange={(e) =>
                                            setData(
                                                "auto_renewal",
                                                e.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                                    />
                                    <label
                                        htmlFor="auto_renewal"
                                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        自動更新を有効にする
                                    </label>
                                </div>
                                )}

                                {!isEdit && data.auto_renewal && (
                                    <FormGroup
                                        label="更新通知日数"
                                        htmlFor="renewal_notice_days"
                                        error={errors.renewal_notice_days}
                                    >
                                        <TextInput
                                            id="renewal_notice_days"
                                            name="renewal_notice_days"
                                            type="number"
                                            min="1"
                                            value={data.renewal_notice_days}
                                            onChange={(e) =>
                                                setData(
                                                    "renewal_notice_days",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="更新前に通知する日数"
                                        />
                                    </FormGroup>
                                )}
                            </div>
                        </CardBody>
                    </Card>

                    {/* 月額請求設定(新規作成時のみ。作成後は詳細画面の「請求設定」タブから変更) */}
                    {!isEdit && data.type === "monthly" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>月額請求設定</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormGroup
                                        label="毎月の請求日"
                                        htmlFor="billing_day"
                                        error={errors.billing_day}
                                    >
                                        <TextInput
                                            id="billing_day"
                                            name="billing_day"
                                            type="number"
                                            min="1"
                                            max="31"
                                            value={data.billing_day}
                                            onChange={(e) =>
                                                setData(
                                                    "billing_day",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="例: 10（月末を超える場合は月末に自動調整）"
                                        />
                                    </FormGroup>

                                    <FormGroup
                                        label="支払期限（発行から何日後）"
                                        htmlFor="payment_due_days"
                                        error={errors.payment_due_days}
                                    >
                                        <TextInput
                                            id="payment_due_days"
                                            name="payment_due_days"
                                            type="number"
                                            min="1"
                                            value={data.payment_due_days}
                                            onChange={(e) =>
                                                setData(
                                                    "payment_due_days",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </FormGroup>

                                    <div className="flex items-center md:col-span-2">
                                        <input
                                            type="checkbox"
                                            id="auto_invoice_generation"
                                            checked={
                                                data.auto_invoice_generation ??
                                                true
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "auto_invoice_generation",
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                                        />
                                        <label
                                            htmlFor="auto_invoice_generation"
                                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                                        >
                                            毎日9時のバッチ処理で自動的に請求書を生成・送付する
                                        </label>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    {/* 詳細設定 */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>詳細設定</CardTitle>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowAdvanced(!showAdvanced)
                                    }
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                >
                                    {showAdvanced ? "隠す" : "表示"}
                                </button>
                            </div>
                        </CardHeader>
                        {showAdvanced && (
                            <CardBody>
                                <div className="space-y-6">
                                    <FormGroup
                                        label="利用規約"
                                        htmlFor="terms_and_conditions"
                                        error={errors.terms_and_conditions}
                                    >
                                        <TextArea
                                            id="terms_and_conditions"
                                            name="terms_and_conditions"
                                            value={
                                                data.terms_and_conditions || ""
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "terms_and_conditions",
                                                    e.target.value,
                                                )
                                            }
                                            rows={5}
                                            placeholder="契約の利用規約を入力してください"
                                        />
                                    </FormGroup>

                                    <FormGroup
                                        label="備考"
                                        htmlFor="notes"
                                        error={errors.notes}
                                    >
                                        <TextArea
                                            id="notes"
                                            name="notes"
                                            value={data.notes || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "notes",
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                            placeholder="内部用の備考を入力してください"
                                        />
                                    </FormGroup>
                                </div>
                            </CardBody>
                        )}
                    </Card>
                </div>
                {/* サービス情報 */}
                <Card>
                    <CardHeader>
                        <CardTitle>サービス情報</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {quote && quote.items && quote.items.length > 0 ? (
                            <div className="space-y-4">
                                {/* 見積もりに含まれるサービス一覧 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        このサービスは見積書に含まれています
                                    </label>
                                    <div className="space-y-2">
                                        {quote.items.map((item, index) => {
                                            const service = services.find(
                                                (s) => s.id === item.service_id,
                                            );
                                            return (
                                                <div
                                                    key={index}
                                                    className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md"
                                                >
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                        サービス:{" "}
                                                        {service
                                                            ? service.name
                                                            : "不明"}
                                                    </div>
                                                    {item.service_item_id && (
                                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                                            単価: ¥
                                                            {parseFloat(
                                                                item.unit_price,
                                                            ).toLocaleString()}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* 複数サービスの場合の情報 */}
                                    {quote.items.length > 1 && (
                                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                                <span className="font-medium">
                                                    ℹ️
                                                    複数のサービスが含まれています
                                                </span>
                                                <br />
                                                複数サービスの場合、ServiceGroup
                                                が自動的に作成されます
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* 隠し field: service_id を保存 */}
                                <input
                                    type="hidden"
                                    name="service_id"
                                    value={data.service_id || ""}
                                />
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                <p>
                                    見積書を選択するとサービス情報が表示されます
                                </p>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-end space-x-4">
                <SecondaryButton
                    type="button"
                    href={cancelRoute}
                    disabled={processing}
                >
                    キャンセル
                </SecondaryButton>

                {/* 下書き保存ボタン */}
                <SecondaryButton
                    type="button"
                    onClick={handleDraftSave}
                    disabled={processing}
                >
                    {processing ? "保存中..." : "下書き保存"}
                </SecondaryButton>

                {/* 送信ボタン（ドラフト以外） */}
                {data.status !== "draft" && (
                    <PrimaryButton
                        type="button"
                        onClick={handleSend}
                        disabled={processing || requirementStatus?.has_errors}
                        title={
                            requirementStatus?.has_errors
                                ? "契約書送信には必須情報が不足しています"
                                : ""
                        }
                    >
                        {processing ? "送信中..." : "契約書を送信"}
                    </PrimaryButton>
                )}

                {/* 作成/更新ボタン（編集時） */}
                {data.status === "draft" && (
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing ? "処理中..." : isEdit ? "更新" : "作成"}
                    </PrimaryButton>
                )}
            </div>
        </form>
    );
}
