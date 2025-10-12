import React from "react";
import BaseAlert from "./BaseAlert";

const ContractConfirmAlert = ({
    isOpen,
    onClose,
    onConfirm,
    contractDetails = {},
    confirmUrl = null,
}) => {
    const title = "契約の確定";

    return (
        <BaseAlert
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title={title}
            message="以下の内容で契約を確定しますか？確定後の変更はできません。"
            type="warning"
            confirmText="契約を確定する"
            cancelText="キャンセル"
            actionUrl={confirmUrl}
            method="post"
            loadingText="契約確定中..."
            size="lg"
        >
            {/* 契約詳細の表示 */}
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-gray-900 mb-3">契約内容</h4>
                <div className="space-y-2 text-sm">
                    {contractDetails.serviceName && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">サービス名:</span>
                            <span className="font-medium">
                                {contractDetails.serviceName}
                            </span>
                        </div>
                    )}
                    {contractDetails.contractPeriod && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">契約期間:</span>
                            <span className="font-medium">
                                {contractDetails.contractPeriod}
                            </span>
                        </div>
                    )}
                    {contractDetails.price && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">契約金額:</span>
                            <span className="font-medium text-blue-600">
                                ¥{contractDetails.price.toLocaleString()}
                            </span>
                        </div>
                    )}
                    {contractDetails.startDate && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">開始日:</span>
                            <span className="font-medium">
                                {contractDetails.startDate}
                            </span>
                        </div>
                    )}
                    {contractDetails.endDate && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">終了日:</span>
                            <span className="font-medium">
                                {contractDetails.endDate}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </BaseAlert>
    );
};

export default ContractConfirmAlert;
