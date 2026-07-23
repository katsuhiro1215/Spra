import { Head, router } from "@inertiajs/react";
import {
    PlayCircleIcon,
    CodeBracketSquareIcon,
    ShieldCheckIcon,
    CloudIcon,
    SparklesIcon,
    CalendarDaysIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";

const BRAND_LABELS = {
    concierge: "Atlas Concierge",
    life: "Atlas Life",
    japan: "Atlas Japan",
};

const pillars = [
    {
        icon: CodeBracketSquareIcon,
        title: "開発思想",
        body: "私たちは多数のユーザーに向けた最適化ではなく、単一の資産家・単一のご家族のためだけに存在するシステムを構築します。要件は毎回ゼロから設計され、既製のテンプレートには依存しません。導入前のヒアリングでは、業務フローだけでなく、意思決定の癖や情報の扱い方まで踏み込んでお伺いします。",
    },
    {
        icon: ShieldCheckIcon,
        title: "セキュリティへの考え方",
        body: "多層防御、最小権限の原則、監査可能な操作ログ、そして第三者機関による定期的な脆弱性診断。情報資産の重要度に応じて、暗号化と権限設計を個別に設計します。Private Room自体も、ログインと招待コードの二重の入場制限で保護されています。",
    },
    {
        icon: CloudIcon,
        title: "AWSを採用する理由",
        body: "可用性・監査対応・データ主権のすべてを満たすため、専用のプライベートネットワーク構成を採用。リージョン選定からIAM設計まで、金融機関水準のガバナンスを前提に構築しています。",
    },
    {
        icon: SparklesIcon,
        title: "AIへの取り組み",
        body: "生成AIは意思決定を代替するものではなく、情報の整理と一次案の提示に限定して活用します。学習データの扱い、機密情報の分離についても厳格な方針を定めています。",
    },
];

const caseStudies = [
    {
        title: "資産管理会社A社",
        summary: "複数の資産管理会社・信託を横断した、家族単位での資産可視化基盤を構築。",
    },
    {
        title: "事業承継を控えるオーナー家",
        summary: "後継者への引き継ぎを見据えた、情報アクセス権限の段階的移譲設計を実施。",
    },
];

const estimates = [
    { label: "初期構築", value: "個別見積もり（要件確認後にご提示）" },
    { label: "月額運用", value: "ブランド・利用範囲に応じて変動" },
];

export default function AtlasRoom({ brand, email, consultationUrl }) {
    const handleLogout = () => {
        router.post("/logout");
    };

    return (
        <div className="min-h-screen bg-[#08080a] text-neutral-200">
            <Head title="Private Room | Atlas" />

            <header className="border-b border-white/5">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <span className="font-serif text-lg tracking-[0.2em] text-neutral-100">
                        {BRAND_LABELS[brand] ?? "ATLAS"}
                    </span>
                    <div className="flex items-center gap-6 text-sm text-neutral-400">
                        <span>{email}</span>
                        <button
                            onClick={handleLogout}
                            className="hover:text-amber-200"
                        >
                            ログアウト
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-16 space-y-20">
                {/* Hero */}
                <section className="text-center">
                    <p className="text-xs tracking-[0.35em] text-amber-200/70 mb-4">
                        PRIVATE ROOM
                    </p>
                    <h1 className="font-serif text-3xl sm:text-4xl text-neutral-50 mb-4">
                        ようこそ、{BRAND_LABELS[brand] ?? "Atlas"}へ
                    </h1>
                    <p className="text-neutral-400 max-w-xl mx-auto">
                        デモ、UI、技術構成、ケーススタディ、概算費用まで。ここでしか公開していない内容をまとめています。
                    </p>
                </section>

                {/* Demo */}
                <section>
                    <p className="text-xs tracking-[0.3em] text-neutral-500 mb-4">
                        DEMO
                    </p>
                    <div className="aspect-video rounded-2xl border border-white/10 bg-[#0d0d10] flex items-center justify-center">
                        <div className="text-center text-neutral-500">
                            <PlayCircleIcon className="w-12 h-12 mx-auto mb-3 text-amber-200/70" />
                            <p className="text-sm">
                                デモ動画は準備中です。個別にご案内いたします。
                            </p>
                        </div>
                    </div>
                </section>

                {/* UI */}
                <section>
                    <p className="text-xs tracking-[0.3em] text-neutral-500 mb-4">
                        UI
                    </p>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="aspect-[4/3] rounded-xl border border-white/10 bg-[#0d0d10] flex items-center justify-center text-neutral-600 text-sm"
                            >
                                画面キャプチャ準備中
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tech / philosophy pillars, fully visible */}
                <section>
                    <p className="text-xs tracking-[0.3em] text-neutral-500 mb-6">
                        TECHNOLOGY & PHILOSOPHY
                    </p>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {pillars.map(({ icon: Icon, title, body }) => (
                            <div
                                key={title}
                                className="rounded-2xl border border-white/10 bg-[#0d0d10] p-8"
                            >
                                <Icon className="w-6 h-6 text-amber-200/80 mb-5" />
                                <h3 className="font-serif text-lg text-neutral-50 mb-3">
                                    {title}
                                </h3>
                                <p className="text-sm text-neutral-400 leading-relaxed">
                                    {body}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Case studies */}
                <section>
                    <p className="text-xs tracking-[0.3em] text-neutral-500 mb-6">
                        CASE STUDIES
                    </p>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {caseStudies.map((cs) => (
                            <div
                                key={cs.title}
                                className="rounded-2xl border border-white/10 bg-[#0d0d10] p-8"
                            >
                                <h3 className="font-serif text-lg text-neutral-50 mb-3">
                                    {cs.title}
                                </h3>
                                <p className="text-sm text-neutral-400 leading-relaxed">
                                    {cs.summary}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Estimate */}
                <section>
                    <p className="text-xs tracking-[0.3em] text-neutral-500 mb-6">
                        ROUGH ESTIMATE
                    </p>
                    <div className="rounded-2xl border border-white/10 bg-[#0d0d10] divide-y divide-white/5">
                        {estimates.map((row) => (
                            <div
                                key={row.label}
                                className="flex items-center justify-between px-8 py-5"
                            >
                                <span className="text-sm text-neutral-400">
                                    {row.label}
                                </span>
                                <span className="text-sm text-neutral-100">
                                    {row.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Meeting booking */}
                <section className="text-center rounded-2xl border border-amber-200/20 bg-amber-200/5 p-10">
                    <CalendarDaysIcon className="w-8 h-8 mx-auto mb-4 text-amber-200" />
                    <h2 className="font-serif text-xl text-neutral-50 mb-3">
                        打ち合わせのご予約
                    </h2>
                    <p className="text-sm text-neutral-400 mb-6 max-w-md mx-auto">
                        ご要望の詳細や概算費用について、担当者と直接お話しいただけます。
                    </p>
                    <a
                        href={consultationUrl}
                        className="inline-flex items-center gap-2 rounded-lg bg-amber-200 text-[#08080a] text-sm font-medium px-6 py-3 hover:bg-amber-100 transition-colors"
                    >
                        打ち合わせを予約する
                        <ArrowRightIcon className="w-4 h-4" />
                    </a>
                </section>
            </main>
        </div>
    );
}
