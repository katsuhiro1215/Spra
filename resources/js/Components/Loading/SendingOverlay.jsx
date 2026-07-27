import React from "react";

/**
 * メール送信など、完了まで時間のかかる重い処理の実行中に
 * 二重クリックを防ぐための画面中央スピナーオーバーレイ。
 * 確認ダイアログ（z-50）より手前に出るよう z-[100] にしている。
 */
export default function SendingOverlay({ show, message = "送信中..." }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 dark:bg-gray-950/60">
            <div className="flex flex-col items-center gap-3 rounded-lg bg-white dark:bg-gray-800 px-8 py-6 shadow-xl">
                <svg
                    className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {message}
                </p>
            </div>
        </div>
    );
}
