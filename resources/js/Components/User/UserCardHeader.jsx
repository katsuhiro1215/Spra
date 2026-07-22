import React from "react";

/**
 * UserCardHeader - UserCard のヘッダー（dark: クラスなし）
 */
const UserCardHeader = ({ children, className = "", ...props }) => {
    return (
        <div
            className={`px-6 py-4 border-b border-gray-200 bg-gray-50 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default UserCardHeader;
