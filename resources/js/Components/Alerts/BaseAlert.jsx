import React, { useState } from "react";
import { router } from "@inertiajs/react";

const BaseAlert = ({
    isOpen,
    onClose,
    onConfirm,
    onCancel,
    title,
    message,
    type = "info", // 'success', 'warning', 'error', 'info', 'confirm'
    confirmText = "確認",
    cancelText = "キャンセル",
    showCancel = true,
    isLoading = false,
    loadingText = "処理中...",
    size = "md", // 'sm', 'md', 'lg', 'xl'
    children,
    actionUrl = null,
    method = "post",
    className = "",
}) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = async () => {
        setIsProcessing(true);

        try {
            if (actionUrl) {
                // Inertia.jsを使用してサーバーにリクエストを送信
                await router.visit(actionUrl, {
                    method: method,
                    onSuccess: () => {
                        onClose();
                        setIsProcessing(false);
                    },
                    onError: () => {
                        setIsProcessing(false);
                    },
                });
            } else if (onConfirm) {
                // カスタムハンドラを実行
                await onConfirm();
                if (!isLoading) {
                    onClose();
                }
            }
        } catch (error) {
            console.error("処理エラー:", error);
            setIsProcessing(false);
        } finally {
            if (!actionUrl && !isLoading) {
                setIsProcessing(false);
            }
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    const getIconConfig = (alertType) => {
        switch (alertType) {
            case "success":
                return {
                    bgColor: "bg-green-100",
                    iconColor: "text-green-600",
                    confirmColor: "bg-green-600 hover:bg-green-500",
                    icon: (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    ),
                };
            case "warning":
                return {
                    bgColor: "bg-yellow-100",
                    iconColor: "text-yellow-600",
                    confirmColor: "bg-yellow-600 hover:bg-yellow-500",
                    icon: (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                    ),
                };
            case "error":
                return {
                    bgColor: "bg-red-100",
                    iconColor: "text-red-600",
                    confirmColor: "bg-red-600 hover:bg-red-500",
                    icon: (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                        />
                    ),
                };
            case "confirm":
                return {
                    bgColor: "bg-blue-100",
                    iconColor: "text-blue-600",
                    confirmColor: "bg-blue-600 hover:bg-blue-500",
                    icon: (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                        />
                    ),
                };
            default: // info
                return {
                    bgColor: "bg-blue-100",
                    iconColor: "text-blue-600",
                    confirmColor: "bg-blue-600 hover:bg-blue-500",
                    icon: (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                    ),
                };
        }
    };

    const getSizeClasses = (alertSize) => {
        switch (alertSize) {
            case "sm":
                return "sm:max-w-sm";
            case "lg":
                return "sm:max-w-2xl";
            case "xl":
                return "sm:max-w-4xl";
            default: // md
                return "sm:max-w-lg";
        }
    };

    const iconConfig = getIconConfig(type);
    const sizeClasses = getSizeClasses(size);
    const loading = isLoading || isProcessing;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* オーバーレイ */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={!loading ? onClose : undefined}
            ></div>

            {/* モーダル */}
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div
                    className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full ${sizeClasses} ${className}`}
                >
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            {/* アイコン */}
                            <div
                                className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconConfig.bgColor} sm:mx-0 sm:h-10 sm:w-10`}
                            >
                                <svg
                                    className={`h-6 w-6 ${iconConfig.iconColor}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                >
                                    {iconConfig.icon}
                                </svg>
                            </div>

                            {/* コンテンツ */}
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                {title && (
                                    <h3 className="text-base font-semibold leading-6 text-gray-900 mb-2">
                                        {title}
                                    </h3>
                                )}
                                <div className="mt-2">
                                    {message && (
                                        <p className="text-sm text-gray-500 mb-4">
                                            {message}
                                        </p>
                                    )}
                                    {children && (
                                        <div className="mt-4">{children}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ボタン */}
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                            type="button"
                            disabled={loading}
                            onClick={handleConfirm}
                            className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto ${iconConfig.confirmColor}`}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    {loadingText}
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>

                        {showCancel && (
                            <button
                                type="button"
                                disabled={loading}
                                onClick={handleCancel}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 sm:w-auto"
                            >
                                {cancelText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BaseAlert;
