import React from "react";
import BaseAlert from "./BaseAlert";

const SuccessAlert = ({
    isOpen,
    onClose,
    title = "処理完了",
    message = "処理が正常に完了しました。",
    confirmText = "OK",
    autoClose = true,
    autoCloseDelay = 3000,
}) => {
    // 自動で閉じる機能
    React.useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);

            return () => clearTimeout(timer);
        }
    }, [isOpen, autoClose, autoCloseDelay, onClose]);

    return (
        <BaseAlert
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onClose}
            title={title}
            message={message}
            type="success"
            confirmText={confirmText}
            showCancel={false}
            size="sm"
        />
    );
};

export default SuccessAlert;
