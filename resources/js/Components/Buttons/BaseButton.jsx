import { Link } from "@inertiajs/react";

/**
 * BaseButton - すべてのボタンコンポーネントのベース
 *
 * @param {string} href - リンク先URL（指定時はInertia Linkとして動作）
 * @param {string} type - button type (button, submit, reset)
 * @param {string} size - ボタンサイズ (xs, sm, md, lg, xl)
 * @param {boolean} disabled - 無効化フラグ
 * @param {boolean} loading - ローディング状態
 * @param {string} colorClasses - カラークラス（外部から注入）
 * @param {React.ReactNode} children - ボタンの内容
 * @param {string} className - 追加のCSSクラス
 */
export default function BaseButton({
    href,
    type = "button",
    size = "md",
    disabled = false,
    loading = false,
    colorClasses = "",
    children,
    className = "",
    ...props
}) {
    // サイズクラス
    const sizeClasses = {
        xs: "px-2 py-1 text-xs",
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-2.5 text-base",
        xl: "px-6 py-3 text-lg",
    };

    // ベースクラス
    const baseClasses = `
        inline-flex items-center justify-center
        font-semibold rounded-md
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${colorClasses}
        ${className}
    `
        .trim()
        .replace(/\s+/g, " ");

    // ローディング時のスピナー
    const spinner = loading && (
        <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

    // hrefが指定されている場合はLinkとして、それ以外はbuttonとして動作
    if (href) {
        return (
            <Link
                href={href}
                className={baseClasses}
                disabled={disabled || loading}
                {...props}
            >
                {spinner}
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={baseClasses}
            disabled={disabled || loading}
            {...props}
        >
            {spinner}
            {children}
        </button>
    );
}
