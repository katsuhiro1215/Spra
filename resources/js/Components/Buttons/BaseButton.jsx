import { Link } from "@inertiajs/react";

/**
 * BaseButton - すべてのボタンコンポーネントのベース
 *
 * @param {string} href - リンク先URL（指定時はInertia Linkとして動作）
 * @param {string} type - button type (button, submit, reset)
 * @param {string} variant - カラーバリアント (primary, secondary, danger, success, warning, info, text, info-text, warning-text, danger-text)
 * @param {string} size - ボタンサイズ (xs, sm, md, lg, xl)
 * @param {boolean} disabled - 無効化フラグ
 * @param {boolean} loading - ローディング状態
 * @param {boolean} useTheme - カラーテーマを使用（--color-primary）
 * @param {React.ReactNode} icon - アイコン（Heroicon コンポーネントまたはSVG path文字列）
 * @param {string} iconPosition - アイコン位置 (left, right)
 * @param {string} colorClasses - カラークラス（外部から注入、variantより優先）
 * @param {React.ReactNode} children - ボタンの内容
 * @param {string} className - 追加のCSSクラス
 */
export default function BaseButton({
    href,
    type = "button",
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    useTheme = false,
    icon = null,
    iconPosition = "left",
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

    const iconSizes = {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        md: "w-4 h-4",
        lg: "w-5 h-5",
        xl: "w-6 h-6",
    };

    // カラーバリアント定義
    const getVariantClasses = () => {
        if (colorClasses) return colorClasses; // 外部注入が優先

        if (useTheme && variant === "primary") {
            return `
                text-white shadow-md hover:shadow-lg
                focus:ring-offset-2 active:scale-95
            `;
        }

        const variants = {
            primary: `
                bg-indigo-600 text-white
                hover:bg-indigo-700
                focus:ring-indigo-500
                dark:bg-indigo-500 dark:hover:bg-indigo-600
                active:scale-95 shadow-md hover:shadow-lg
            `,
            secondary: `
                bg-white text-slate-700
                border border-slate-300
                hover:bg-slate-50
                focus:ring-indigo-500
                dark:bg-slate-800 dark:text-slate-100
                dark:border-slate-600 dark:hover:bg-slate-700
                shadow-sm
            `,
            danger: `
                bg-red-600 text-white
                hover:bg-red-700
                focus:ring-red-500
                dark:bg-red-500 dark:hover:bg-red-600
                active:bg-red-800
            `,
            success: `
                bg-green-600 text-white
                hover:bg-green-700
                focus:ring-green-500
                dark:bg-green-500 dark:hover:bg-green-600
                active:scale-95 shadow-md hover:shadow-lg
            `,
            warning: `
                bg-yellow-600 text-white
                hover:bg-yellow-700
                focus:ring-yellow-500
                dark:bg-yellow-500 dark:hover:bg-yellow-600
                active:scale-95 shadow-md hover:shadow-lg
            `,
            info: `
                bg-cyan-600 text-white
                hover:bg-cyan-700
                focus:ring-cyan-500
                dark:bg-cyan-500 dark:hover:bg-cyan-600
                active:scale-95 shadow-md hover:shadow-lg
            `,
            text: `
                bg-transparent text-slate-700
                hover:bg-slate-100
                focus:ring-slate-500
                dark:text-slate-300 dark:hover:bg-slate-800
            `,
            // outline
            "outline-primary": `
                bg-transparent text-slate-700
                border border-slate-300
                hover:bg-slate-50
                focus:ring-indigo-500
                dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-700
            `,
            "outline-secondary": `
                bg-transparent text-slate-700
                border border-slate-300
                hover:bg-slate-50
                focus:ring-indigo-500
                dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-700
            `,
            "outline-danger": `
                bg-transparent text-red-600
                border border-red-600
                hover:bg-red-50
                focus:ring-red-500
                dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20
            `,
            "outline-success": `
                bg-transparent text-green-600
                border border-green-600
                hover:bg-green-50
                focus:ring-green-500
                dark:text-green-400 dark:border-green-400 dark:hover:bg-green-900/20
            `,
            "outline-warning": `
                bg-transparent text-yellow-600
                border border-yellow-600
                hover:bg-yellow-50
                focus:ring-yellow-500
                dark:text-yellow-400 dark:border-yellow-400 dark:hover:bg-yellow-900/20
            `,
            "outline-info": `
                bg-transparent text-cyan-600
                border border-cyan-600
                hover:bg-cyan-50
                focus:ring-cyan-500
                dark:text-cyan-400 dark:border-cyan-400 dark:hover:bg-cyan-900/20
            `,
            // text variants
            "info-text": `
                bg-transparent text-cyan-600
                hover:text-cyan-900 hover:bg-cyan-50
                focus:ring-cyan-500
                dark:text-cyan-400 dark:hover:text-cyan-300 dark:hover:bg-cyan-900/20
            `,
            "warning-text": `
                bg-transparent text-yellow-600
                hover:text-yellow-900 hover:bg-yellow-50
                focus:ring-yellow-500
                dark:text-yellow-400 dark:hover:text-yellow-300 dark:hover:bg-yellow-900/20
            `,
            "danger-text": `
                bg-transparent text-red-600
                hover:text-red-900 hover:bg-red-50
                focus:ring-red-500
                dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20
            `,
            "success-text": `
                bg-transparent text-green-600
                hover:text-green-900 hover:bg-green-50
                focus:ring-green-500
                dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20
            `,
        };

        return (variants[variant] || variants.primary)
            .trim()
            .replace(/\s+/g, " ");
    };

    // ベースクラス
    const baseClasses = `
        inline-flex items-center justify-center
        font-semibold rounded-md
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${getVariantClasses()}
        ${className}
    `
        .trim()
        .replace(/\s+/g, " ");

    // テーマカラーのスタイル
    const getThemeStyle = () => {
        if (useTheme && variant === "primary" && !disabled) {
            return {
                backgroundColor: "var(--color-primary)",
            };
        }
        if (useTheme && variant === "primary" && disabled) {
            return { backgroundColor: "#9CA3AF" };
        }
        return {};
    };

    const handleMouseEnter = (e) => {
        if (useTheme && variant === "primary" && !disabled && !loading) {
            e.currentTarget.style.backgroundColor = "var(--color-primary-hover)";
        }
    };

    const handleMouseLeave = (e) => {
        if (useTheme && variant === "primary" && !disabled && !loading) {
            e.currentTarget.style.backgroundColor = "var(--color-primary)";
        }
    };

    // アイコンレンダリング
    const renderIcon = () => {
        if (!icon || loading) return null;

        if (typeof icon === "string") {
            // SVG path string の場合
            return (
                <svg
                    className={`${iconSizes[size]} ${children ? (iconPosition === "left" ? "mr-2" : "ml-2") : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={icon}
                    />
                </svg>
            );
        }

        // React コンポーネントの場合（Heroicons等）
        const IconComponent = icon;
        return (
            <IconComponent
                className={`${iconSizes[size]} ${children ? (iconPosition === "left" ? "mr-2" : "ml-2") : ""}`}
            />
        );
    };

    // ローディング時のスピナー
    const spinner = loading && (
        <svg
            className={`animate-spin ${iconSizes[size]} ${children ? "mr-2" : ""}`}
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
                style={getThemeStyle()}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                disabled={disabled || loading}
                {...props}
            >
                {spinner}
                {iconPosition === "left" && renderIcon()}
                {children}
                {iconPosition === "right" && renderIcon()}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={baseClasses}
            style={getThemeStyle()}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            disabled={disabled || loading}
            {...props}
        >
            {spinner}
            {iconPosition === "left" && renderIcon()}
            {children}
            {iconPosition === "right" && renderIcon()}
        </button>
    );
}
