import React from "react";

/**
 * Description List Component (dl)
 * @param {React.ReactNode} children - 子要素（Dt, Dd要素）
 * @param {string} className - 追加のCSSクラス
 * @param {string} variant - スタイルバリアント (default, striped, divided, bordered)
 */
export default function Dl({
    children,
    className = "",
    variant = "default",
    ...props
}) {
    const variants = {
        default: "space-y-4",
        striped: "divide-y divide-gray-200 dark:divide-gray-700",
        divided: "space-y-2 divide-y divide-gray-100 dark:divide-gray-800",
        bordered:
            "border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3",
    };

    return (
        <dl className={`${variants[variant]} ${className}`} {...props}>
            {children}
        </dl>
    );
}
