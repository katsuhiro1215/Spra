import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";

const paymentMethods = {
    bank_transfer: "銀行振込",
    credit_card: "クレジットカード",
    cash: "現金",
    other: "その他",
};

const statusLabels = {
    draft: "下書き",
    sent: "送付済み",
    viewed: "確認済み",
    paid: "支払済み",
    overdue: "期限切れ",
    cancelled: "キャンセル",
};

export default function InvoicePaymentForm({ invoice, token }) {
    const [submitted, setSubmitted] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        payment_method: "bank_transfer",
        amount: invoice.balance > 0 ? invoice.balance : "",
        payment_date: new Date().toISOString().split("T")[0],
        transaction_id: "",
        notes: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("invoice.payment.store", { token }), {
            onSuccess: () => setSubmitted(true),
        });
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Head title="入金報告完了" />
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="mb-4">
                        <svg
                            className="w-16 h-16 text-green-500 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        入金報告を受け付けました
                    </h1>
                    <p className="text-gray-600">
                        ご報告ありがとうございます。管理者が内容を確認いたします。
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="入金報告フォーム" />

            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* ヘッダー */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                        <h1 className="text-2xl font-bold text-white">
                            入金報告フォーム
                        </h1>
                        <p className="text-blue-100 mt-1">
                            請求書 {invoice.invoice_number} のお支払いについてお知らせください
                        </p>
                    </div>

                    <div className="p-8">
                        {/* 請求書サマリー */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                            {invoice.title && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">件名</span>
                                    <span className="text-gray-900 font-medium">
                                        {invoice.title}
                                    </span>
                                </div>
                            )}
                            {invoice.due_date && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        お支払い期限
                                    </span>
                                    <span className="text-gray-900 font-medium">
                                        {invoice.due_date}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                    ご請求金額
                                </span>
                                <span className="text-gray-900 font-medium">
                                    ¥{invoice.total_amount.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                    ステータス
                                </span>
                                <span className="text-gray-900 font-medium">
                                    {statusLabels[invoice.status] ??
                                        invoice.status_name}
                                </span>
                            </div>
                        </div>

                        {invoice.status === "paid" ? (
                            <p className="text-center text-gray-600 py-6">
                                この請求書はすでにお支払い済みです。ご報告ありがとうございました。
                            </p>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        支払方法{" "}
                                        <span className="text-red-600">
                                            *
                                        </span>
                                    </label>
                                    <select
                                        value={data.payment_method}
                                        onChange={(e) =>
                                            setData(
                                                "payment_method",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        {Object.entries(paymentMethods).map(
                                            ([key, label]) => (
                                                <option
                                                    key={key}
                                                    value={key}
                                                >
                                                    {label}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                    {errors.payment_method && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.payment_method}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        金額{" "}
                                        <span className="text-red-600">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.amount}
                                        onChange={(e) =>
                                            setData("amount", e.target.value)
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    {errors.amount && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.amount}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        支払い日{" "}
                                        <span className="text-red-600">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.payment_date}
                                        onChange={(e) =>
                                            setData(
                                                "payment_date",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    {errors.payment_date && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.payment_date}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        トランザクションID
                                    </label>
                                    <input
                                        type="text"
                                        value={data.transaction_id}
                                        onChange={(e) =>
                                            setData(
                                                "transaction_id",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="例: 振込通知番号"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    {errors.transaction_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.transaction_id}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        備考
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        rows={3}
                                        placeholder="入金に関する追加情報があればお書きください"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    />
                                    {errors.notes && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.notes}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? "送信中..." : "入金を報告する"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
