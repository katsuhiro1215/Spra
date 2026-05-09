export default function Table({ children, className = "" }) {
    return (
        <div className="overflow-x-auto">
            <table
                className={`min-w-full divide-y divide-slate-200 dark:divide-slate-700 ${className}`}
            >
                {children}
            </table>
        </div>
    );
}
