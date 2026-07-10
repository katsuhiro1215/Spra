import React from "react";
import { Link } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";
import {
    UserIcon,
    BuildingOfficeIcon,
    EnvelopeIcon,
    PhoneIcon,
} from "@heroicons/react/24/outline";

export default function ClientInfo({ contract }) {
    return (
        <div className="space-y-4">
            {/* 契約者情報 */}
            {contract.user && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5" />
                            契約者情報
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    お名前
                                </p>
                                <Link
                                    href={route(
                                        "admin.user.show",
                                        contract.user.id,
                                    )}
                                    className="mt-1 text-lg font-bold text-blue-600 hover:underline"
                                >
                                    {contract.user.profile?.name ||
                                        "(名前未設定)"}
                                </Link>
                            </div>

                            <div className="border-t pt-3">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    メールアドレス
                                </p>
                                <a
                                    href={`mailto:${contract.user.email}`}
                                    className="mt-1 flex items-center gap-2 text-blue-600 hover:underline"
                                >
                                    <EnvelopeIcon className="h-4 w-4" />
                                    {contract.user.email}
                                </a>
                            </div>

                            {contract.user.profile?.phone && (
                                <div className="border-t pt-3">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        電話番号
                                    </p>
                                    <a
                                        href={`tel:${contract.user.profile.phone}`}
                                        className="mt-1 flex items-center gap-2 text-blue-600 hover:underline"
                                    >
                                        <PhoneIcon className="h-4 w-4" />
                                        {contract.user.profile.phone}
                                    </a>
                                </div>
                            )}

                            {contract.user.profile?.company_name && (
                                <div className="border-t pt-3">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        所属企業
                                    </p>
                                    <p className="mt-1 text-gray-900">
                                        {contract.user.profile.company_name}
                                    </p>
                                </div>
                            )}

                            <div className="border-t pt-3">
                                <Link
                                    href={route(
                                        "admin.user.show",
                                        contract.user.id,
                                    )}
                                    className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm font-medium"
                                >
                                    詳細を表示
                                </Link>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* 会社情報 */}
            {contract.company && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BuildingOfficeIcon className="h-5 w-5" />
                            会社情報
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    会社名
                                </p>
                                <Link
                                    href={route(
                                        "admin.company.show",
                                        contract.company.id,
                                    )}
                                    className="mt-1 text-lg font-bold text-blue-600 hover:underline"
                                >
                                    {contract.company.name}
                                </Link>
                            </div>

                            {contract.company.addresses &&
                                contract.company.addresses.length > 0 && (
                                    <div className="border-t pt-3">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                            住所
                                        </p>
                                        <div className="space-y-2">
                                            {contract.company.addresses.map(
                                                (addr) => (
                                                    <div
                                                        key={addr.id}
                                                        className="text-sm text-gray-700 bg-gray-50 p-2 rounded"
                                                    >
                                                        {addr.postal_code && (
                                                            <p className="text-xs text-gray-500">
                                                                〒
                                                                {
                                                                    addr.postal_code
                                                                }
                                                            </p>
                                                        )}
                                                        <p>
                                                            {addr.prefecture}
                                                            {addr.city}
                                                            {addr.district}
                                                            {addr.address_line1}
                                                        </p>
                                                        {addr.address_line2 && (
                                                            <p className="text-xs text-gray-600">
                                                                {
                                                                    addr.address_line2
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                            <div className="border-t pt-3">
                                <Link
                                    href={route(
                                        "admin.company.show",
                                        contract.company.id,
                                    )}
                                    className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm font-medium"
                                >
                                    詳細を表示
                                </Link>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}
