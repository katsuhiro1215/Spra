import { Head, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import RenewedPageHero from "@/Components/PublicSite/RenewedPageHero";
import { Arrow, ROUTES, SiteLink } from "@/Components/PublicSite/links";

/*
 * 私たちについて（試作 about/index.html の移植）。
 * 試作の「代表紹介（/greeting）」への導線は、代表紹介ページが段階3（未着手）のため外している。
 * 代表者名は組織情報（organization.representative_name）から出す
 */
const APPROACH = [
    ["01", "よく聞く。", "解決策を決める前に、今の事業と困りごとを知る。言葉になっていない想いも、一緒に整理します。"],
    ["02", "途中を見せる。", "完成を待つだけの時間にしない。制作の状況と、次に確認してほしいことを共有します。"],
    ["03", "その先を考える。", "公開した後、誰がどう使うのか。日々の更新や管理まで見据えて、無理なく続く形を考えます。"],
];

export default function About() {
    const { props } = usePage();
    const representative = props.organization?.representative_name;

    return (
        <PublicLayout renewed>
            <Head title="私たちについて" />
            <RenewedPageHero
                eyebrow="ABOUT US"
                title={
                    <>
                        つくる前に、
                        <br />
                        あなたの話を聞きたい。
                    </>
                }
                lead={
                    <>
                        事業のこと、これまでのこと、これからのこと。
                        <br />
                        そこから、必要なデザインと仕組みを考えます。
                    </>
                }
                current="私たちについて"
            />

            <section className="shell page-section about-manifesto">
                <p className="lead-copy">
                    良いサービスも、
                    <br />
                    まっすぐな想いも。
                    <br />
                    <em>伝わる形があると、前に進む。</em>
                </p>
                <div>
                    <p>SmartSproutsは、奈良を拠点にWebサイト制作・システム開発・アプリ開発を行っています。</p>
                    <p>専門的な言葉を並べるよりも、同じ方向を見ながら話すこと。必要なものを一緒に考え、使う人に届く形にすることを大切にしています。</p>
                </div>
            </section>

            <section className="shell page-section">
                <p className="eyebrow">OUR APPROACH</p>
                <div className="section-top">
                    <h2 className="section-heading">
                        大切にしている、
                        <br />
                        3つのこと。
                    </h2>
                </div>
                <div className="feature-grid three">
                    {APPROACH.map(([no, title, text]) => (
                        <article className="feature reveal" key={no}>
                            <span>{no}</span>
                            <h3>{title}</h3>
                            <p>{text}</p>
                        </article>
                    ))}
                </div>
            </section>

            {representative && (
                <section className="shell page-section founder-teaser">
                    <div>
                        <p className="eyebrow">THE PERSON BEHIND THE CODE</p>
                        <h2 className="section-heading">
                            話す人と、
                            <br />
                            つくる人が、近い。
                        </h2>
                        <p>代表 / {representative}</p>
                        <SiteLink className="text-link" href={ROUTES.contact}>
                            代表にまずは相談する <Arrow />
                        </SiteLink>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
