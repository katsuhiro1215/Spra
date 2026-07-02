import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import SignatureCanvas from "./SignatureCanvas";
import AlertMessage from "./AlertMessage";

export default function UserSignatureForm({ contract, onSuccess }) {
    const { post, processing, errors } = useForm();
    const [signatureImage, setSignatureImage] = useState(null);
    const [method, setMethod] = useState("canvas");
    const [previewOpen, setPreviewOpen] = useState(false);

    const handleSignatureCapture = (imageData) => {
        setSignatureImage(imageData);
        setMethod("canvas");
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setSignatureImage(event.target?.result);
            setMethod("upload");
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!signatureImage) {
            alert("署名を入力してください");
            return;
        }

        post(route("admin.contract.signature.user.store", contract.id), {
            data: {
                signature_image: signatureImage,
                method: method,
            },
            onSuccess: () => {
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
            <h3 className="text-lg font-bold mb-4">契約書に署名</h3>

            {errors.signature && (
                <AlertMessage
                    type="error"
                    message={errors.signature}
                    className="mb-4"
                />
            )}

            <div className="space-y-6">
                {/* 署名方法の選択 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        署名方法を選択
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="method"
                                value="canvas"
                                checked={method === "canvas" && !signatureImage}
                                onChange={() => {
                                    setMethod("canvas");
                                    handleClear();
                                }}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Canvas署名</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="method"
                                value="upload"
                                onChange={() => setMethod("upload")}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">画像アップロード</span>
                        </label>
                    </div>
                </div>

                {/* Canvas署名 */}
                {method === "canvas" && !signatureImage && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            下のキャンバスに署名してください
                        </label>
                        <SignatureCanvas
                            onCapture={handleSignatureCapture}
                            width={600}
                            height={200}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            タッチデバイスでもご利用いただけます
                        </p>
                    </div>
                )}

                {/* ファイルアップロード */}
                {method === "upload" && !signatureImage && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            署名画像をアップロード
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                        />
                    </div>
                )}

                {/* 署名プレビュー */}
                {signatureImage && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                署名プレビュー
                            </label>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                変更
                            </button>
                        </div>
                        <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                            <img
                                src={signatureImage}
                                alt="署名プレビュー"
                                className="max-w-full max-h-48 mx-auto"
                            />
                        </div>
                    </div>
                )}

                {/* 確認事項 */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p className="text-sm text-gray-700">
                        ✓ 提供いただいた署名は契約書の確認として保存されます
                    </p>
                    <p className="text-sm text-gray-700">
                        ✓ 管理者の確認後に正式な契約として扱われます
                    </p>
                </div>

                {/* 送信ボタン */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={processing || !signatureImage}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                        {processing ? "送信中..." : "署名を送信"}
                    </button>
                </div>
            </div>
        </div>
    );
}
