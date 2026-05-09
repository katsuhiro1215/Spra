export default function TBody({ children, className = "" }) {
    return (
        <tbody
            className={`bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700 ${className}`}
        >
            {children}
        </tbody>
    );
}
