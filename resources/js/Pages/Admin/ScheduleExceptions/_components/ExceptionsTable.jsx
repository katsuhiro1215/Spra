import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import {
    EditButton,
    DeleteButton,
    SecondaryButton,
} from "@/Components/Buttons";
import {
    PencilIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";

const ExceptionsTable = ({
    exceptions,
    onDelete,
    isDeleting,
    currentYear,
    onPreviousYear,
    onNextYear,
    processing,
}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return "-";
        return timeString.substring(0, 5);
    };

    return (
        <Card>
            <CardHeader>例外日一覧 ({exceptions.length}件)</CardHeader>

            {/* 年ナビゲーション */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                    <SecondaryButton
                        onClick={onPreviousYear}
                        icon={ChevronLeftIcon}
                        disabled={processing}
                    >
                        前年
                    </SecondaryButton>
                    <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        {currentYear}年
                    </div>
                    <SecondaryButton
                        onClick={onNextYear}
                        icon={ChevronRightIcon}
                        disabled={processing}
                    >
                        来年
                    </SecondaryButton>
                </div>
            </div>

            <Table>
                <THead>
                    <Tr hover={false}>
                        <Th>日付</Th>
                        <Th>営業</Th>
                        <Th>営業時間</Th>
                        <Th>休憩時間</Th>
                        <Th>理由</Th>
                        <Th className="text-right">操作</Th>
                    </Tr>
                </THead>
                <TBody>
                    {exceptions.map((exception) => (
                        <Tr
                            key={exception.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Td>{formatDate(exception.exception_date)}</Td>
                            <Td>
                                {exception.is_open ? (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                        営業
                                    </span>
                                ) : (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                                        休業
                                    </span>
                                )}
                            </Td>
                            <Td>
                                {exception.is_open
                                    ? `${formatTime(exception.open_time)} 〜 ${formatTime(exception.close_time)}`
                                    : "-"}
                            </Td>
                            <Td>
                                {exception.is_open && exception.break_start
                                    ? `${formatTime(exception.break_start)} 〜 ${formatTime(exception.break_end)}`
                                    : "-"}
                            </Td>
                            <Td>{exception.reason || "-"}</Td>
                            <Td className="text-right">
                                <div className="flex justify-end space-x-2">
                                    <EditButton
                                        href={route(
                                            "admin.schedules.exceptions.edit",
                                            exception.id,
                                        )}
                                    />
                                    <DeleteButton
                                        onClick={() => onDelete(exception)}
                                        disabled={isDeleting === exception.id}
                                    >
                                        {isDeleting === exception.id
                                            ? "削除中..."
                                            : "削除"}
                                    </DeleteButton>
                                </div>
                            </Td>
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </Card>
    );
};

export default ExceptionsTable;
