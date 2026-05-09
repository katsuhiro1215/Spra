export default function FormSectionTitle({ children, className = "" }) {
    return (
        <h3
            className={`text-xl font-semibold text-slate-900 dark:text-white mb-6 ${className}`}
        >
            {children}
        </h3>
    );
}
