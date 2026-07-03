import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";

export default function SignatureStatus({ contract }) {
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getSignatureStatus = () => {
        switch (contract.signature_status) {
            case "unsigned":
                return { label: "未署名", color: "gray", icon: XCircleIcon };
            case "user_signed":
                return {
                    label: "ユーザー署名済み",
                    color: "yellow",
                    icon: ClockIcon,
                };
            case "admin_signed":
                return {
                    label: "管理者署名済み",
                    color: "yellow",
                    icon: ClockIcon,
                };
            case "fully_signed":
                return {
                    label: "完全署名済み",
                    color: "green",
                    icon: CheckCircleIcon,
                };
            default:
                return { label: "不明", color: "gray", icon: XCircleIcon };
        }
    };

    const status = getSignatureStatus();
    const Icon = status.icon;

    return (
        <Card>
            <CardHeader>
                <CardTitle>署名状況</CardTitle>
            </CardHeader>
            <CardBody>
                <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <div>
                            <Badge variant={status.color}>{status.label}</Badge>
                        </div>
                    </div>

                    <div className="border-t pt-4 space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">
                                ユーザー署名
                            </p>
                            <div className="mt-1">
                                {contract.user_signed_at ? (
                                    <div className="flex items-center gap-2">
                                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-900 font-medium">
                                            {formatDate(
                                                contract.user_signed_at,
                                            )}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <XCircleIcon className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-500">
                                            未署名
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">管理者署名</p>
                            <div className="mt-1">
                                {contract.admin_signed_at ? (
                                    <div className="flex items-center gap-2">
                                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-900 font-medium">
                                            {formatDate(
                                                contract.admin_signed_at,
                                            )}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <XCircleIcon className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-500">
                                            未署名
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {contract.signed_at && (
                        <div className="border-t pt-4">
                            <p className="text-sm text-gray-500">契約成立日</p>
                            <p className="text-gray-900 font-medium">
                                {formatDate(contract.signed_at)}
                            </p>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
