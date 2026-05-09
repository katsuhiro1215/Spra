export default function Tr({
    children,
    className = "",
    hover = true,
    ...props
}) {
    return (
        <tr
            className={`${hover ? "hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" : ""} ${className}`}
            {...props}
        >
            {children}
        </tr>
    );
}
