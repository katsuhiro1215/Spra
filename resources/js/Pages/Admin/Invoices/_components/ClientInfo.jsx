import React from "react";
import { Card, CardBody } from "@/Components/Card";

export default function ClientInfo({ invoice }) {
    return (
        <Card>
            <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                            ユーザー
                        </label>
                        <p className="mt-2 text-base text-gray-900 dark:text-white">
                            {invoice.user?.profile?.full_name ||
                                invoice.user?.email ||
                                "-"}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                            会社
                        </label>
                        <p className="mt-2 text-base text-gray-900 dark:text-white">
                            {invoice.company?.name || "-"}
                        </p>
                    </div>
                    {invoice.user?.email && (
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                メール
                            </label>
                            <p className="mt-2 text-base">
                                <a
                                    href={`mailto:${invoice.user.email}`}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                                >
                                    {invoice.user.email}
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
