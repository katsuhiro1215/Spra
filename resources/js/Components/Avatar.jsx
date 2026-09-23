import React from "react";
import { getPrimaryBackgroundStyle } from "@/Utils/themeUtils";

/**
 * Avatar Component
 * @param {string} src - 画像URL
 * @param {string} alt - 代替テキスト
 * @param {string} name - 名前（画像がない場合のイニシャル表示用）
 * @param {string} size - サイズ (xs, sm, md, lg, xl, 2xl)
 * @param {string} rounded - 角の丸み (none, sm, md, lg, full)
 * @param {string} variant - カラーバリアント (primary, secondary, success, danger, warning, info, gray)
 * @param {string} className - 追加のCSSクラス
 * @param {React.ReactNode} badge - 右下に重ねて表示する小さなバッジ要素（省略可）
 */
export default function Avatar({
    src,
    alt,
    name,
    size = "md",
    rounded = "full",
    variant = "primary",
    className = "",
    badge,
    ...props
}) {
    const sizes = {
        xs: "w-6 h-6 text-xs",
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-base",
        lg: "w-16 h-16 text-lg",
        xl: "w-20 h-20 text-xl",
        "2xl": "w-24 h-24 text-2xl",
    };

    const roundedStyles = {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
    };

    const colorVariants = {
        primary: "bg-blue-500 text-white",
        secondary: "bg-gray-500 text-white",
        success: "bg-green-500 text-white",
        danger: "bg-red-500 text-white",
        warning: "bg-yellow-500 text-white",
        info: "bg-cyan-500 text-white",
        gray: "bg-gray-300 text-gray-700",
    };

    // イニシャルを生成
    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // プライマリカラーのカスタムスタイルを適用
    const customStyle =
        variant === "primary" ? getPrimaryBackgroundStyle(false, 1) : {};

    // 画像がある場合
    const avatarElement = src ? (
        <img
            src={src}
            alt={alt || name || "Avatar"}
            className={`${sizes[size]} ${roundedStyles[rounded]} object-cover ${className}`}
            {...props}
        />
    ) : (
        // 画像がない場合、イニシャルを表示
        <div
            className={`${sizes[size]} ${roundedStyles[rounded]} ${
                variant === "primary" ? "" : colorVariants[variant]
            } flex items-center justify-center font-semibold ${className}`}
            style={customStyle}
            {...props}
        >
            {getInitials(name)}
        </div>
    );

    if (!badge) {
        return avatarElement;
    }

    return (
        <div className="relative inline-block">
            {avatarElement}
            <div className="absolute -bottom-0.5 -right-0.5">{badge}</div>
        </div>
    );
}
