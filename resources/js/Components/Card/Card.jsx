import React from "react";
import { CommonUIConstants } from "@/Constants/CommonUIConstants";

/**
 * Card - 基本的なカードコンポーネント
 *
 * @param {string} variant - カードのバリアント（default, primary, success, warning, danger, info, bordered, elevated）
 * @param {React.ReactNode} header - ヘッダーコンテンツ
 * @param {React.ReactNode} children - カードのメインコンテンツ
 * @param {React.ReactNode} footer - フッターコンテンツ
 * @param {string} className - 追加のCSSクラス
 * @param {boolean} hoverable - ホバーエフェクトを有効にする
 */
const Card = ({
    variant = "default",
    header = null,
    children,
    footer = null,
    className = "",
    hoverable = false,
    ...props
}) => {
    const variantClasses =
        CommonUIConstants.cardVariants[variant] ||
        CommonUIConstants.cardVariants.default;

    const hoverClass = hoverable
        ? "transition-shadow duration-300 hover:shadow-xl cursor-pointer"
        : "";

    return (
        <div
            className={`rounded-lg ${variantClasses.card} ${hoverClass} ${className}`}
            {...props}
        >
            {header && (
                <div className={`px-6 py-4 rounded-t-lg ${variantClasses.header}`}>
                    {header}
                </div>
            )}

            <div className="px-6 py-4">{children}</div>

            {footer && (
                <div className={`px-6 py-4 rounded-b-lg ${variantClasses.footer}`}>
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
