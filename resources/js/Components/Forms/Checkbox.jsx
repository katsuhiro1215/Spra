export default function Checkbox({ className = "", label, id, ...props }) {
    return (
        <div className="flex items-center">
            <input
                {...props}
                id={id}
                type="checkbox"
                className={
                    "rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:bg-gray-700 shadow-sm focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed " +
                    className
                }
            />
            {label && (
                <label
                    htmlFor={id}
                    className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                    {label}
                </label>
            )}
        </div>
    );
}
