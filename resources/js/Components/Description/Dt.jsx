import React from "react";

/**
 * Description Term Component (dt)
 * @param {React.ReactNode} children - ラベルテキスト
 * @param {string} className - 追加のCSSクラス
 * @param {string} size - テキストサイズ (sm, base, lg)
 * @param {boolean} required - 必須マーク表示
 */
export default function Dt({
    children,
    className = "",
    size = "base",
    required = false,
    ...props
}) {
    const sizes = {
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
    };

    return (
        <dt
            className={`${sizes[size]} font-medium text-gray-700 dark:text-gray-300 ${className}`}
            {...props}
        >
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </dt>
    );
}
