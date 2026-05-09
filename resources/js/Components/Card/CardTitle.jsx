import React from "react";

/**
 * CardTitle - カード内で使用するタイトルコンポーネント
 *
 * @param {React.ReactNode} children - タイトルテキスト
 * @param {string} subtitle - サブタイトル
 * @param {React.ReactNode} icon - タイトルの横に表示するアイコン
 * @param {string} size - タイトルのサイズ（sm, md, lg, xl）
 * @param {string} className - 追加のCSSクラス
 */
const CardTitle = ({
    children,
    subtitle = null,
    icon = null,
    size = "md",
    className = "",
    ...props
}) => {
    const sizeClasses = {
        sm: "text-sm font-medium",
        md: "text-lg font-semibold",
        lg: "text-xl font-bold",
        xl: "text-2xl font-bold",
    };

    return (
        <div className={className} {...props}>
            <div className="flex items-center space-x-2">
                {icon && <div className="flex-shrink-0">{icon}</div>}
                <h3
                    className={`text-gray-900 dark:text-white ${sizeClasses[size]}`}
                >
                    {children}
                </h3>
            </div>
            {subtitle && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default CardTitle;
