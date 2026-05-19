import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

/**
 * PublicFlashMessage - クライアント向けフラッシュメッセージ
 * 画面中央にモーダル風に表示され、より視認性の高いデザイン
 */
const PublicFlashMessage = () => {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (flash?.success || flash?.error || flash?.warning || flash?.info) {
            const messageData = {
                type: flash.success
                    ? "success"
                    : flash.error
                      ? "error"
                      : flash.warning
                        ? "warning"
                        : "info",
                text:
                    flash.success || flash.error || flash.warning || flash.info,
            };

            setMessage(messageData);
            setVisible(true);

            // 成功メッセージは5秒後に自動で消える
            // エラーメッセージは手動で閉じる必要がある
            if (messageData.type === "success" || messageData.type === "info") {
                const timer = setTimeout(() => {
                    setVisible(false);
                }, 5000);

                return () => clearTimeout(timer);
            }
        }
    }, [flash]);

    const handleClose = () => {
        setVisible(false);
    };

    if (!visible || !message) {
        return null;
    }

    const getTypeConfig = (type) => {
        switch (type) {
            case "success":
                return {
                    bgColor: "bg-green-50",
                    borderColor: "border-green-500",
                    textColor: "text-green-900",
                    iconColor: "text-green-600",
                    icon: CheckCircleIcon,
                    title: "送信完了",
                };
            case "error":
                return {
                    bgColor: "bg-red-50",
                    borderColor: "border-red-500",
                    textColor: "text-red-900",
                    iconColor: "text-red-600",
                    icon: ExclamationCircleIcon,
                    title: "エラー",
                };
            case "warning":
                return {
                    bgColor: "bg-yellow-50",
                    borderColor: "border-yellow-500",
                    textColor: "text-yellow-900",
                    iconColor: "text-yellow-600",
                    icon: ExclamationTriangleIcon,
                    title: "警告",
                };
            case "info":
                return {
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-500",
                    textColor: "text-blue-900",
                    iconColor: "text-blue-600",
                    icon: InformationCircleIcon,
                    title: "お知らせ",
                };
            default:
                return {
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-500",
                    textColor: "text-gray-900",
                    iconColor: "text-gray-600",
                    icon: InformationCircleIcon,
                    title: "メッセージ",
                };
        }
    };

    const config = getTypeConfig(message.type);
    const Icon = config.icon;

    return (
        <>
            {/* オーバーレイ */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn"
                onClick={handleClose}
            >
                {/* メッセージカード */}
                <div
                    className={`${config.bgColor} border-l-4 ${config.borderColor} rounded-xl shadow-2xl max-w-md w-full p-6 animate-slideInDown`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start">
                        {/* アイコン */}
                        <div
                            className={`flex-shrink-0 ${config.iconColor} mt-1`}
                        >
                            <Icon className="h-8 w-8" />
                        </div>

                        {/* メッセージ内容 */}
                        <div className="ml-4 flex-1">
                            <h3
                                className={`text-lg font-bold ${config.textColor} mb-2`}
                            >
                                {config.title}
                            </h3>
                            <p className={`text-sm ${config.textColor}`}>
                                {message.text}
                            </p>
                        </div>

                        {/* 閉じるボタン */}
                        <button
                            onClick={handleClose}
                            className={`flex-shrink-0 ml-4 ${config.textColor} hover:opacity-70 transition-opacity`}
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* 閉じるボタン（下部） */}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleClose}
                            className={`px-4 py-2 ${config.bgColor} ${config.textColor} border ${config.borderColor} rounded-lg font-medium hover:opacity-80 transition-opacity`}
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PublicFlashMessage;
