import React from "react";
import { Card, CardBody } from "@/Components/Card";
import TodayTaskList from "@/Components/Tasks/TodayTaskList";

export default function AdminAssignedTasks({ tasks }) {
    return (
        <Card>
            <CardBody>
                <TodayTaskList tasks={tasks} emptyLabel="担当中のタスクはありません" />
            </CardBody>
        </Card>
    );
}
