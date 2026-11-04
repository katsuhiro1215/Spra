import { useForm, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import RenewedPageHero from "@/Components/PublicSite/RenewedPageHero";
import { PublicFlashMessage } from "@/Components/Notifications";
import { Arrow, ROUTES, SiteLink } from "@/Components/PublicSite/links";

const QUOTE_CATEGORY_SLUG = "quote-request";

/*
 * お問い合わせフォーム（試作 contact/index.html の移植。レイアウト・配色のみ。
 * フォーム項目・送信ロジックは既存のまま：name/email/phone/company/contact_category_id/subject/message）
 * 試作にはsubject欄が無いが、バックエンドで必須のため残している。
 * 連絡先（電話・メール）は組織情報（organization、共有プロップ）から出す。
 * 旧版は "03-1234-5678" "info@smartsprouts.com" という実在しない連絡先を表示していた
 */
export default function Contact({ categories = [] }) {
    const { props } = usePage();
    const organization = props.organization;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        contact_category_id: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("contact.store"), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const selectedCategory = categories.find((cat) => String(cat.id) === String(data.contact_category_id));
    const isQuoteCategorySelected = selectedCategory?.slug === QUOTE_CATEGORY_SLUG;

    return (
        <PublicLayout renewed>
            <RenewedPageHero
                eyebrow="LET'S TALK"
                title={
                    <>
                        まとまっていなくても、
                        <br />
                        大丈夫です。
                    </>
                }
                lead="やってみたいこと、困っていること。まずは、あなたのお話を聞かせてください。"
                current="お問い合わせ"
            />

            <PublicFlashMessage />

            <section className="shell page-section contact-layout">
                <aside className="contact-aside">
                    <h2>
                        小さな相談から、
                        <br />
                        一緒に。
                    </h2>
                    <p>
                        Web制作・システム開発・アプリ開発。
                        <br />
                        目的やご予算に合わせて、進め方を考えます。
                    </p>
                    {organization?.phone && (
                        <div className="contact-method">
                            <small>お電話</small>
                            <a href={`tel:${organization.phone.replace(/[^\d+]/g, "")}`}>{organization.phone}</a>
                            {organization?.business_hours && <span>{organization.business_hours}</span>}
                        </div>
                    )}
                    {organization?.email && (
                        <div className="contact-method">
                            <small>メール</small>
                            <a href={`mailto:${organization.email}`}>{organization.email}</a>
                        </div>
                    )}
                    <p className="note">3営業日以上返信がない場合は、上記メールアドレスへご連絡ください。</p>
                    <SiteLink className="text-link" href={ROUTES.faq}>
                        よくある質問を見る <Arrow />
                    </SiteLink>
                </aside>

                <div className="contact-form-wrap">
                    <form onSubmit={handleSubmit}>
                        <label>
                            お名前 <span className="required">必須</span>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="山田 太郎"
                                required
                            />
                            {errors.name && <p className="form-error">{errors.name}</p>}
                        </label>

                        <div className="form-row">
                            <label>
                                会社名・団体名 <span className="optional">任意</span>
                                <input
                                    type="text"
                                    value={data.company}
                                    onChange={(e) => setData("company", e.target.value)}
                                    placeholder="○○○ 株式会社"
                                />
                            </label>
                            <label>
                                電話番号 <span className="optional">任意</span>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData("phone", e.target.value)}
                                    placeholder="090-1234-5678"
                                />
                            </label>
                        </div>

                        <label>
                            メールアドレス <span className="required">必須</span>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                placeholder="name@example.com"
                                required
                            />
                            {errors.email && <p className="form-error">{errors.email}</p>}
                        </label>

                        {categories.length > 0 && (
                            <label>
                                お問い合わせ種別 <span className="required">必須</span>
                                <select
                                    value={data.contact_category_id}
                                    onChange={(e) => setData("contact_category_id", e.target.value)}
                                    disabled={processing}
                                    required
                                >
                                    <option value="">選択してください</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.contact_category_id && <p className="form-error">{errors.contact_category_id}</p>}
                            </label>
                        )}

                        {isQuoteCategorySelected && (
                            <p className="prototype-callout">
                                詳細な見積もりは、見積もりシミュレーターが便利です。ご要望を選ぶだけで、その場で概算費用を確認できます。もちろん、このままフォームから送信いただいても構いません。
                                <a href={route("estimate.simulator")}>見積もりシミュレーターを使う →</a>
                            </p>
                        )}

                        <label>
                            件名 <span className="required">必須</span>
                            <input
                                type="text"
                                value={data.subject}
                                onChange={(e) => setData("subject", e.target.value)}
                                placeholder="サービスについてのお問い合わせ"
                                required
                            />
                            {errors.subject && <p className="form-error">{errors.subject}</p>}
                        </label>

                        <label>
                            お問い合わせ内容 <span className="required">必須</span>
                            <textarea
                                value={data.message}
                                onChange={(e) => setData("message", e.target.value)}
                                rows={6}
                                placeholder="お問い合わせ内容をご記入ください"
                                required
                            />
                            {errors.message && <p className="form-error">{errors.message}</p>}
                        </label>

                        <button className="button" type="submit" disabled={processing}>
                            {processing ? "送信中..." : "送信する"} <Arrow />
                        </button>
                    </form>
                </div>
            </section>
        </PublicLayout>
    );
}
