import React from "react";
import { Link, router } from "@inertiajs/react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";

export default function AdminProjects({ admin }) {
    return (
        <div className="space-y-6">
            {/* プロジェクト情報 */}
            <Card>
                <CardHeader>プロジェクト情報</CardHeader>
                <CardBody>
                    {/* プロジェクト名、ステータス(完了したか今も対応しているか) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Aプロジェクト
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">

                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
