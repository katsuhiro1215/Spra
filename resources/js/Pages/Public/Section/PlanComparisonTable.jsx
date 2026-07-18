import { CheckIcon, MinusIcon } from "@heroicons/react/24/outline";

/**
 * 各プランのservice_itemsを name でグルーピングし、比較表の行を組み立てる。
 * 同じ name の項目は同一行として扱い、そのプランに含まれていれば◯を表示する。
 */
function buildComparisonRows(plans) {
    const rowMap = new Map();

    plans.forEach((plan) => {
        (plan.service_items || []).forEach((item) => {
            const existing = rowMap.get(item.name);
            if (existing) {
                existing.planIds.add(plan.id);
                existing.sortOrder = Math.min(
                    existing.sortOrder,
                    item.sort_order ?? 0,
                );
            } else {
                rowMap.set(item.name, {
                    name: item.name,
                    sortOrder: item.sort_order ?? 0,
                    planIds: new Set([plan.id]),
                });
            }
        });
    });

    return Array.from(rowMap.values()).sort(
        (a, b) => a.sortOrder - b.sortOrder,
    );
}

export default function PlanComparisonTable({ plans = [] }) {
    const displayPlans = plans.filter((plan) => plan.service_items?.length);

    if (displayPlans.length < 2) {
        return null;
    }

    const rows = buildComparisonRows(displayPlans);

    if (rows.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        プラン比較表
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        各プランに含まれる項目を一覧で比較できます
                    </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                    <table className="w-full min-w-[640px] border-collapse">
                        <thead>
                            <tr>
                                <th className="sticky left-0 z-10 bg-gray-50 text-left text-sm font-semibold text-gray-500 py-4 px-4 border-b border-gray-200">
                                    項目
                                </th>
                                {displayPlans.map((plan) => (
                                    <th
                                        key={plan.id}
                                        className="text-center text-sm font-bold text-gray-900 py-4 px-4 border-b border-gray-200 whitespace-nowrap bg-gray-50"
                                    >
                                        {plan.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr
                                    key={row.name}
                                    className={
                                        index % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50/60"
                                    }
                                >
                                    <td className="sticky left-0 z-10 bg-inherit text-sm text-gray-700 py-3 px-4 border-b border-gray-100 whitespace-nowrap">
                                        {row.name}
                                    </td>
                                    {displayPlans.map((plan) => (
                                        <td
                                            key={plan.id}
                                            className="text-center py-3 px-4 border-b border-gray-100"
                                        >
                                            {row.planIds.has(plan.id) ? (
                                                <CheckIcon className="w-5 h-5 text-green-600 mx-auto" />
                                            ) : (
                                                <MinusIcon className="w-4 h-4 text-gray-300 mx-auto" />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
