import React from "react";
import { Head, useForm } from "@inertiajs/react";
// Layouts
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
// Icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// Constants
import { PageConfig } from "@/Constants/PageConfig";
// Post Components
import PostForm from "./_components/Form";

export default function Create({ categories }) {
    const { data, setData, post, transform, processing, errors } = useForm({
        post_category_id: "",
        title: "",
        slug: "",
        thumbnail: "",
        excerpt: "",
        tags: "",
        content: {},
        meta_title: "",
        meta_description: "",
        is_published: false,
        published_at: "",
    });

    const handleSubmit = () => {
        transform((data) => ({
            ...data,
            tags: data.tags
                ? data.tags
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                : [],
        }));
        post(route("admin.website.post.store"));
    };

    const headerActions = [
        {
            label: PageConfig.posts.actions.back,
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.website.post.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.posts.pages.create.title}
                    description={PageConfig.posts.description}
                    actions={headerActions}
                    breadcrumbs={[
                        ...PageConfig.posts.breadcrumbs,
                        PageConfig.posts.pages.create.breadcrumb,
                    ]}
                />
            }
        >
            <Head title={PageConfig.posts.documentTitle} />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="w-full max-w-5xl">
                <PostForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    cancelRoute={route("admin.website.post.index")}
                    categories={categories}
                    isEdit={false}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
