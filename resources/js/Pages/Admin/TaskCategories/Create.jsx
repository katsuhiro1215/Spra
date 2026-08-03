import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardBody } from "@/Components/Card";
import Form from "./_components/Form";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({ name: "", color: "#4F46E5" });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.task-category.store"));
    };

    return (
        <AdminAuthenticatedLayout header={<PageHeader title="タスクカテゴリ作成" />}>
            <Head title="タスクカテゴリ作成" />
            <div className="max-w-xl">
                <Card>
                    <CardBody>
                        <Form
                            data={data}
                            setData={setData}
                            errors={errors}
                            onSubmit={submit}
                            processing={processing}
                            submitLabel="作成"
                            cancelRoute="admin.task-category.index"
                        />
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
