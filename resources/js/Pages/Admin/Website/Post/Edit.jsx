import React from "react";
import { Head, useForm } from "@inertiajs/react";
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

export default function Edit({ post, categories }) {
    const { data, setData, patch, processing, errors } = useForm({
        post_category_id: post.post_category_id || "",
        title: post.title || "",
        slug: post.slug || "",
        thumbnail: post.thumbnail || "",
        excerpt: post.excerpt || "",
        content: post.content || {},
        meta_title: post.meta_title || "",
        meta_description: post.meta_description || "",
        is_published: post.is_published || false,
        published_at: post.published_at || "",
    });

    const handleSubmit = () => {
        patch(route("admin.website.post.update", post.id));
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
                    title={PageConfig.posts.pages.edit.title}
                    description={`「${post.title}」を編集します`}
                    actions={headerActions}
                    breadcrumbs={[
                        ...PageConfig.posts.breadcrumbs,
                        PageConfig.posts.pages.edit.breadcrumb,
                    ]}
                />
            }
        >
            <Head title={`${PageConfig.posts.documentTitle} - ${post.title}`} />

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
                    isEdit={true}
                />
            </div>
        </AdminAuthenticatedLayout>
    );
}
