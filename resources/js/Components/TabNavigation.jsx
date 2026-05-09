export default function TabNavigation({ tabs, activeTab, onChange }) {
    return (
        <div className="border-b border-slate-200 dark:border-slate-700">
            <nav
                className="-mb-px flex space-x-8 overflow-x-auto px-6"
                aria-label="Tabs"
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onChange(tab.key)}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                            ${
                                activeTab === tab.key
                                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-600"
                            }
                            transition-colors
                        `}
                    >
                        {tab.label}
                        {tab.count !== undefined && (
                            <span
                                className={`ml-2 py-0.5 px-2.5 rounded-full text-xs ${
                                    activeTab === tab.key
                                        ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
                                        : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-300"
                                }`}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
}
