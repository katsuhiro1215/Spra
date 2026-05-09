import { useState, useEffect, useRef } from "react";

const colorPalette = [
    // グレースケール
    [
        "#000000",
        "#374151",
        "#6B7280",
        "#9CA3AF",
        "#D1D5DB",
        "#F3F4F6",
        "#FFFFFF",
    ],
    // ブルー系
    [
        "#1E3A8A",
        "#1E40AF",
        "#2563EB",
        "#3B82F6",
        "#60A5FA",
        "#93C5FD",
        "#DBEAFE",
    ],
    // グリーン系
    [
        "#14532D",
        "#15803D",
        "#16A34A",
        "#22C55E",
        "#4ADE80",
        "#86EFAC",
        "#D1FAE5",
    ],
    // レッド系
    [
        "#7F1D1D",
        "#991B1B",
        "#DC2626",
        "#EF4444",
        "#F87171",
        "#FCA5A5",
        "#FEE2E2",
    ],
    // イエロー系
    [
        "#713F12",
        "#92400E",
        "#D97706",
        "#F59E0B",
        "#FBBF24",
        "#FCD34D",
        "#FEF3C7",
    ],
    // パープル系
    [
        "#581C87",
        "#6B21A8",
        "#7C3AED",
        "#8B5CF6",
        "#A78BFA",
        "#C4B5FD",
        "#EDE9FE",
    ],
    // ピンク系
    [
        "#831843",
        "#9F1239",
        "#E11D48",
        "#F43F5E",
        "#FB7185",
        "#FDA4AF",
        "#FCE7F3",
    ],
];

export default function ColorInput({
    value = "#000000",
    onChange,
    disabled = false,
    showPalette = true,
    className = "",
}) {
    const [localValue, setLocalValue] = useState(value || "#000000");
    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef(null);

    useEffect(() => {
        setLocalValue(value || "#000000");
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target)
            ) {
                setShowPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const updateColor = (color) => {
        setLocalValue(color);
        onChange?.(color);
        setShowPicker(false);
    };

    const handleInput = (e) => {
        const val = e.target.value;
        setLocalValue(val);
        onChange?.(val);
    };

    return (
        <div className={`relative ${className}`}>
            <div className="flex items-center gap-3">
                {/* カラープレビューとピッカー */}
                <div className="relative" ref={pickerRef}>
                    <button
                        type="button"
                        onClick={() => !disabled && setShowPicker(!showPicker)}
                        disabled={disabled}
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: localValue }}
                    >
                        <span className="sr-only">カラーを選択</span>
                    </button>

                    {/* カラーパレットドロップダウン */}
                    {showPicker && showPalette && (
                        <div
                            className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3"
                            style={{ minWidth: "280px" }}
                        >
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    カラーパレット
                                </p>
                                {colorPalette.map((row, rowIndex) => (
                                    <div key={rowIndex} className="flex gap-1">
                                        {row.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() =>
                                                    updateColor(color)
                                                }
                                                className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 hover:border-blue-500 ${
                                                    color === localValue
                                                        ? "border-blue-500 ring-2 ring-blue-200"
                                                        : "border-gray-300"
                                                }`}
                                                style={{
                                                    backgroundColor: color,
                                                }}
                                            >
                                                <span className="sr-only">
                                                    {color}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* テキスト入力 */}
                <div className="flex-1">
                    <input
                        type="text"
                        value={localValue}
                        onChange={handleInput}
                        disabled={disabled}
                        placeholder="#000000"
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
                    />
                </div>

                {/* ネイティブカラーピッカー */}
                <input
                    type="color"
                    value={localValue}
                    onChange={handleInput}
                    disabled={disabled}
                    className="w-12 h-12 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
        </div>
    );
}
