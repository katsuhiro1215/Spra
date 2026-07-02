import BaseButton from "./BaseButton";

/**
 * TextButton - テキスト/アイコンのみのボタン
 *
 * @param {string} variant - カラーバリアント (default, primary, danger, success, warning, info, skyblue)
 * @param {string} className - 追加のCSSクラス
 */
export default function TextButton({
    variant = "default",
    className = "",
    ...props
}) {
    const variantMap = {
        default: `
            bg-transparent text-slate-700
            hover:bg-slate-100
            focus:ring-slate-500
            dark:text-slate-300 dark:hover:bg-slate-800
        `,
        primary: `
            bg-transparent text-blue-600
            hover:bg-blue-50
            focus:ring-blue-500
            dark:text-blue-400 dark:hover:bg-blue-900/20
        `,
        danger: `
            bg-transparent text-red-600
            hover:bg-red-50
            focus:ring-red-500
            dark:text-red-400 dark:hover:bg-red-900/20
        `,
        success: `
            bg-transparent text-green-600
            hover:bg-green-50
            focus:ring-green-500
            dark:text-green-400 dark:hover:bg-green-900/20
        `,
        warning: `
            bg-transparent text-yellow-600
            hover:bg-yellow-50
            focus:ring-yellow-500
            dark:text-yellow-400 dark:hover:bg-yellow-900/20
        `,
        info: `
            bg-transparent text-cyan-600
            hover:bg-cyan-50
            focus:ring-cyan-500
            dark:text-cyan-400 dark:hover:bg-cyan-900/20
        `,
        skyblue: `
            bg-transparent text-sky-600
            hover:bg-sky-50
            focus:ring-sky-500
            dark:text-sky-400 dark:hover:bg-sky-900/20
        `,
    };

    const colorClasses = (variantMap[variant] || variantMap.default)
        .trim()
        .replace(/\s+/g, " ");

    return (
        <BaseButton
            colorClasses={colorClasses}
            className={className}
            {...props}
        />
    );
}
