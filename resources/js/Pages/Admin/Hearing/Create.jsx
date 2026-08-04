import { useState } from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardBody } from "@/Components/Card";
import { FormGroup, TextInput, TextArea, InputError } from "@/Components/Forms";
import Button from "@/Components/Buttons/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import HearingAnswerFields from "./_components/HearingAnswerFields";

export default function Create() {
    const { contact, groupedItems = {} } = usePage().props;

    const { data, setData, processing, errors } = useForm({
        title: `${contact.name}様 ヒアリング（${new Date().toLocaleDateString("ja-JP")}）`,
        notes: "",
        answers: {},
    });

    const handleAnswerChange = (itemId, value) => {
        setData("answers", { ...data.answers, [itemId]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const answersArray = Object.entries(data.answers).map(
            ([hearing_template_item_id, value]) => ({
                hearing_template_item_id,
                ...value,
            }),
        );

        router.post(
            route("admin.contact.hearing.store", contact.id),
            { ...data, answers: answersArray },
            { preserveScroll: true },
        );
    };

    const headerActions = [
        {
            label: "お問い合わせに戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.contact.show", contact.id),
        },
    ];

    const breadcrumbs = [
        { label: "お問い合わせ", href: route("admin.contact.index") },
        { label: contact.name, href: route("admin.contact.show", contact.id) },
        { label: "ヒアリング作成" },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="ヒアリング作成"
                    description={`${contact.name} 様への聞き取り内容を記録します`}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="ヒアリング作成" />

            <FlashMessage />

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <FormGroup label="タイトル" htmlFor="title" required error={errors.title}>
                                <TextInput
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    required
                                />
                            </FormGroup>
                        </div>

                        <FormGroup label="補足メモ" htmlFor="notes" error={errors.notes}>
                            <TextArea
                                id="notes"
                                rows={3}
                                value={data.notes}
                                onChange={(e) => setData("notes", e.target.value)}
                            />
                        </FormGroup>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <HearingAnswerFields
                            groupedItems={groupedItems}
                            answers={data.answers}
                            onChange={handleAnswerChange}
                        />
                    </CardBody>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => router.get(route("admin.contact.show", contact.id))}
                    >
                        キャンセル
                    </Button>
                    <Button type="submit" variant="primary" disabled={processing}>
                        {processing ? "保存中..." : "保存"}
                    </Button>
                </div>
            </form>
        </AdminAuthenticatedLayout>
    );
}
