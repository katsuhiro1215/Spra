import React from "react";

/**
 * UserCardTitle - UserCard 内で使用するタイトル（dark: クラスなし）
 *
 * @param {React.ReactNode} children - タイトルテキスト
 * @param {string} subtitle - サブタイトル
 * @param {React.ReactNode} icon - タイトルの横に表示するアイコン
 * @param {string} size - タイトルのサイズ（sm, md, lg, xl）
 */
const sizeClasses = {
    sm: "text-sm font-medium",
    md: "text-lg font-semibold",
    lg: "text-xl font-bold",
    xl: "text-2xl font-bold",
};

const UserCardTitle = ({
    children,
    subtitle = null,
    icon = null,
    size = "md",
    className = "",
    ...props
}) => {
    return (
        <div className={className} {...props}>
            <div className="flex items-center space-x-2">
                {icon && <div className="flex-shrink-0">{icon}</div>}
                <h3 className={`text-gray-900 ${sizeClasses[size]}`}>
                    {children}
                </h3>
            </div>
            {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
        </div>
    );
};

export default UserCardTitle;
