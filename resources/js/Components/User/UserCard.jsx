import React from "react";

/**
 * UserCard - User側（クライアント向けダッシュボード）専用のCardコンポーネント
 *
 * User側は常にlightモードのみで表示するため、dark: クラスを一切持たない。
 * Components/Card は dark: 前提のバリアント定義（CommonUIConstants.cardVariants）を
 * 使っており、User側でそのまま使うと意図せずダークモードが適用されてしまう。
 *
 * また Components/Card は children を常に px-6 py-4 の div で包むため、
 * UserCardHeader/UserCardBody と組み合わせるとパディングが二重になる。
 * UserCard はラッパーに独自パディングを持たせず、
 * UserCardHeader/UserCardBody/UserCardFooter 側でパディングを持つ。
 *
 * @param {string} variant - カラーバリアント（default, primary, success, warning, danger, info）
 * @param {boolean} hoverable - ホバーエフェクトを有効にする
 * @param {string} className - 追加のCSSクラス
 */
const variantClasses = {
    default: "bg-white border border-gray-200",
    primary: "bg-white border-l-4 border-l-blue-500 border border-gray-200",
    success: "bg-white border-l-4 border-l-green-500 border border-gray-200",
    warning: "bg-white border-l-4 border-l-yellow-500 border border-gray-200",
    danger: "bg-white border-l-4 border-l-red-500 border border-gray-200",
    info: "bg-white border-l-4 border-l-cyan-500 border border-gray-200",
};

const UserCard = ({
    variant = "default",
    hoverable = false,
    className = "",
    children,
    ...props
}) => {
    const hoverClass = hoverable
        ? "transition-shadow duration-300 hover:shadow-md cursor-pointer"
        : "";

    return (
        <div
            className={`rounded-lg shadow-sm overflow-hidden ${variantClasses[variant] || variantClasses.default} ${hoverClass} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default UserCard;
