import { Head, Link } from "@inertiajs/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function AtlasComingSoon({ title, message }) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-[#08080a] text-neutral-200 flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <p className="text-xs tracking-[0.35em] text-amber-200/70 mb-6">
                        ATLAS
                    </p>
                    <h1 className="font-serif text-2xl text-neutral-50 mb-4">
                        {title}
                    </h1>
                    <p className="text-neutral-400 leading-relaxed mb-10">
                        {message}
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-amber-200 hover:text-amber-100"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Private Previewへ戻る
                    </Link>
                </div>
            </div>
        </>
    );
}
