import React from "react";
import { Link, router } from "@inertiajs/react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import { Table, THead, TBody, Tr, Th, Td } from "@/Components/Tables";

export default function AdminLoginHistory({ admin }) {
    return (
        <div className="space-y-6">
            {/* ログイン履歴 */}
            <Card>
                <CardHeader>ログイン履歴</CardHeader>
                <CardBody>
                    <Table>
                        <THead>
                            <Tr hover={false}>
                                <Th>日時</Th>
                                <Th>IPアドレス</Th>
                                <Th>ブラウザ</Th>
                                <Th>OS</Th>
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
    );
}
