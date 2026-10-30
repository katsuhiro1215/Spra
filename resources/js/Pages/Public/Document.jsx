import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import RenewedPageHero from "@/Components/PublicSite/RenewedPageHero";

/*
 * プライバシーポリシー・利用規約（試作 privacy-policy/index.html の見た目に合わせる）
 */
export default function Document({ document }) {
    return (
        <PublicLayout renewed>
            <Head title={document.title} />
            <RenewedPageHero eyebrow="PRIVACY POLICY" title={document.title} lead={document.description} current={document.title} />
            <section className="narrow prose page-section">
                <div style={{ whiteSpace: "pre-wrap" }}>{document.content}</div>
                {document.effective_date && (
                    <p className="note">
                        発効日：{document.effective_date}（v{document.version}）
                    </p>
                )}
            </section>
        </PublicLayout>
    );
}
