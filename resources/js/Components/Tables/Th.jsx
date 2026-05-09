export default function Th({
    children,
    className = "",
    sortable = false,
    ...props
}) {
    return (
        <th
            className={`px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider ${sortable ? "cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" : ""} ${className}`}
            {...props}
        >
            {children}
        </th>
    );
}
