export default function CardSectionTitle({
    value,
    className = "",
    children,
    ...props
}) {
    return (
        <div class="flex items-center justify-between gap-4 mb-6 p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 class="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
                {value ? value : children}
            </h3>
            {/* Right side content can be added here */}
            <div class="flex-shrink-0">
                {/* Example: Action buttons or links */}
            </div>
        </div>
    );
}
