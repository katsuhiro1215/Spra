import React from "react";
import { Link } from "@inertiajs/react";
import { Badge } from "@/Components/Badges";

const PRIORITY_VARIANT = { high: "danger", medium: "warning", low: "secondary" };
const PRIORITY_LABEL = { high: "高", medium: "中", low: "低" };

export default function TodayTaskList({ tasks, emptyLabel = "本日期限のタスクはありません" }) {
    if (tasks.length === 0) {
        return <p className="text-sm text-gray-400 dark:text-gray-500">{emptyLabel}</p>;
    }

    return (
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {tasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between py-2">
                    <Link
                        href={route("admin.task.show", task.id)}
                        className="text-sm text-gray-900 hover:underline dark:text-gray-100"
                    >
                        {task.due_time ? `${task.due_time.slice(0, 5)} ` : ""}
                        {task.title}
                    </Link>
                    <Badge variant={PRIORITY_VARIANT[task.priority]}>{PRIORITY_LABEL[task.priority]}</Badge>
                </li>
            ))}
        </ul>
    );
}
