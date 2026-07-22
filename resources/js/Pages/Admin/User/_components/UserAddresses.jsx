import React from "react";
import { Link, router } from "@inertiajs/react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Dl, Dt, Dd } from "@/Components/Description";
import { IconButton } from "@/Components/Buttons";
import { PencilIcon, PlusIcon, TrashIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

const getAddressTypeLabel = (type) => {
    const labels = {
        home: "自宅",
        office: "オフィス",
        billing: "請求先",
        shipping: "配送先",
        other: "その他",
    };
    return labels[type] || type;
};

export default function UserAddresses({ user }) {
    const addresses = user.addresses || [];

    const handleDeleteAddress = (addressId) => {
        if (confirm(PageConfig.admins.addresses.deleteConfirmation)) {
            router.delete(
                route("admin.user.address.destroy", {
                    user: user.id,
                    address: addressId,
                }),
                { preserveScroll: true },
            );
        }
    };

    return (
        <Card>
            <CardHeader className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        住所情報
                    </span>
                </div>
                <IconButton
                    icon={PlusIcon}
                    variant="indigo-text"
                    size="lg"
                    href={route("admin.user.address.create", user.id)}
                    title="追加"
                />
            </CardHeader>
            <CardBody>
                {addresses.length > 0 ? (
                    <div className="space-y-4">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className="border border-gray-200 dark:border-slate-700 rounded-lg p-4"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center space-x-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {getAddressTypeLabel(address.type)}
                                        </span>
                                        {address.label && (
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {address.label}
                                            </span>
                                        )}
                                        {address.is_default && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                デフォルト
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={route(
                                                "admin.user.address.edit",
                                                {
                                                    user: user.id,
                                                    address: address.id,
                                                },
                                            )}
                                            className="p-1 text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
                                            title="編集"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDeleteAddress(address.id)
                                            }
                                            className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                            title="削除"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <Dl variant="default">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2">
                                        <Dt className="font-medium">
                                            郵便番号
                                        </Dt>
                                        <Dd className="sm:col-span-2">
                                            {address.formatted_postal_code ||
                                                address.postal_code}
                                        </Dd>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2">
                                        <Dt className="font-medium">住所</Dt>
                                        <Dd className="sm:col-span-2">
                                            {address.full_address}
                                        </Dd>
                                    </div>
                                    {address.phone && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2">
                                            <Dt className="font-medium">
                                                電話番号
                                            </Dt>
                                            <Dd className="sm:col-span-2">
                                                {address.phone}
                                            </Dd>
                                        </div>
                                    )}
                                    {address.contact_person && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2">
                                            <Dt className="font-medium">
                                                担当者
                                            </Dt>
                                            <Dd className="sm:col-span-2">
                                                {address.contact_person}
                                            </Dd>
                                        </div>
                                    )}
                                    {address.notes && (
                                        <div className="flex flex-col gap-2 py-2">
                                            <Dt className="font-medium">
                                                備考
                                            </Dt>
                                            <Dd className="whitespace-pre-wrap">
                                                {address.notes}
                                            </Dd>
                                        </div>
                                    )}
                                </Dl>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                        住所情報が登録されていません
                    </p>
                )}
            </CardBody>
        </Card>
    );
}
