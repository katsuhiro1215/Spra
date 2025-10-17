import React from "react";
import BaseAlert from "./BaseAlert";

const ConfirmAlert = ({
    isOpen,
    onClose,
    onConfirm,
    title = "確認",
    message = "この操作を実行しますか？",
    confirmText = "実行",
    cancelText = "キャンセル",
    type = "confirm", // 'info', 'warning', 'confirm'
    actionUrl = null,
    method = "post",
    children,
}) => {
    return (
        <BaseAlert
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title={title}
            message={message}
            type={type}
            confirmText={confirmText}
            cancelText={cancelText}
            actionUrl={actionUrl}
            method={method}
            loadingText="処理中..."
        >
            {children}
        </BaseAlert>
    );
};

export default ConfirmAlert;
