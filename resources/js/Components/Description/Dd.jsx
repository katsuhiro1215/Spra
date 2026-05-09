import React from "react";

/**
 * Description Details Component (dd)
 * @param {React.ReactNode} children - 詳細テキスト
 * @param {string} className - 追加のCSSクラス
 * @param {string} size - テキストサイズ (sm, base, lg)
 * @param {string} color - テキストカラー (default, muted, primary, success, danger)
 */
export default function Dd({
    children,
    className = "",
    size = "base",
    color = "default",
    ...props
}) {
    const sizes = {
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
    };

    const colors = {
        default: "text-gray-900 dark:text-gray-100",
        muted: "text-gray-600 dark:text-gray-400",
        primary: "text-blue-600 dark:text-blue-400",
        success: "text-green-600 dark:text-green-400",
        danger: "text-red-600 dark:text-red-400",
    };

    // 子要素がnullまたはundefinedの場合、デフォルトテキストを表示
    const displayChildren = children ?? "---";

    return (
        <dd
            className={`${sizes[size]} ${colors[color]} ${className}`}
            {...props}
        >
            {displayChildren}
        </dd>
    );
}
