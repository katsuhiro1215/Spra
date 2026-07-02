import React from "react";

export default function AlertMessage({
    type = "info",
    message,
    title,
    className = "",
    onClose,
}) {
    const styles = {
        info: {
            container: "bg-blue-50 border-l-4 border-blue-500",
            title: "text-blue-900",
            message: "text-blue-800",
        },
        success: {
            container: "bg-green-50 border-l-4 border-green-500",
            title: "text-green-900",
            message: "text-green-800",
        },
        warning: {
            container: "bg-yellow-50 border-l-4 border-yellow-500",
            title: "text-yellow-900",
            message: "text-yellow-800",
        },
        error: {
            container: "bg-red-50 border-l-4 border-red-500",
            title: "text-red-900",
            message: "text-red-800",
        },
    };

    const style = styles[type] || styles.info;

    return (
        <div className={`${style.container} p-4 rounded ${className}`}>
            <div className="flex items-start justify-between">
                <div>
                    {title && (
                        <p className={`font-bold ${style.title}`}>{title}</p>
                    )}
                    <p className={`text-sm ${style.message}`}>{message}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`ml-4 text-${type}-600 hover:text-${type}-800`}
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}
