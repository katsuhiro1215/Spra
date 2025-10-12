import React from "react";
import BaseAlert from "./BaseAlert";

const ServicePublishAlert = ({
    isOpen,
    onClose,
    onConfirm,
    serviceDetails = {},
    publishUrl = null,
}) => {
    const title = "サービスの公開";

    return (
        <BaseAlert
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title={title}
            message="このサービスをホームページ上に公開しますか？公開後はお客様が閲覧・申し込みできるようになります。"
            type="confirm"
            confirmText="公開する"
            cancelText="キャンセル"
            actionUrl={publishUrl}
            method="patch"
            loadingText="公開中..."
            size="lg"
        >
            {/* サービス詳細の表示 */}
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-gray-900 mb-3">
                    公開するサービス
                </h4>
                <div className="space-y-3">
                    {serviceDetails.name && (
                        <div>
                            <span className="text-gray-600 text-sm">
                                サービス名:
                            </span>
                            <p className="font-medium text-gray-900">
                                {serviceDetails.name}
                            </p>
                        </div>
                    )}
                    {serviceDetails.category && (
                        <div>
                            <span className="text-gray-600 text-sm">
                                カテゴリ:
                            </span>
                            <p className="font-medium text-gray-900">
                                {serviceDetails.category}
                            </p>
                        </div>
                    )}
                    {serviceDetails.price && (
                        <div>
                            <span className="text-gray-600 text-sm">価格:</span>
                            <p className="font-medium text-blue-600">
                                ¥{serviceDetails.price.toLocaleString()}
                                {serviceDetails.priceUnit &&
                                    ` / ${serviceDetails.priceUnit}`}
                            </p>
                        </div>
                    )}
                    {serviceDetails.description && (
                        <div>
                            <span className="text-gray-600 text-sm">説明:</span>
                            <p className="text-gray-900 text-sm leading-relaxed mt-1">
                                {serviceDetails.description.length > 100
                                    ? `${serviceDetails.description.substring(
                                          0,
                                          100
                                      )}...`
                                    : serviceDetails.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* 公開に関する注意事項 */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-5 w-5 text-blue-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <strong>ご注意:</strong>{" "}
                            公開後はお客様がこのサービスを閲覧・申し込みできるようになります。内容に間違いがないか再度ご確認ください。
                        </p>
                    </div>
                </div>
            </div>
        </BaseAlert>
    );
};

export default ServicePublishAlert;
