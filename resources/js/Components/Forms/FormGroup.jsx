export default function FormGroup({
    label,
    htmlFor,
    help,
    required = false,
    error,
    children,
    className = "",
}) {
    return (
        <div className={`flex flex-col w-full ${className}`}>
            {label && (
                <label
                    htmlFor={htmlFor}
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            {children}
            {help && !error && (
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                    {help}
                </p>
            )}
            {error && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
