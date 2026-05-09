import React from "react";
import { CommonUIConstants } from "@/Constants/CommonUIConstants";

/**
 * CardWithImage - 画像付きカードコンポーネント
 *
 * @param {string} image - 画像URL
 * @param {string} imageAlt - 画像の代替テキスト
 * @param {string} imagePosition - 画像の位置（top, left, right）
 * @param {string} imageHeight - 画像の高さ（top位置の場合）
 * @param {string} variant - カードのバリアント
 * @param {React.ReactNode} header - ヘッダーコンテンツ
 * @param {React.ReactNode} children - カードのメインコンテンツ
 * @param {React.ReactNode} footer - フッターコンテンツ
 * @param {string} className - 追加のCSSクラス
 * @param {boolean} hoverable - ホバーエフェクトを有効にする
 * @param {React.ReactNode} imageBadge - 画像上に表示するバッジ
 */
const CardWithImage = ({
    image,
    imageAlt = "",
    imagePosition = "top",
    imageHeight = "h-48",
    variant = "default",
    header = null,
    children,
    footer = null,
    className = "",
    hoverable = false,
    imageBadge = null,
    ...props
}) => {
    const variantClasses =
        CommonUIConstants.cardVariants[variant] ||
        CommonUIConstants.cardVariants.default;

    const hoverClass = hoverable
        ? "transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        : "";

    const renderImage = () => (
        <div className="relative overflow-hidden">
            <img
                src={image}
                alt={imageAlt}
                className={`w-full ${imageHeight} object-cover transition-transform duration-300 hover:scale-105`}
            />
            {imageBadge && (
                <div className="absolute top-4 right-4">{imageBadge}</div>
            )}
        </div>
    );

    const renderContent = () => (
        <>
            {header && (
                <div className={`px-6 py-4 ${variantClasses.header}`}>
                    {header}
                </div>
            )}

            <div className="px-6 py-4">{children}</div>

            {footer && (
                <div className={`px-6 py-4 ${variantClasses.footer}`}>
                    {footer}
                </div>
            )}
        </>
    );

    // 画像が上部の場合（デフォルト）
    if (imagePosition === "top") {
        return (
            <div
                className={`rounded-lg overflow-hidden ${variantClasses.card} ${hoverClass} ${className}`}
                {...props}
            >
                {renderImage()}
                {renderContent()}
            </div>
        );
    }

    // 画像が左側の場合
    if (imagePosition === "left") {
        return (
            <div
                className={`rounded-lg overflow-hidden ${variantClasses.card} ${hoverClass} ${className} flex`}
                {...props}
            >
                <div className="w-1/3">{renderImage()}</div>
                <div className="flex-1">{renderContent()}</div>
            </div>
        );
    }

    // 画像が右側の場合
    if (imagePosition === "right") {
        return (
            <div
                className={`rounded-lg overflow-hidden ${variantClasses.card} ${hoverClass} ${className} flex`}
                {...props}
            >
                <div className="flex-1">{renderContent()}</div>
                <div className="w-1/3">{renderImage()}</div>
            </div>
        );
    }

    return null;
};

export default CardWithImage;
