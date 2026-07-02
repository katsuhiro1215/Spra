import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import SignatureCanvas from "./SignatureCanvas";
import AlertMessage from "./AlertMessage";

export default function AdminSignatureVerification({ contract, onSuccess }) {
    const { post, processing, errors } = useForm();
    const [tab, setTab] = useState("verify"); // 'verify' or 'sign'
    const [verifyAction, setVerifyAction] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [signatureImage, setSignatureImage] = useState(null);
    const [method, setMethod] = useState("canvas");

    const userSignature = contract.signatures?.find(
        (s) => s.signature_type === "user",
    );

    // ユーザー署名を確認/却下
    const handleVerifyUserSignature = () => {
        if (!verifyAction) {
            alert("アクションを選択してください");
            return;
        }

        const data = {
            action: verifyAction,
        };

        if (verifyAction === "reject") {
            if (!rejectReason.trim()) {
                alert("却下理由を入力してください");
                return;
            }
            data.reason = rejectReason;
        }

        post(route("admin.contract.signature.verify-user", contract.id), {
            data,
            onSuccess: () => {
                setVerifyAction(null);
                setRejectReason("");
                onSuccess?.();
            },
        });
    };

    // 管理者署名をキャプチャ
    const handleSignatureCapture = (imageData) => {
        setSignatureImage(imageData);
        setMethod("canvas");
    };

    // 管理者署名を送信
    const handleSubmitAdminSignature = () => {
        if (!signatureImage) {
            alert("署名を入力してください");
            return;
        }

        post(route("admin.contract.signature.admin.store", contract.id), {
            data: {
                signature_image: signatureImage,
                method: method,
            },
            onSuccess: () => {
                setSignatureImage(null);
                onSuccess?.();
            },
        });
    };

    const handleClear = () => {
        setSignatureImage(null);
        setMethod("canvas");
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">署名管理</h3>

            {errors.signature && (
                <AlertMessage
                    type="error"
                    message={errors.signature}
                    className="mb-4"
                />
            )}

            {/* タブナビゲーション */}
            <div className="flex gap-2 mb-6 border-b">
                <button
                    onClick={() => setTab("verify")}
                    className={`px-4 py-2 font-medium border-b-2 ${
                        tab === "verify"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                >
                    ユーザー署名確認
                    {userSignature && (
                        <span className="ml-2 text-sm">
                            (
                            {userSignature.status === "signed"
                                ? "署名済み"
                                : "確認中"}
                            )
                        </span>
                    )}
                </button>
                {contract.signature_required_from !== "user" && (
                    <button
                        onClick={() => setTab("sign")}
                        className={`px-4 py-2 font-medium border-b-2 ${
                            tab === "sign"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        管理者署名
                    </button>
                )}
            </div>

            {/* ユーザー署名確認タブ */}
            {tab === "verify" && (
                <div className="space-y-6">
                    {userSignature ? (
                        <>
                            {/* 署名の詳細 */}
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                                <div>
                                    <label className="text-sm text-gray-600">
                                        署名者
                                    </label>
                                    <p className="font-medium">
                                        {userSignature.user?.name ||
                                            userSignature.user?.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">
                                        署名方法
                                    </label>
                                    <p className="font-medium">
                                        {userSignature.method === "canvas"
                                            ? "Canvas署名"
                                            : userSignature.method === "upload"
                                              ? "画像アップロード"
                                              : "テキスト"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">
                                        署名日時
                                    </label>
                                    <p className="font-medium">
                                        {new Date(
                                            userSignature.signed_at,
                                        ).toLocaleString("ja-JP")}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">
                                        ステータス
                                    </label>
                                    <p className="font-medium">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${
                                                userSignature.status ===
                                                "signed"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}
                                        >
                                            {userSignature.status === "signed"
                                                ? "署名済み"
                                                : "確認中"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* 署名プレビュー */}
                            {userSignature.signature_image && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        署名プレビュー
                                    </label>
                                    <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                                        <img
                                            src={userSignature.signature_image}
                                            alt="ユーザー署名"
                                            className="max-w-full max-h-48 mx-auto"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* 承認/却下アクション */}
                            {userSignature.status !== "verified" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            アクション
                                        </label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setVerifyAction("approve")
                                                }
                                                className={`flex-1 px-4 py-2 rounded font-medium transition ${
                                                    verifyAction === "approve"
                                                        ? "bg-green-600 text-white"
                                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                                }`}
                                            >
                                                ✓ 承認
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setVerifyAction("reject")
                                                }
                                                className={`flex-1 px-4 py-2 rounded font-medium transition ${
                                                    verifyAction === "reject"
                                                        ? "bg-red-600 text-white"
                                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                                }`}
                                            >
                                                ✗ 却下
                                            </button>
                                        </div>
                                    </div>

                                    {/* 却下理由 */}
                                    {verifyAction === "reject" && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                却下理由
                                            </label>
                                            <textarea
                                                value={rejectReason}
                                                onChange={(e) =>
                                                    setRejectReason(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="却下理由を入力してください..."
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}

                                    {/* 送信ボタン */}
                                    <button
                                        type="button"
                                        onClick={handleVerifyUserSignature}
                                        disabled={processing || !verifyAction}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                                    >
                                        {processing ? "処理中..." : "確定"}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <AlertMessage
                            type="info"
                            message="ユーザーからの署名をお待ちしています"
                        />
                    )}
                </div>
            )}

            {/* 管理者署名タブ */}
            {tab === "sign" && contract.signature_required_from !== "user" && (
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            下のキャンバスに署名してください
                        </label>
                        {signatureImage ? (
                            <div>
                                <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 mb-4">
                                    <img
                                        src={signatureImage}
                                        alt="署名プレビュー"
                                        className="max-w-full max-h-48 mx-auto"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        変更
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmitAdminSignature}
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {processing
                                            ? "送信中..."
                                            : "署名を送信"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <SignatureCanvas
                                onCapture={handleSignatureCapture}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
