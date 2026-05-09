import React from "react";

/**
 * CardHeader - カードのヘッダーコンポーネント
 */
const CardHeader = ({ children, className = "", ...props }) => {
    return (
        <div
            className={`px-6 py-4 text-slate-500 dark:text-slate-400 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default CardHeader;
