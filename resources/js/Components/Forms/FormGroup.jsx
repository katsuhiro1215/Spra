export default function FormGroup({
    label,
    required = false,
    error,
    children,
    className = "",
}) {
    return (
        <div className={`flex flex-col w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            {children}
            {error && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
