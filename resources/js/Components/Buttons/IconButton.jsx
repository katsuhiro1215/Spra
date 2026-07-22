import BaseButton from "./BaseButton";

/**
 * IconButton - アイコン専用ボタン
 *
 * @param {React.ReactNode} icon - アイコン（必須）
 * @param {string} variant - カラーバリアント (primary, secondary, danger, success, warning, info, text, info-text, warning-text, danger-text)
 * @param {boolean} useTheme - カラーテーマを使用（デフォルト: false）
 * @param {string} size - ボタンサイズ (xs, sm, md, lg, xl)
 * @param {boolean} loading - ローディング状態
 * @param {boolean} disabled - 無効化フラグ
 * @param {string} href - リンク先URL
 * @param {string} type - button type
 * @param {string} className - 追加のCSSクラス
 */
export default function IconButton({
    icon,
    variant = "text",
    useTheme = false,
    size = "md",
    loading = false,
    disabled = false,
    href = null,
    type = "button",
    className = "",
    ...props
}) {
    return (
        <BaseButton
            variant={variant}
            useTheme={useTheme}
            icon={icon}
            size={size}
            loading={loading}
            disabled={disabled}
            href={href}
            type={type}
            className={`!p-2 ${className}`}
            {...props}
        />
    );
}
