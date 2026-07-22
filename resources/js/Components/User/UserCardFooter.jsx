import React from "react";

/**
 * UserCardFooter - UserCard のフッター（dark: クラスなし）
 */
const UserCardFooter = ({ children, className = "", ...props }) => {
    return (
        <div
            className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default UserCardFooter;
