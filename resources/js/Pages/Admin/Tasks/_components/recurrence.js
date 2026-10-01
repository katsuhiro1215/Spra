export const WEEKDAYS = [
    { value: "mon", label: "月" },
    { value: "tue", label: "火" },
    { value: "wed", label: "水" },
    { value: "thu", label: "木" },
    { value: "fri", label: "金" },
    { value: "sat", label: "土" },
    { value: "sun", label: "日" },
];

export function describeRecurrence(rule) {
    if (!rule || rule.freq === "daily") {
        return "毎日";
    }

    const days = WEEKDAYS.filter((day) => (rule.byweekday || []).includes(day.value)).map((day) => day.label);

    return days.length ? `毎週 ${days.join("・")}` : "毎週";
}

// "2026-08" → "2026年8月"
export function formatMonthLabel(month) {
    const [year, mon] = month.split("-");

    return `${year}年${Number(mon)}月`;
}
