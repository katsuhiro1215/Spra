import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardBody } from "@/Components/Card";
import Form from "./_components/Form";

export default function Edit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        color: category.color || "#4F46E5",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.task-category.update", category.id));
    };

    return (
        <AdminAuthenticatedLayout header={<PageHeader title="タスクカテゴリ編集" />}>
            <Head title="タスクカテゴリ編集" />
            <div className="max-w-xl">
                <Card>
                    <CardBody>
                        <Form
                            data={data}
                            setData={setData}
                            errors={errors}
                            onSubmit={submit}
                            processing={processing}
                            submitLabel="更新"
                            cancelRoute="admin.task-category.index"
                        />
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
