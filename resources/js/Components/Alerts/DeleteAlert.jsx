import React from "react";
import BaseAlert from "@/Components/Alerts/BaseAlert";

const DeleteAlert = ({
    show,
    onClose,
    onConfirm,
    itemName = "",
    deleteUrl = null,
    customMessage = null,
}) => {
    const title = "削除の確認";
    const message =
        customMessage ||
        `${
            itemName ? `「${itemName}」を` : ""
        }本当に削除しますか？この操作は元に戻せません。`;

    return (
        <BaseAlert
            isOpen={show}
            onClose={onClose}
            onConfirm={onConfirm}
            title={title}
            message={message}
            type="error"
            confirmText="削除する"
            cancelText="キャンセル"
            actionUrl={deleteUrl}
            method="delete"
            loadingText="削除中..."
        />
    );
};

export default DeleteAlert;
