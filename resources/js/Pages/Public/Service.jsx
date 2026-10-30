import { Head, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import RenewedPageHero from "@/Components/PublicSite/RenewedPageHero";
import { Arrow, ROUTES, SiteLink } from "@/Components/PublicSite/links";

/*
 * サービス一覧（試作 service/index.html の移植）。
 * 試作は5件の固定リストだったが、本番は管理画面のサービス（最大21件）を
 * カテゴリごとに並べて、すべて directory-row で一覧できるようにしている。
 */
const ROW_COLORS = ["green", "peach", "lavender", "blue"];

function groupByCategory(services) {
    const groups = new Map();
    services.forEach((service) => {
        const category = service.service_category;
        const key = category?.id || "uncategorized";
        if (!groups.has(key)) {
            groups.set(key, { id: key, name: category?.name || "その他", sortOrder: category?.sort_order ?? 0, services: [] });
        }
        groups.get(key).services.push(service);
    });
    return Array.from(groups.values()).sort((a, b) => a.sortOrder - b.sortOrder);
}

export default function Service({ services = [] }) {
    const { props } = usePage();
    const siteName = props.organization?.site_name || props.organization?.name;
    const groups = groupByCategory(services);
    let rowIndex = 0;

    return (
        <PublicLayout renewed>
            <Head title="サービス一覧">
                <meta name="description" content={`${siteName || ""}が提供するサービス一覧です。`} />
            </Head>
            <RenewedPageHero
                eyebrow="SERVICES"
                title={
                    <>
                        事業に合った、
                        <br />
                        つくり方がある。
                    </>
                }
                lead={
                    <>
                        届けたい想いも、解決したい課題も。
                        <br />
                        見た目の表現から裏側の仕組みまで、一緒に考えます。
                    </>
                }
                current="できること"
            />
            <section className="shell page-section">
                {services.length === 0 ? (
                    <p>現在ご案内できるサービスがありません。</p>
                ) : (
                    groups.map((group) => (
                        <div key={group.id} className="service-directory">
                            {group.services.length > 1 && <p className="eyebrow">{group.name}</p>}
                            {group.services.map((service) => {
                                rowIndex += 1;
                                return (
                                    <SiteLink
                                        key={service.id}
                                        className={`directory-row ${ROW_COLORS[rowIndex % ROW_COLORS.length]}`}
                                        href={`/services/${service.slug}`}
                                    >
                                        <span className="directory-no">{String(rowIndex).padStart(2, "0")}</span>
                                        <div>
                                            <span className="eyebrow">{group.name}</span>
                                            <h2>{service.name}</h2>
                                            {service.description && <p>{service.description}</p>}
                                        </div>
                                        <span className="round" aria-hidden="true">
                                            ↗
                                        </span>
                                    </SiteLink>
                                );
                            })}
                        </div>
                    ))
                )}
            </section>
            <section className="estimate-banner shell">
                <div>
                    <p className="eyebrow">A LITTLE FIRST STEP</p>
                    <h2>まずは、費用の目安から。</h2>
                    <p>
                        つくりたいものを選ぶだけ。約1分の概算シミュレーション。
                        <br />
                        まだ決まっていないことは、そのままご相談できます。
                    </p>
                </div>
                <SiteLink className="button" href={ROUTES.estimate}>
                    概算費用を見てみる <Arrow />
                </SiteLink>
                <span className="estimate-numeral" aria-hidden="true">
                    1<small>min.</small>
                </span>
            </section>
        </PublicLayout>
    );
}
