import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";

export default function Document({ auth, document }) {
    const breadcrumbs = [{ label: document.title }];

    return (
        <PublicLayout auth={auth}>
            <Head title={document.title} />

            <PageHero title={document.title} breadcrumbs={breadcrumbs} />

            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        {document.description && (
                            <p className="text-gray-600 mb-8">
                                {document.description}
                            </p>
                        )}
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {document.content}
                        </div>
                        {document.effective_date && (
                            <p className="text-sm text-gray-400 mt-12">
                                発効日: {document.effective_date} (v
                                {document.version})
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
