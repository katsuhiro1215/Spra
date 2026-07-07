import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/Components/Card";

export default function QuoteClientInfo({ quote }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>クライアント情報</CardTitle>
            </CardHeader>
            <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quote.user && (
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                ユーザー
                            </p>
                            <p className="text-gray-900 dark:text-gray-100">
                                {quote.user.profile?.full_name ||
                                    quote.user.email}
                            </p>
                            {quote.user.email && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {quote.user.email}
                                </p>
                            )}
                        </div>
                    )}
                    {quote.contact && (
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                お問い合わせ
                            </p>
                            <p className="text-gray-900 dark:text-gray-100">
                                {quote.contact.name}
                            </p>
                            {quote.contact.email && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {quote.contact.email}
                                </p>
                            )}
                        </div>
                    )}
                    {quote.company && (
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                会社
                            </p>
                            <p className="text-gray-900 dark:text-gray-100">
                                {quote.company.name}
                            </p>
                            {quote.company.addresses &&
                                quote.company.addresses.length > 0 && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                        {quote.company.addresses[0].postal_code}{" "}
                                        {quote.company.addresses[0].prefecture}
                                        {quote.company.addresses[0].city}
                                        {quote.company.addresses[0].street}
                                    </p>
                                )}
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
