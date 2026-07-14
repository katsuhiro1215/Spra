import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

/**
 * ErrorMessage - エラーメッセージ表示コンポーネント
 * @param {string|array} errors - エラーメッセージ（文字列または配列）
 * @param {string} className - 追加のクラス名
 */
const ErrorMessage = ({ errors, className = "" }) => {
    if (!errors) return null;

    // エラーが配列の場合と文字列の場合に対応
    const errorMessages = Array.isArray(errors) ? errors : [errors];

    return (
        <div
            className={`mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg ${className}`}
        >
            <div className="flex">
                <div className="flex-shrink-0">
                    <ExclamationCircleIcon
                        className="h-5 w-5 text-red-400 dark:text-red-300"
                        aria-hidden="true"
                    />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                        {errorMessages.length === 1
                            ? "入力内容にエラーがあります"
                            : `${errorMessages.length}件のエラーがあります`}
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                        {errorMessages.length === 1 ? (
                            <p>{errorMessages[0]}</p>
                        ) : (
                            <ul className="list-disc list-inside space-y-1">
                                {errorMessages.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorMessage;
