import React, { useState, useRef, useEffect } from "react";

export default function DigitalStamp({ onStampChange }) {
    const canvasRef = useRef(null);
    const [stampText, setStampText] = useState("");
    const [stampImage, setStampImage] = useState(null);

    // スタンプを描画
    const drawStamp = (text) => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;

        // キャンバスを白でクリア（mPDFの透明処理対応）
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);

        if (!text || text.trim() === "") {
            setStampImage(null);
            onStampChange(null);
            return;
        }

        // 円形スタンプの描画
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 10;

        // 赤い円線（背景なし）
        ctx.strokeStyle = "#dc2626"; // red-600
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();

        // テキストを描画（赤色、中央に配置）
        ctx.fillStyle = "#dc2626"; // red-600
        ctx.font = `bold ${Math.min(width, height) / 3}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // テキストが円内に収まるようにサイズ調整
        let fontSize = Math.min(width, height) / 3;
        while (fontSize > 10) {
            ctx.font = `bold ${fontSize}px sans-serif`;
            const metrics = ctx.measureText(text);
            if (metrics.width < radius * 1.6) break;
            fontSize -= 2;
        }

        ctx.fillText(text, centerX, centerY);

        // Base64 画像を取得（白い背景付き）
        const dataUrl = canvas.toDataURL("image/png");
        setStampImage(dataUrl);
        onStampChange(dataUrl);
    };

    // テキスト入力時の処理
    const handleTextChange = (e) => {
        const text = e.target.value;
        setStampText(text);
        drawStamp(text);
    };

    // クリア
    const handleClear = () => {
        setStampText("");
        drawStamp("");
    };

    return (
        <div className="space-y-4">
            {/* テキスト入力フィールド */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    印鑑名（例：山田太郎）
                </label>
                <input
                    type="text"
                    value={stampText}
                    onChange={handleTextChange}
                    placeholder="1～5文字で入力してください"
                    maxLength="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    入力した文字が円形の印鑑になります
                </p>
            </div>

            {/* スタンプ表示キャンバス */}
            <div className="flex flex-col items-center gap-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white dark:bg-gray-800">
                    <canvas
                        ref={canvasRef}
                        width={200}
                        height={200}
                        className="border border-gray-200 rounded"
                        style={{ backgroundColor: "transparent" }}
                    />
                </div>
                {stampImage && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                        ✓ 印鑑が作成されました
                    </p>
                )}
            </div>

            {/* クリアボタン */}
            {stampText && (
                <button
                    onClick={handleClear}
                    className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    クリア
                </button>
            )}
        </div>
    );
}
