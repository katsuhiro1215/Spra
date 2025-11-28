import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { PageHero } from "@/Components/Public";

export default function Terms({ auth }) {
    const breadcrumbs = [{ label: "利用規約" }];

    const sections = [
        {
            title: "第1条（適用）",
            content: [
                "本規約は、株式会社Smart Sprouts（以下「当社」といいます。）が提供するWebサイト制作・システム開発・その他ITサービス（以下「本サービス」といいます。）の利用条件を定めるものです。",
                "本サービスを利用されるお客様（以下「利用者」といいます。）には、本規約をご承諾いただいた上で、本サービスをご利用いただきます。",
                "本規約に同意されない場合は、本サービスをご利用いただくことはできません。",
            ],
        },
        {
            title: "第2条（規約の変更）",
            content: [
                "当社は、利用者の事前の同意を得ることなく、いつでも本規約を変更することができるものとします。",
                "変更後の規約は、当社のWebサイトに掲載された時点で効力を生じるものとします。",
                "利用者が規約変更後に本サービスを利用した場合、変更後の規約に同意したものとみなします。",
            ],
        },
        {
            title: "第3条（サービス内容）",
            content: [
                "本サービスは、以下の業務を含みます：",
                "・Webサイトの企画・設計・制作・運用",
                "・Webアプリケーション・システムの開発",
                "・ITコンサルティング・技術支援",
                "・その他当社が提供するITサービス",
                "サービス内容の詳細は、個別の契約書または発注書にて定めるものとします。",
            ],
        },
        {
            title: "第4条（契約の成立）",
            content: [
                "本サービスの契約は、利用者からの発注に対して当社が承諾の意思表示をした時点で成立するものとします。",
                "契約条件は、見積書、発注書、契約書等の書面により明確に定めるものとします。",
                "当社は、以下の場合には、お客様からの発注を承諾しない場合があります：",
                "・技術的に実現困難と判断される場合",
                "・法令に違反する恐れがある場合",
                "・当社の業務運営上支障がある場合",
            ],
        },
        {
            title: "第5条（料金・支払い）",
            content: [
                "本サービスの料金は、個別の見積書または契約書に定める金額とします。",
                "料金の支払いは、請求書発行から30日以内に指定の銀行口座への振込により行うものとします。",
                "振込手数料は利用者の負担とします。",
                "支払いが遅延した場合、年14.6%の割合で遅延損害金をお支払いいただきます。",
            ],
        },
        {
            title: "第6条（知的財産権）",
            content: [
                "本サービスにより制作されたWebサイト、システム等の著作権は、原則として利用者に帰属します。",
                "ただし、以下の場合は当社に著作権が帰属します：",
                "・当社が独自に開発したプログラム・システム",
                "・当社の既存のテンプレートやライブラリ",
                "・第三者の著作物を使用している部分",
                "利用者は、当社が制作した成果物を当社の実績として公開することを許諾するものとします。",
            ],
        },
        {
            title: "第7条（秘密保持）",
            content: [
                "当社及び利用者は、本サービスの提供に関して知り得た相手方の秘密情報を第三者に開示してはならないものとします。",
                "秘密情報とは、技術上、営業上、その他事業に関する一切の情報をいいます。",
                "ただし、以下の情報は秘密情報から除外されます：",
                "・開示時点で既に公知の情報",
                "・正当な権利者から適法に取得した情報",
                "・法令により開示が義務付けられた情報",
            ],
        },
        {
            title: "第8条（納期・検収）",
            content: [
                "納期は個別の契約書または発注書に定める期日とします。",
                "天災地変、戦争、暴動、法令の制定改廃その他当社の責めに帰すことのできない事由により納期に遅延が生じた場合、当社は責任を負わないものとします。",
                "利用者は、成果物の納品から7日以内に検収を行い、結果を当社に通知するものとします。",
                "期間内に通知がない場合は、検収が完了したものとみなします。",
            ],
        },
        {
            title: "第9条（保証・免責）",
            content: [
                "当社は、本サービスについて以下の保証をいたします：",
                "・契約書に定められた仕様を満たすこと",
                "・重大な瑕疵がないこと",
                "ただし、以下については保証の対象外とします：",
                "・利用者の使用環境に起因する問題",
                "・第三者のサービス・システムの変更による影響",
                "・軽微な不具合で業務に支障がないもの",
            ],
        },
        {
            title: "第10条（損害賠償）",
            content: [
                "当社の故意または重大な過失により利用者に損害を与えた場合、当社は損害賠償責任を負います。",
                "ただし、当社の賠償責任の上限は、当該契約に基づき利用者が当社に支払った料金の総額を限度とします。",
                "当社は、間接損害、特別損害、将来の利益の逸失等については責任を負いません。",
                "利用者の故意または過失により当社に損害が生じた場合、利用者は当社に対し損害賠償責任を負うものとします。",
            ],
        },
        {
            title: "第11条（契約の解除）",
            content: [
                "当社及び利用者は、相手方が以下のいずれかに該当した場合、催告なしに契約を解除することができます：",
                "・契約上の義務に違反し、相当期間を定めて催告したにもかかわらず、その違反が是正されない場合",
                "・支払いを停止し、または破産・民事再生等の申立てがあった場合",
                "・手形・小切手が不渡りになった場合",
                "・その他契約を継続し難い重大な事由が生じた場合",
            ],
        },
        {
            title: "第12条（個人情報保護）",
            content: [
                "当社は、個人情報の保護に関する法律及び関連法令を遵守し、個人情報を適切に取り扱います。",
                "個人情報の取り扱いについては、別途定める「プライバシーポリシー」に従います。",
                "利用者から取得した個人情報は、本サービスの提供及び関連する業務にのみ使用します。",
            ],
        },
        {
            title: "第13条（反社会的勢力の排除）",
            content: [
                "当社及び利用者は、現在及び将来にわたって以下のいずれにも該当しないことを確約します：",
                "・暴力団、暴力団員、暴力団準構成員、暴力団関係企業等の反社会的勢力であること",
                "・反社会的勢力と何らかの関係を有すること",
                "前項に違反した場合、契約を直ちに解除することができます。",
            ],
        },
        {
            title: "第14条（準拠法・管轄）",
            content: [
                "本規約の準拠法は日本法とします。",
                "本規約に関して生じた紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。",
            ],
        },
        {
            title: "第15条（その他）",
            content: [
                "本規約に定めのない事項については、当社と利用者が誠意をもって協議するものとします。",
                "本規約の一部が無効または執行不能となった場合でも、その他の規定の有効性には影響しません。",
                "本規約は2024年1月1日から施行します。",
            ],
        },
    ];

    const lastUpdated = "2024年1月1日";

    return (
        <PublicLayout auth={auth}>
            <Head title="利用規約" />

            <PageHero
                title="Terms of Service"
                subtitle="利用規約"
                breadcrumbs={breadcrumbs}
            />

            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Introduction */}
                        <div className="mb-12">
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
                                <h2 className="text-xl font-bold text-blue-900 mb-2">
                                    利用規約について
                                </h2>
                                <p className="text-blue-800">
                                    本規約は、株式会社Smart
                                    Sproutsが提供するWebサイト制作・システム開発サービスをご利用いただく際の条件を定めたものです。
                                    サービスをご利用いただく前に、必ずお読みいただき、内容をご理解・ご同意の上でお申し込みください。
                                </p>
                                <p className="text-blue-800 mt-3 text-sm">
                                    最終更新日: {lastUpdated}
                                </p>
                            </div>
                        </div>

                        {/* Terms Sections */}
                        <div className="space-y-8">
                            {sections.map((section, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-lg p-6"
                                >
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                        {section.title}
                                    </h3>
                                    <div className="space-y-3">
                                        {section.content.map(
                                            (paragraph, paragraphIndex) => (
                                                <p
                                                    key={paragraphIndex}
                                                    className="text-gray-700 leading-relaxed"
                                                >
                                                    {paragraph}
                                                </p>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Contact Information */}
                        <div className="mt-12 bg-gradient-to-r from-gray-100 to-blue-50 rounded-xl p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                お問い合わせ
                            </h3>
                            <p className="text-gray-700 mb-4">
                                本規約についてご不明な点がございましたら、お気軽にお問い合わせください。
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        株式会社Smart Sprouts
                                    </p>
                                    <p className="text-gray-600">
                                        〒100-0001 東京都千代田区千代田1-1-1
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">
                                        電話: 03-1234-5678
                                        <br />
                                        Email: info@smartsprouts.com
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/privacy-policy"
                                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                プライバシーポリシー
                            </a>
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                お問い合わせ
                            </a>
                            <a
                                href="/"
                                className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                ホームへ戻る
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
