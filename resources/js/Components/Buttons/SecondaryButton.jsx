import BaseButton from "./BaseButton";

/**
 * SecondaryButton - セカンダリボタン
 */
export default function SecondaryButton({ className = "", ...props }) {
    const colorClasses = `
        bg-white text-slate-700
        border border-slate-300
        hover:bg-slate-50
        focus:ring-indigo-500
        dark:bg-slate-800 dark:text-slate-100
        dark:border-slate-600 dark:hover:bg-slate-700
        shadow-sm
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
