import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";

export default function PrivacyPolicy({ auth }) {
    const breadcrumbs = [{ label: "プライバシーポリシー" }];

    const sections = [
        {
            title: "1. 個人情報の定義",
            content:
                "本プライバシーポリシーにおいて、個人情報とは、個人情報保護法第2条第1項により定義された個人情報、すなわち、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日その他の記述等により特定の個人を識別することができるもの(他の情報と容易に照合することができ、それにより特定の個人を識別することができることとなるものを含む)を指します。",
        },
        {
            title: "2. 個人情報の収集方法",
            content:
                "当社は、お客様が当社サービスをご利用になる際に、以下の方法により個人情報を収集させていただく場合があります。\n\n• お問い合わせフォーム、メール、電話等によるお問い合わせ時\n• サービスのお申し込み時\n• セミナーやイベントへのお申し込み時\n• 名刺交換時\n• その他、当社サービスをご利用いただく際",
        },
        {
            title: "3. 個人情報の利用目的",
            content:
                "当社は、お客様からお預かりした個人情報を以下の目的のために利用させていただきます。\n\n• サービスの提供・運営のため\n• お客様からのお問い合わせに対応するため\n• サービスに関するご案内、お知らせをお送りするため\n• メンテナンス、重要なお知らせなどの連絡のため\n• サービスの改善、新サービスの開発等に役立てるため\n• 当社サービスに関する統計データの作成のため\n• その他、上記利用目的に付随する目的のため",
        },
        {
            title: "4. 個人情報の第三者提供",
            content:
                "当社は、お客様の同意を得ることなく、第三者に個人情報を提供することはありません。ただし、以下の場合はこの限りではありません。\n\n• 法令に基づく場合\n• 人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難である場合\n• 公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難である場合\n• 国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがある場合",
        },
        {
            title: "5. 個人情報の管理",
            content:
                "当社は、お客様の個人情報を正確かつ最新の状態に保ち、個人情報への不正アクセス・紛失・破損・改ざん・漏洩などを防止するため、セキュリティシステムの維持・管理体制の整備・社員教育の徹底等の必要な措置を講じ、安全対策を実施し個人情報の厳重な管理を行います。",
        },
        {
            title: "6. 個人情報の開示・訂正・削除",
            content:
                "お客様ご本人が個人情報の照会・修正・削除などをご希望される場合には、ご本人であることを確認の上、対応させていただきます。個人情報に関するお問い合わせは、下記の窓口までご連絡ください。\n\n【お問い合わせ窓口】\nメールアドレス: privacy@smartsprouts.com\n電話番号: 03-1234-5678(平日 9:00-18:00)",
        },
        {
            title: "7. Cookie(クッキー)その他の技術の利用",
            content:
                "当社のサービスは、Cookie及びこれに類する技術を利用することがあります。これらの技術は、当社による当社のサービスの利用状況等の把握に役立ち、サービス向上に資するものです。Cookieを無効化されたいユーザーは、ウェブブラウザの設定を変更することによりCookieを無効化することができます。ただし、Cookieを無効化すると、当社サービスの一部の機能をご利用いただけなくなる場合があります。",
        },
        {
            title: "8. プライバシーポリシーの変更",
            content:
                "本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく変更することができるものとします。変更後のプライバシーポリシーは、本ウェブサイトに掲載した時点から効力を生じるものとします。",
        },
        {
            title: "9. お問い合わせ",
            content:
                "本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。\n\n株式会社Smart Sprouts\n〒100-0001 東京都千代田区千代田1-1-1\nメール: info@smartsprouts.com\n電話: 03-1234-5678",
        },
    ];

    return (
        <PublicLayout auth={auth}>
            <PageHero
                title="Privacy Policy"
                subtitle="プライバシーポリシー"
                breadcrumbs={breadcrumbs}
            />

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                            <div className="mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    プライバシーポリシー
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    株式会社Smart
                                    Sprouts(以下、「当社」といいます。)は、本ウェブサイト上で提供するサービス(以下、「本サービス」といいます。)における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー(以下、「本ポリシー」といいます。)を定めます。
                                </p>
                            </div>

                            <div className="space-y-10">
                                {sections.map((section, index) => (
                                    <div
                                        key={index}
                                        className="pb-10 border-b border-gray-200 last:border-0 last:pb-0"
                                    >
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                            <span className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </span>
                                            {section.title}
                                        </h3>
                                        <div className="ml-13 text-gray-600 leading-relaxed whitespace-pre-line">
                                            {section.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <p className="text-sm text-gray-500 text-right">
                                    制定日: 2020年1月1日
                                    <br />
                                    最終改定日: 2024年1月1日
                                </p>
                            </div>
                        </div>

                        {/* お問い合わせCTA */}
                        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-center text-white">
                            <h3 className="text-2xl font-bold mb-4">
                                個人情報に関するお問い合わせ
                            </h3>
                            <p className="mb-6">
                                プライバシーポリシーに関するご質問やご不明な点がございましたら、
                                <br />
                                お気軽にお問い合わせください。
                            </p>
                            <a
                                href="/contact"
                                className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                            >
                                お問い合わせはこちら
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
