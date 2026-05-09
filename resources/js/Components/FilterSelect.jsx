export default function FilterSelect({
    label,
    value,
    onChange,
    options,
    placeholder = "選択してください",
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
