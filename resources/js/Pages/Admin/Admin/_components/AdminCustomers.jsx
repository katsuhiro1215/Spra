import React from "react";
import { Link, router } from "@inertiajs/react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";
import { Badge } from "@/Components/Badges";

export default function AdminCustomers({ admin, users }) {
    return (
        <div className="space-y-6">
            {/* 顧客情報 */}
            <Card>
                <CardHeader>顧客情報</CardHeader>
                <CardBody>
                    <Table>
                        <THead>
                            <Tr hover={false}>
                                <Th>顧客名</Th>
                                <Th>企業名</Th>
                                <Th>連絡先</Th>
                                <Th>操作</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            <Tr>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                            </Tr>
                            <Tr>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                            </Tr>
                            <Tr>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                            </Tr>
                        </TBody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    )
}
