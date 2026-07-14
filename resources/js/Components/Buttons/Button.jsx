import BaseButton from "./BaseButton";

/**
 * Button - 汎用ボタンコンポーネント（BaseButtonのラッパー）
 *
 * @param {string} variant - カラーバリアント (primary, secondary, danger, success, warning, info, text)
 * @param {boolean} useTheme - カラーテーマを使用（デフォルト: false）
 * @param {React.ReactNode} icon - アイコン
 * @param {string} iconPosition - アイコン位置 (left, right)
 * @param {string} size - ボタンサイズ (xs, sm, md, lg, xl)
 * @param {boolean} loading - ローディング状態
 * @param {boolean} disabled - 無効化フラグ
 * @param {string} href - リンク先URL
 * @param {string} type - button type
 * @param {React.ReactNode} children - ボタンの内容
 * @param {string} className - 追加のCSSクラス
 */
export default function Button({
    variant = "primary",
    useTheme = false,
    icon = null,
    iconPosition = "left",
    size = "md",
    loading = false,
    disabled = false,
    href = null,
    type = "button",
    children,
    className = "",
    ...props
}) {
    return (
        <BaseButton
            variant={variant}
            useTheme={useTheme}
            icon={icon}
            iconPosition={iconPosition}
            size={size}
            loading={loading}
            disabled={disabled}
            href={href}
            type={type}
            className={className}
            {...props}
        >
            {children}
        </BaseButton>
    );
}
