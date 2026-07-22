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

const HolidaysTable = ({
    holidays,
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

    const getTypeLabel = (type) => {
        const typeMap = {
            national: "国民の祝日",
            international: "国際的な祝日",
        };
        return typeMap[type] || type;
    };

    const getTypeBadgeClass = (type) => {
        const classMap = {
            national:
                "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
            international:
                "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
        };
        return classMap[type] || "bg-gray-100 text-gray-800";
    };

    return (
        <Card>
            <CardHeader>祝日一覧 ({holidays.length}件)</CardHeader>

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
                        <Th>祝日名</Th>
                        <Th>種類</Th>
                        <Th>毎年繰り返し</Th>
                        <Th className="text-right">操作</Th>
                    </Tr>
                </THead>
                <TBody>
                    {holidays.map((holiday) => (
                        <Tr
                            key={holiday.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Td>{formatDate(holiday.date)}</Td>
                            <Td>{holiday.name}</Td>
                            <Td>
                                <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(
                                        holiday.type,
                                    )}`}
                                >
                                    {getTypeLabel(holiday.type)}
                                </span>
                            </Td>
                            <Td>{holiday.is_recurring ? "はい" : "いいえ"}</Td>
                            <Td className="text-right">
                                <div className="flex justify-end space-x-2">
                                    <EditButton
                                        href={route(
                                            "admin.schedules.holidays.edit",
                                            holiday.id,
                                        )}
                                    ></EditButton>
                                    <DeleteButton
                                        onClick={() => onDelete(holiday)}
                                        disabled={isDeleting === holiday.id}
                                    >
                                        {isDeleting === holiday.id
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

export default HolidaysTable;
