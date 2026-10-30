import { useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import RenewedPageHero from "@/Components/PublicSite/RenewedPageHero";

/*
 * よくある質問（試作 faq/index.html の移植）。
 * 試作の絞り込みタグ（相談・料金・制作・運用）は固定文言だったが、
 * 本番は管理画面のFAQカテゴリ（FaqController::show() が渡す categories）をそのまま使う
 */
export default function Faq({ page, categories = [] }) {
    const [filter, setFilter] = useState("all");
    const allFaqs = useMemo(
        () => categories.flatMap((category) => category.published_faqs.map((faq) => ({ ...faq, categoryName: category.name }))),
        [categories],
    );
    const visible = filter === "all" ? allFaqs : allFaqs.filter((faq) => faq.categoryName === filter);

    return (
        <PublicLayout renewed>
            <Head title={page?.title || "よくある質問"} />
            <RenewedPageHero
                eyebrow="QUESTIONS"
                title="相談の、その前に。"
                lead={
                    <>
                        気になること、不安なこと。
                        <br />
                        ご依頼前によくいただくご質問をまとめました。
                    </>
                }
                current="よくある質問"
            />

            <section className="shell page-section faq-directory">
                {allFaqs.length === 0 ? (
                    <p>現在公開中のFAQはありません。お気軽にお問い合わせください。</p>
                ) : (
                    <>
                        <div className="filter-bar">
                            <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
                                すべて
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    aria-pressed={filter === category.name}
                                    onClick={() => setFilter(category.name)}
                                >
                                    {category.name}
                                </button>
                            ))}
                            <span aria-live="polite">{visible.length}件の質問</span>
                        </div>
                        {visible.map((faq) => (
                            <details className="faq-item" key={faq.id}>
                                <summary>
                                    <span className="faq-tag">{faq.categoryName}</span>
                                    {faq.question}
                                </summary>
                                <p>{faq.answer}</p>
                            </details>
                        ))}
                    </>
                )}
            </section>
        </PublicLayout>
    );
}
