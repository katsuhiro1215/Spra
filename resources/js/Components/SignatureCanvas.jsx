import React, { useRef, useEffect, useState } from "react";

export default function SignatureCanvas({
    onCapture,
    width = 600,
    height = 300,
    disabled = false,
}) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // キャンバスの初期化
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        setContext(ctx);

        // DPI 対応
        const dpi = window.devicePixelRatio || 1;
        canvas.width = width * dpi;
        canvas.height = height * dpi;
        ctx.scale(dpi, dpi);
    }, [width, height]);

    const startDrawing = (e) => {
        if (disabled) return;
        setIsDrawing(true);

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        context?.beginPath();
        context?.moveTo(x, y);
    };

    const draw = (e) => {
        if (!isDrawing || disabled || !context) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        context.lineTo(x, y);
        context.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        context?.closePath();
    };

    const handleTouchStart = (e) => {
        if (disabled) return;
        e.preventDefault();
        setIsDrawing(true);

        const rect = canvasRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        context?.beginPath();
        context?.moveTo(x, y);
    };

    const handleTouchMove = (e) => {
        if (!isDrawing || disabled || !context) return;
        e.preventDefault();

        const rect = canvasRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        context.lineTo(x, y);
        context.stroke();
    };

    const handleTouchEnd = () => {
        setIsDrawing(false);
        context?.closePath();
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        context?.clearRect(0, 0, width, height);
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
    };

    const capture = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // キャンバスを画像として取得
        const imageData = canvas.toDataURL("image/png");
        onCapture(imageData);
    };

    const isEmpty = () => {
        const canvas = canvasRef.current;
        if (!canvas) return true;

        const imageData = context?.getImageData(0, 0, width, height);
        if (!imageData) return true;

        // 透明なピクセルのみかチェック
        const data = imageData.data;
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] > 128) return false;
        }
        return true;
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className={`block w-full border-0 ${!disabled ? "cursor-crosshair" : "cursor-not-allowed"}`}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ touchAction: "none" }}
                />
            </div>

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={clear}
                    disabled={disabled || isEmpty()}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    クリア
                </button>
                <button
                    type="button"
                    onClick={capture}
                    disabled={disabled || isEmpty()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    署名を確認
                </button>
            </div>
        </div>
    );
}
