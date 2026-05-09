import { useState, useRef, useEffect } from "react";

export default function ButtonSelect({
    value,
    onChange,
    options = [],
    placeholder = "選択してください。",
    disabled = false,
    className = "",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption =
        options.find((option) => option.id === value)?.name || placeholder;

    const toggleDropdown = (e) => {
        e.preventDefault();
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const selectOption = (option) => {
        onChange?.(option.id);
        setIsOpen(false);
    };

    // クリック外で閉じる
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            {/* ボタン */}
            <button
                type="button"
                onClick={toggleDropdown}
                disabled={disabled}
                className="flex w-full items-center justify-between h-10 px-3 py-2 text-left rounded-md border border-slate-300 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:opacity-50 transition-colors"
            >
                <span className={!value ? "text-slate-400" : ""}>
                    {selectedOption}
                </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* ドロップダウン */}
            {isOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none">
                    {options.map((option) => (
                        <li
                            key={option.id}
                            onClick={() => selectOption(option)}
                            className={`px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-slate-700 dark:text-slate-300 transition-colors ${
                                option.id === value
                                    ? "bg-blue-50 dark:bg-blue-900/20 font-medium"
                                    : ""
                            }`}
                        >
                            {option.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
