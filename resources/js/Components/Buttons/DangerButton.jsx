import BaseButton from "./BaseButton";

/**
 * DangerButton - 危険な操作用ボタン
 */
export default function DangerButton({ className = "", ...props }) {
    const colorClasses = `
        bg-red-600 text-white
        hover:bg-red-700
        focus:ring-red-500
        dark:bg-red-500 dark:hover:bg-red-600
        active:bg-red-800
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
