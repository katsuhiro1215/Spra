import React from "react";
import { Link, router } from "@inertiajs/react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";

export default function AdminSettings({ admin }) {
    return (
        <div className="space-y-6">
            {/* 設定情報 */}
            <Card>
                <CardHeader title="設定情報" />
            </Card>
        </div>
    );
}
