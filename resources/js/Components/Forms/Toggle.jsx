import { Switch } from "@headlessui/react";

export default function Toggle({ enabled, onChange, disabled = false, label }) {
    return (
        <Switch
            checked={enabled}
            onChange={onChange}
            disabled={disabled}
            className={`
                ${enabled ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"}
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900
            `}
        >
            {label && <span className="sr-only">{label}</span>}
            <span
                className={`
                    ${enabled ? "translate-x-6" : "translate-x-1"}
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                `}
            />
        </Switch>
    );
}
