import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import RenewedPageHero from "@/Components/PublicSite/RenewedPageHero";
import BlockRenderer from "@/Components/BlockUI/BlockRenderer";

/*
 * 管理画面「Webサイト管理」のページ＋ブロックエディタで作る、汎用の固定ページ。
 * 代表紹介（/greeting）など、専用テンプレートを作らないページはすべてここを通る。
 * 見出し・本文はBlockRenderer（既存・Tailwindベース）をそのまま使う（段階2のBlog詳細と同じ扱い）
 */
export default function Page({ page }) {
    const sections = Array.isArray(page.sections) ? page.sections : [];

    return (
        <PublicLayout renewed>
            <Head title={page.meta_title || page.title} />
            <RenewedPageHero eyebrow="PAGE" title={page.title} current={page.title} />

            {sections.map((section) => (
                <section key={section.id} className="narrow page-section">
                    <div className="prose">
                        <BlockRenderer blocks={section.content?.blocks} />
                    </div>
                </section>
            ))}
        </PublicLayout>
    );
}
