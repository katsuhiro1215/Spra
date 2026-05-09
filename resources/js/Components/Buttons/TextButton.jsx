import BaseButton from "./BaseButton";

/**
 * TextButton - テキストのみのボタン
 */
export default function TextButton({ className = "", ...props }) {
    const colorClasses = `
        bg-transparent text-slate-700
        hover:bg-slate-100
        focus:ring-slate-500
        dark:text-slate-300 dark:hover:bg-slate-800
    `
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
