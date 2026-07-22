import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";
import BlockRenderer from "@/Components/BlockUI/BlockRenderer";

export default function Page({ auth, page }) {
    const breadcrumbs = [{ label: page.title }];
    const sections = Array.isArray(page.sections) ? page.sections : [];

    return (
        <PublicLayout auth={auth}>
            <Head title={page.meta_title || page.title} />

            <PageHero title={page.title} breadcrumbs={breadcrumbs} />

            {sections.map((section) => (
                <section key={section.id} className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="max-w-3xl mx-auto">
                            <BlockRenderer blocks={section.content?.blocks} />
                        </div>
                    </div>
                </section>
            ))}
        </PublicLayout>
    );
}
