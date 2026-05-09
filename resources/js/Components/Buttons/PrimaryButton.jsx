import BaseButton from "./BaseButton";

/**
 * PrimaryButton - プライマリボタン
 */
export default function PrimaryButton({ className = "", ...props }) {
    const colorClasses = `
        bg-indigo-600 text-white
        hover:bg-indigo-700
        focus:ring-indigo-500
        dark:bg-indigo-500 dark:hover:bg-indigo-600
        active:scale-95 shadow-md hover:shadow-lg
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
