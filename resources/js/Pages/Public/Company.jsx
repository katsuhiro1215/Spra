import { Head, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import RenewedPageHero from "@/Components/PublicSite/RenewedPageHero";
import { Arrow, ROUTES, SiteLink } from "@/Components/PublicSite/links";

/*
 * 事業者情報（試作 company/index.html の移植）。
 * 定義リストは組織情報（organization、共有プロップ）から出す。固定の文言には置き換えない。
 * 試作の「代表紹介」「採用情報」へのリンクは、どちらも未着手（段階3）のため外している
 *
 * 所在地：試作は「都道府県・市」までにとどめ、「自宅兼事務所のため、詳細はご契約の際にお伝えします」としていた
 * （番地レベルの district/address_other は個人事業主の自宅住所になりうるため）。
 * 旧ページ（Tailwind版）は formatAddress() で番地まで公開していたが、ここでは試作の扱いに合わせた。
 * 番地まで公開する方針に戻す場合は、Utils/address の formatAddress() を使う
 */
export default function Company({ histories = [] }) {
    const { props } = usePage();
    const org = props.organization;
    const defaultAddress = org?.default_address?.[0];
    const address = defaultAddress ? [defaultAddress.prefecture, defaultAddress.city].filter(Boolean).join("") : null;

    return (
        <PublicLayout renewed>
            <Head title="事業者情報" />
            <RenewedPageHero
                eyebrow="COMPANY"
                title={
                    <>
                        安心して、
                        <br />
                        声をかけていただくために。
                    </>
                }
                lead="基本情報をご案内します。"
                current="事業者情報"
            />

            <section className="shell page-section editorial-split">
                <div>
                    <p className="eyebrow">INFORMATION</p>
                    <h2 className="section-heading">{org?.site_name || org?.name}について。</h2>
                    <p>必要なことを、必要な分だけ。小さなご相談からお聞かせください。</p>
                </div>
                <dl className="definition-list">
                    {org?.legal_name && (
                        <div>
                            <dt>屋号・社名</dt>
                            <dd>{org.legal_name}</dd>
                        </div>
                    )}
                    {org?.representative_name && (
                        <div>
                            <dt>代表</dt>
                            <dd>{org.representative_name}</dd>
                        </div>
                    )}
                    {org?.established_date && (
                        <div>
                            <dt>設立・開業</dt>
                            <dd>{org.established_date}</dd>
                        </div>
                    )}
                    {address && (
                        <div>
                            <dt>所在地</dt>
                            <dd>
                                {address}
                                <br />
                                自宅兼事務所のため、詳細はご契約の際にお伝えします。
                            </dd>
                        </div>
                    )}
                    {org?.business_description && (
                        <div>
                            <dt>事業内容</dt>
                            <dd>{org.business_description}</dd>
                        </div>
                    )}
                    {org?.business_hours && (
                        <div>
                            <dt>営業時間</dt>
                            <dd>{org.business_hours}</dd>
                        </div>
                    )}
                    {(org?.phone || org?.email) && (
                        <div>
                            <dt>連絡先</dt>
                            <dd>
                                {org.phone && (
                                    <>
                                        <a href={`tel:${org.phone.replace(/[^\d+]/g, "")}`}>{org.phone}</a>
                                        <br />
                                    </>
                                )}
                                {org.email && <a href={`mailto:${org.email}`}>{org.email}</a>}
                            </dd>
                        </div>
                    )}
                </dl>
            </section>

            {histories.length > 0 && (
                <section className="shell page-section">
                    <p className="eyebrow">HISTORY</p>
                    <div className="section-top">
                        <h2 className="section-heading">沿革</h2>
                    </div>
                    <dl className="definition-list">
                        {histories.map((history) => (
                            <div key={history.id}>
                                <dt>{history.event_date}</dt>
                                <dd>{history.title}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}

            <section className="shell page-section">
                <div className="related-links">
                    <SiteLink className="text-link" href={ROUTES.contact}>
                        まずはご相談ください <Arrow />
                    </SiteLink>
                    <SiteLink className="text-link" href="/about">
                        私たちが大切にしていること <Arrow />
                    </SiteLink>
                </div>
            </section>
        </PublicLayout>
    );
}
