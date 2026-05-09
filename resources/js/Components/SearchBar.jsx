import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchBar({
    value,
    onChange,
    onSearch,
    placeholder = "検索...",
    disabled = false,
}) {
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onSearch?.();
        }
    };

    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                    className="h-5 w-5 text-slate-400 dark:text-slate-500"
                    aria-hidden="true"
                />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6 disabled:opacity-50 disabled:cursor-not-allowed"
            />
        </div>
    );
}
