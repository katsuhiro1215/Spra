import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";

export default function QuoteResponseForm({ quote, token }) {
    const [submitted, setSubmitted] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        response_type: "request", // default selection
        response_text: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("quote.response.store", { token }), {
            onSuccess: () => setSubmitted(true),
        });
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Head title="返信完了" />
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
                        ご返信ありがとうございます
                    </h1>
                    <p className="text-gray-600 mb-6">
                        2~3営業日以内にご連絡させていただきます。
                    </p>
                    <p className="text-sm text-gray-500">
                        何かご質問やご不明な点がございましたら、
                        <br />
                        お気軽にお問い合わせください。
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="見積もり返信フォーム" />

            <div className="max-w-2xl mx-auto">
                {/* ヘッダー */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        見積もりのご返信フォーム
                    </h1>
                    <p className="text-gray-600">
                        見積番号:{" "}
                        <strong className="text-lg text-indigo-600">
                            {quote.quote_number}
                        </strong>
                    </p>
                    <p className="text-gray-600 mt-2">{quote.title}</p>
                </div>

                {/* プロセス説明 */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        ご依頼までの流れ
                    </h2>
                    <ol className="space-y-3 list-decimal list-inside">
                        <li className="text-gray-700">
                            以下のフォームから「ご依頼」をお知らせください
                        </li>
                        <li className="text-gray-700">
                            2~3営業日以内に、ユーザーアカウント作成の招待メールを送付いたします
                        </li>
                        <li className="text-gray-700">
                            招待メール内のリンクからアカウント作成し、会社情報をご入力ください
                        </li>
                        <li className="text-gray-700">
                            管理側で確認後、契約書をアカウントにアップロードいたします
                        </li>
                        <li className="text-gray-700">
                            ご確認・承認後、ご入金が確認されましたら作成開始いたします
                        </li>
                    </ol>
                </div>

                {/* フォーム */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ラジオボタン選択 */}
                        <div>
                            <label className="block text-lg font-bold text-gray-900 mb-4">
                                以下からお選びください
                                <span className="text-red-500 ml-1">*</span>
                            </label>

                            <div className="space-y-4">
                                {/* オプション1: ご依頼をお願いします */}
                                <div className="flex items-start">
                                    <input
                                        type="radio"
                                        id="request"
                                        name="response_type"
                                        value="request"
                                        checked={
                                            data.response_type === "request"
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "response_type",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 h-5 w-5 text-indigo-600 cursor-pointer"
                                    />
                                    <label
                                        htmlFor="request"
                                        className="ml-3 cursor-pointer flex-1"
                                    >
                                        <p className="font-semibold text-gray-900">
                                            ご依頼をお願いします
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            プロジェクトを進行してください
                                        </p>
                                    </label>
                                </div>

                                {/* オプション2: 今回は見送ります */}
                                <div className="flex items-start">
                                    <input
                                        type="radio"
                                        id="decline"
                                        name="response_type"
                                        value="decline"
                                        checked={
                                            data.response_type === "decline"
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "response_type",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 h-5 w-5 text-indigo-600 cursor-pointer"
                                    />
                                    <label
                                        htmlFor="decline"
                                        className="ml-3 cursor-pointer flex-1"
                                    >
                                        <p className="font-semibold text-gray-900">
                                            今回は見送ります。
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            この件についてはキャンセルします
                                        </p>
                                    </label>
                                </div>

                                {/* オプション3: 見積り見直し */}
                                <div className="flex items-start">
                                    <input
                                        type="radio"
                                        id="revision_request"
                                        name="response_type"
                                        value="revision_request"
                                        checked={
                                            data.response_type ===
                                            "revision_request"
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "response_type",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 h-5 w-5 text-indigo-600 cursor-pointer"
                                    />
                                    <label
                                        htmlFor="revision_request"
                                        className="ml-3 cursor-pointer flex-1"
                                    >
                                        <p className="font-semibold text-gray-900">
                                            お見積りの見直しを依頼
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            見積内容について相談したいことがあります
                                        </p>
                                    </label>
                                </div>

                                {/* オプション4: その他 */}
                                <div className="flex items-start">
                                    <input
                                        type="radio"
                                        id="other"
                                        name="response_type"
                                        value="other"
                                        checked={data.response_type === "other"}
                                        onChange={(e) =>
                                            setData(
                                                "response_type",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 h-5 w-5 text-indigo-600 cursor-pointer"
                                    />
                                    <label
                                        htmlFor="other"
                                        className="ml-3 cursor-pointer flex-1"
                                    >
                                        <p className="font-semibold text-gray-900">
                                            その他
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            その他のご質問やご要望
                                        </p>
                                    </label>
                                </div>
                            </div>

                            {errors.response_type && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.response_type}
                                </p>
                            )}
                        </div>

                        {/* テキスト入力（その他の場合） */}
                        {data.response_type === "other" && (
                            <div>
                                <label
                                    htmlFor="response_text"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    詳細をお聞かせください
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    id="response_text"
                                    name="response_text"
                                    rows="4"
                                    value={data.response_text}
                                    onChange={(e) =>
                                        setData("response_text", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="ご質問やご要望をお入力ください"
                                    required={data.response_type === "other"}
                                />
                                {errors.response_text && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.response_text}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* 送信ボタン */}
                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                            >
                                {processing ? "送信中..." : "送信する"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* フッター */}
                <div className="mt-6 text-center text-gray-600 text-sm">
                    <p>
                        何かご不明な点やご質問がございましたら、
                        <br />
                        お気軽にお問い合わせください。
                    </p>
                </div>
            </div>
        </div>
    );
}
