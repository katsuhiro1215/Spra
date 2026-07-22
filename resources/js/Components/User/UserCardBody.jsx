import React from "react";

/**
 * UserCardBody - UserCard のボディ（dark: クラスなし）
 */
const UserCardBody = ({ children, className = "", ...props }) => {
    return (
        <div className={`px-6 py-4 ${className}`} {...props}>
            {children}
        </div>
    );
};

export default UserCardBody;
