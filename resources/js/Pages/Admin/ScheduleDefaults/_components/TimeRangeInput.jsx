import React from "react";

/**
 * TimeRangeInput - 時間範囲入力コンポーネント
 * @param {string} label - ラベルテキスト
 * @param {string} startValue - 開始時間の値
 * @param {string} endValue - 終了時間の値
 * @param {function} onStartChange - 開始時間変更ハンドラー
 * @param {function} onEndChange - 終了時間変更ハンドラー
 * @param {boolean} disabled - 無効状態
 */
const TimeRangeInput = ({
    label,
    startValue,
    endValue,
    onStartChange,
    onEndChange,
    disabled = false,
}) => {
    const inputClassName =
        "border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                {label}
            </label>
            <div className="flex items-center space-x-2">
                <input
                    type="time"
                    value={startValue || ""}
                    onChange={onStartChange}
                    disabled={disabled}
                    className={inputClassName}
                />
                <span className="text-gray-500 dark:text-gray-400">〜</span>
                <input
                    type="time"
                    value={endValue || ""}
                    onChange={onEndChange}
                    disabled={disabled}
                    className={inputClassName}
                />
            </div>
        </div>
    );
};

export default TimeRangeInput;
