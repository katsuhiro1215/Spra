import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import RenewedPageHero from "@/Components/PublicSite/RenewedPageHero";
import { Arrow, ROUTES, SiteLink } from "@/Components/PublicSite/links";

/*
 * 制作の流れ（試作 flow/index.html の移植）。新規ページ（設計書 §5）。
 * トップのヒーロー等と同じく、現時点では固定ページ(セクション)を持たないためコードに置く
 */
const STEPS = [
    ["01", "約1分のシミュレーション", "費用の目安を知る", "つくりたいものと必要な機能を選ぶと、概算の目安を確認できます。まだ決まっていない項目は、そのまま相談できます。", "選んだ内容を相談へ引き継げます。", false],
    ["02", "初回ヒアリング", "話して、整理する", "現在の状況、目的、ご予算、希望時期を聞かせてください。資料がそろっていなくても、課題を整理するところから始めます。", "ご要望と優先順位を一緒に整理します。", false],
    ["03", "最短3営業日でご提案", "方向性を見る", "ヒアリングと必要資料の確認後、ページ構成、デザインの方向性、概算費用、進め方をご提案します。", "完成デザインではなく、進む方向を確かめる提案です。", false],
    ["04", "お見積もり・ご契約", "納得して、始める", "制作範囲・費用・スケジュールをご確認いただき、ご契約へ。見積もりから書類のやり取りまでSmartSproutsで管理します。", "変更がある場合は、費用と日程を事前に確認します。", true],
    ["05", "デザイン・開発・確認", "途中も、一緒に確かめる", "画面や機能を段階的に共有します。SmartSproutsで進捗を確認し、確認事項にお答えいただきながら完成に近づけます。", "「完成するまで分からない」を減らします。", true],
    ["06", "公開・運用・改善", "公開して、育てる", "動作確認と最終確認を経て公開。操作のご案内から、その後の更新・保守・改善まで相談できます。", "保守作業の内容も、報告書で見えるように。", false],
];

const FAQS = [
    ["何をつくるか、まだ決まっていません。", "困っていることや、やってみたいことから聞かせてください。Webサイト、システム、アプリのどれが適しているかも含めて一緒に整理します。"],
    ["概算見積もりと正式な見積もりは違いますか？", "シミュレーターは予算を考えるための目安です。正式な費用と納期は、具体的な制作範囲・機能・素材の準備状況を確認したうえでお見積もりします。"],
    ["最短3営業日で何が見られますか？", "初回ヒアリングと必要資料の確認後、構成とデザインの方向性をご提案します。完成デザインや実装の納品ではありません。案件の規模と稼働状況によって日程を相談します。"],
    ["制作中の進み具合はどう確認できますか？", "専用アカウントから制作の状況を確認できます。確認事項や制作物についても、段階ごとに共有しながら進めます。"],
];

export default function Flow() {
    return (
        <PublicLayout renewed>
            <Head title="制作の流れ" />
            <RenewedPageHero
                eyebrow="HOW WE WORK"
                title={
                    <>
                        ひとつずつ、
                        <br />
                        納得しながら進める。
                    </>
                }
                lead={
                    <>
                        費用の目安も、デザインの方向性も、制作の進み具合も。
                        <br />
                        分からないまま進めず、一緒に確かめていきます。
                    </>
                }
                current="制作の流れ"
            />

            <section className="shell page-section flow-detail">
                <aside>
                    <p className="eyebrow">YOUR NEXT STEP</p>
                    <h2>
                        相談から、
                        <br />
                        公開後まで。
                    </h2>
                    <p>
                        内容が決まっていない段階から
                        <br />
                        相談いただけます。
                    </p>
                    <SiteLink className="text-link" href={ROUTES.estimate}>
                        まずは費用の目安を <Arrow />
                    </SiteLink>
                </aside>
                <ol>
                    {STEPS.map(([no, eyebrow, title, text, small, inSystem]) => (
                        <li className="reveal" key={no}>
                            <span className="flow-detail-no">{no}</span>
                            <div>
                                <span className="eyebrow">{eyebrow}</span>
                                <h2>{title}</h2>
                                <p>{text}</p>
                                <small>{small}</small>
                                {inSystem && <span className="system-badge">SmartSproutsで確認</span>}
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="shell page-section tint-green editorial-split">
                <h2 className="section-heading">
                    速く見せて、
                    <br />
                    丁寧に仕上げる。
                </h2>
                <div>
                    <p className="lead-copy">最短3営業日の提案は、最初の方向性を確かめるためのものです。</p>
                    <p>ヒアリングと必要資料がそろってからの目安です。制作規模や稼働状況により、日程をご相談します。完成デザイン・実装・無制限の修正を含むお約束ではありません。</p>
                    <p>AIによる制作補助も活用しながら、事業に合うかどうか、公開して問題がないかを人が確かめます。</p>
                </div>
            </section>

            <section className="faq shell" aria-label="よくある質問">
                <div>
                    <p className="eyebrow">QUESTIONS</p>
                    <h2 className="section-heading">相談の、その前に。</h2>
                    <SiteLink className="text-link" href={ROUTES.faq}>
                        ほかの質問も見る <Arrow />
                    </SiteLink>
                </div>
                <div>
                    {FAQS.map(([question, answer]) => (
                        <details key={question}>
                            <summary>{question}</summary>
                            <p>{answer}</p>
                        </details>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
