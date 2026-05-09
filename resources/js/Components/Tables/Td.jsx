export default function Td({ children, className = "", ...props }) {
    return (
        <td
            className={`px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100 ${className}`}
            {...props}
        >
            {children}
        </td>
    );
}
