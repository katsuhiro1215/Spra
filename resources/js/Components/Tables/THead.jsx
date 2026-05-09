export default function THead({ children, className = "" }) {
    return (
        <thead className={`bg-slate-50 dark:bg-slate-800 ${className}`}>
            {children}
        </thead>
    );
}
