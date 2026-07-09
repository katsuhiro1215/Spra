import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { FormField, FormSelect, FormTextarea } from "@/Components/Forms";
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

    // 税込金額を計算
    const getTotalWithTax = () => {
        const amount = parseFloat(data.amount) || 0;
        const taxRate = parseFloat(data.tax_rate) || 0;
        return amount * (1 + taxRate / 100);
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        契約タイトル
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={data.title || ""}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <FormSelect
                                    label="ステータス"
                                    name="status"
                                    value={data.status || "draft"}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    error={errors.status}
                                    options={CONTRACT_STATUS_OPTIONS}
                                    required
                                />

                                <FormSelect
                                    label="契約タイプ"
                                    name="type"
                                    value={data.type || "one_time"}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    error={errors.type}
                                    options={CONTRACT_TYPE_OPTIONS}
                                    required
                                />

                                {quotes && quotes.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            見積もりから作成
                                        </label>
                                        <select
                                            value={data.quote_id || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "quote_id",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                                        </select>
                                    </div>
                                )}

                                <div className="md:col-span-2">
                                    <FormTextarea
                                        label="契約内容"
                                        name="description"
                                        value={data.description || ""}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        error={errors.description}
                                        rows={4}
                                        placeholder="契約の詳細な内容を入力してください"
                                    />
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {users && users.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            ユーザー
                                            {fromQuoteResponse && (
                                                <span className="text-gray-500 text-xs ml-2">
                                                    (自動設定)
                                                </span>
                                            )}
                                        </label>
                                        <select
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
                                            className={`w-full px-3 py-2 border rounded-md ${
                                                fromQuoteResponse
                                                    ? "bg-gray-100 border-gray-300 opacity-75"
                                                    : "border-gray-300"
                                            }`}
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
                                        </select>
                                        {/* disabled フィールドの値を送信するための hidden input */}
                                        {fromQuoteResponse && data.user_id && (
                                            <input
                                                type="hidden"
                                                name="user_id"
                                                value={data.user_id}
                                            />
                                        )}
                                        {errors.user_id && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.user_id}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {companies && companies.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            会社
                                            {fromQuoteResponse && (
                                                <span className="text-gray-500 text-xs ml-2">
                                                    (自動設定)
                                                </span>
                                            )}
                                        </label>
                                        <select
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
                                            className={`w-full px-3 py-2 border rounded-md ${
                                                fromQuoteResponse
                                                    ? "bg-gray-100 border-gray-300 opacity-75"
                                                    : "border-gray-300"
                                            }`}
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
                                        </select>
                                        {/* disabled フィールドの値を送信するための hidden input */}
                                        {fromQuoteResponse &&
                                            data.company_id && (
                                                <input
                                                    type="hidden"
                                                    name="company_id"
                                                    value={data.company_id}
                                                />
                                            )}
                                    </div>
                                )}

                                {projects && projects.length > 0 && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            プロジェクト
                                        </label>
                                        <select
                                            value={data.project_id || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "project_id",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="">選択しない</option>
                                            {projects.map((project) => (
                                                <option
                                                    key={project.id}
                                                    value={project.id}
                                                >
                                                    {project.project_code ||
                                                        project.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>

                    {/* 契約金額 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>契約金額</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    label="基本金額"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="base_amount"
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
                                    error={errors.base_amount}
                                    required
                                />

                                <FormField
                                    label="割引金額"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="discount_amount"
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
                                    error={errors.discount_amount}
                                />

                                <FormField
                                    label="消費税率 (%)"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    name="tax_rate"
                                    value={data.tax_rate}
                                    onChange={(e) =>
                                        setData("tax_rate", e.target.value)
                                    }
                                    error={errors.tax_rate}
                                />

                                <FormField
                                    label="消費税額"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="tax_amount"
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
                                    error={errors.tax_amount}
                                />

                                {(data.base_amount ||
                                    data.discount_amount ||
                                    data.total_amount) && (
                                    <div className="md:col-span-2">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        基本金額:
                                                    </span>
                                                    <span className="font-medium">
                                                        {formatAmount(
                                                            data.base_amount,
                                                        )}
                                                    </span>
                                                </div>
                                                {data.discount_amount && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">
                                                            割引:
                                                        </span>
                                                        <span className="font-medium text-red-600">
                                                            -
                                                            {formatAmount(
                                                                data.discount_amount,
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-sm border-t border-blue-200 pt-2">
                                                    <span className="text-gray-600">
                                                        税抜合計:
                                                    </span>
                                                    <span className="font-medium">
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
                                                        <span className="text-gray-600">
                                                            消費税 (
                                                            {data.tax_rate ||
                                                                10}
                                                            %):
                                                        </span>
                                                        <span className="font-medium">
                                                            {formatAmount(
                                                                data.tax_amount,
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-blue-200">
                                                    <span>税込合計:</span>
                                                    <span className="text-blue-600">
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

                                <FormField
                                    label="合計金額"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="total_amount"
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
                                    error={errors.total_amount}
                                />
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
                                <FormField
                                    label="開始日"
                                    type="date"
                                    name="start_date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData("start_date", e.target.value)
                                    }
                                    error={errors.start_date}
                                    required
                                />

                                <FormField
                                    label="終了日"
                                    type="date"
                                    name="end_date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData("end_date", e.target.value)
                                    }
                                    error={errors.end_date}
                                />

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
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="auto_renewal"
                                        className="ml-2 block text-sm text-gray-700"
                                    >
                                        自動更新を有効にする
                                    </label>
                                </div>

                                {data.auto_renewal && (
                                    <FormField
                                        label="更新通知日数"
                                        type="number"
                                        min="1"
                                        name="renewal_notice_days"
                                        value={data.renewal_notice_days}
                                        onChange={(e) =>
                                            setData(
                                                "renewal_notice_days",
                                                e.target.value,
                                            )
                                        }
                                        error={errors.renewal_notice_days}
                                        placeholder="更新前に通知する日数"
                                    />
                                )}
                            </div>
                        </CardBody>
                    </Card>

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
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    {showAdvanced ? "隠す" : "表示"}
                                </button>
                            </div>
                        </CardHeader>
                        {showAdvanced && (
                            <CardBody>
                                <div className="space-y-6">
                                    <FormTextarea
                                        label="支払い条件"
                                        name="payment_terms"
                                        value={data.payment_terms || ""}
                                        onChange={(e) =>
                                            setData(
                                                "payment_terms",
                                                e.target.value,
                                            )
                                        }
                                        error={errors.payment_terms}
                                        rows={3}
                                        placeholder="支払いに関する条件を入力してください"
                                    />

                                    <FormTextarea
                                        label="利用規約"
                                        name="terms_and_conditions"
                                        value={data.terms_and_conditions || ""}
                                        onChange={(e) =>
                                            setData(
                                                "terms_and_conditions",
                                                e.target.value,
                                            )
                                        }
                                        error={errors.terms_and_conditions}
                                        rows={5}
                                        placeholder="契約の利用規約を入力してください"
                                    />

                                    <FormTextarea
                                        label="備考"
                                        name="notes"
                                        value={data.notes || ""}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        error={errors.notes}
                                        rows={3}
                                        placeholder="内部用の備考を入力してください"
                                    />
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
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
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
                                                    className="p-3 bg-gray-50 border border-gray-200 rounded-md"
                                                >
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-xs text-gray-600 mt-1">
                                                        サービス:{" "}
                                                        {service
                                                            ? service.name
                                                            : "不明"}
                                                    </div>
                                                    {item.service_item_id && (
                                                        <div className="text-xs text-gray-600">
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
                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                            <p className="text-sm text-blue-800">
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
                            <div className="text-center py-6 text-gray-500">
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
                    onClick={() => (window.location.href = cancelRoute)}
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
