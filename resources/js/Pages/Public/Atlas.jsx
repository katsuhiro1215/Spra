import { Head, Link } from "@inertiajs/react";
import {
    LockClosedIcon,
    CodeBracketSquareIcon,
    ShieldCheckIcon,
    CloudIcon,
    SparklesIcon,
    ArrowRightIcon,
    KeyIcon,
    EnvelopeIcon,
} from "@heroicons/react/24/outline";

const pillars = [
    {
        icon: CodeBracketSquareIcon,
        title: "開発思想",
        teaser: "汎用化を目的としない、一人のための設計。",
        blurred:
            "私たちは多数のユーザーに向けた最適化ではなく、単一の資産家・単一のご家族のためだけに存在するシステムを構築します。要件は毎回ゼロから設計され、既製のテンプレートには依存しません。",
    },
    {
        icon: ShieldCheckIcon,
        title: "セキュリティへの考え方",
        teaser: "見えないところにこそ、投資する。",
        blurred:
            "多層防御、最小権限の原則、監査可能な操作ログ、そして第三者機関による定期的な脆弱性診断。情報資産の重要度に応じて、暗号化と権限設計を個別に設計します。",
    },
    {
        icon: CloudIcon,
        title: "AWSを採用する理由",
        teaser: "実績ではなく、統制性で選ぶ。",
        blurred:
            "可用性・監査対応・データ主権のすべてを満たすため、専用のプライベートネットワーク構成を採用。リージョン選定からIAM設計まで、金融機関水準のガバナンスを前提に構築しています。",
    },
    {
        icon: SparklesIcon,
        title: "AIへの取り組み",
        teaser: "自動化ではなく、判断の補助として。",
        blurred:
            "生成AIは意思決定を代替するものではなく、情報の整理と一次案の提示に限定して活用します。学習データの扱い、機密情報の分離についても厳格な方針を定めています。",
    },
];

export default function Atlas() {
    return (
        <>
            <Head title="Atlas" />
            <div className="min-h-screen bg-[#08080a] text-neutral-200 selection:bg-amber-200/20">
                {/* Header */}
                <header className="fixed top-0 inset-x-0 z-30 border-b border-white/5 bg-[#08080a]/80 backdrop-blur">
                    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                        <span className="font-serif text-lg tracking-[0.2em] text-neutral-100">
                            ATLAS
                        </span>
                        <Link
                            href="/room"
                            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-amber-200 transition-colors"
                        >
                            <KeyIcon className="w-4 h-4" />
                            Private Room
                        </Link>
                    </div>
                </header>

                <main className="pt-16">
                    {/* Hero */}
                    <section className="relative overflow-hidden">
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background:
                                    "radial-gradient(60% 50% at 50% 0%, rgba(212,175,110,0.12) 0%, rgba(8,8,10,0) 70%)",
                            }}
                        />
                        <div className="relative max-w-4xl mx-auto px-6 pt-28 pb-24 text-center animate-fadeIn">
                            <p className="text-xs tracking-[0.35em] text-amber-200/70 mb-6">
                                PRIVATE PREVIEW
                            </p>
                            <h1 className="font-serif text-4xl sm:text-5xl leading-tight text-neutral-50 mb-6">
                                限られた方だけに、
                                <br className="hidden sm:block" />
                                次の景色を。
                            </h1>
                            <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
                                これは、資産と情報を守りながら次の意思決定を支えるための、
                                招待制のシステムです。詳細は、Private
                                Roomでのみ公開しています。
                            </p>
                        </div>
                    </section>

                    {/* Concept */}
                    <section className="border-t border-white/5">
                        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                            <p className="text-xs tracking-[0.3em] text-neutral-500 mb-4">
                                CONCEPT
                            </p>
                            <h2 className="font-serif text-2xl sm:text-3xl text-neutral-50 mb-6">
                                富裕層とご家族のための、専用システム。
                            </h2>
                            <p className="text-neutral-400 leading-loose max-w-2xl mx-auto">
                                資産管理、事業承継、日々の意思決定——本来は個別に設計されるべき情報基盤を、
                                汎用の業務システムで済ませてはいないでしょうか。私たちは、一つの家、一つの資産の
                                ためだけに設計された、静かで、確実なシステムを提供します。
                            </p>
                        </div>
                    </section>

                    {/* Pillars */}
                    <section className="border-t border-white/5 bg-white/[0.02]">
                        <div className="max-w-5xl mx-auto px-6 py-20">
                            <p className="text-xs tracking-[0.3em] text-neutral-500 mb-12 text-center">
                                WHAT WE STAND ON
                            </p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {pillars.map(({ icon: Icon, title, teaser, blurred }) => (
                                    <div
                                        key={title}
                                        className="group relative rounded-2xl border border-white/10 bg-[#0d0d10] p-8 overflow-hidden"
                                    >
                                        <Icon className="w-6 h-6 text-amber-200/80 mb-5" />
                                        <h3 className="font-serif text-lg text-neutral-50 mb-2">
                                            {title}
                                        </h3>
                                        <p className="text-sm text-neutral-400 mb-5">
                                            {teaser}
                                        </p>

                                        <p
                                            aria-hidden="true"
                                            className="select-none blur-[5px] text-sm text-neutral-500 leading-relaxed"
                                        >
                                            {blurred}
                                        </p>

                                        <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/50 border border-white/10 px-3 py-1 text-[11px] text-neutral-400">
                                            <LockClosedIcon className="w-3 h-3" />
                                            Private Roomで公開
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Gateway */}
                    <section className="border-t border-white/5">
                        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
                            <p className="text-xs tracking-[0.3em] text-neutral-500 mb-4">
                                ENTRANCE
                            </p>
                            <h2 className="font-serif text-2xl sm:text-3xl text-neutral-50 mb-4">
                                Private Roomへ
                            </h2>
                            <p className="text-neutral-400 leading-relaxed mb-12 max-w-lg mx-auto">
                                デモ、技術構成、ケーススタディ、概算費用、そしてご相談の予約まで。
                                すべての詳細は、ログインと招待コードをお持ちの方限定で公開しています。
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 text-left">
                                <div className="rounded-2xl border border-white/10 p-6">
                                    <KeyIcon className="w-5 h-5 text-amber-200/80 mb-4" />
                                    <h3 className="text-neutral-50 mb-1">
                                        招待コードをお持ちの方
                                    </h3>
                                    <p className="text-sm text-neutral-500 mb-5">
                                        ログインと招待コードでPrivate Roomへ入場できます。
                                    </p>
                                    <Link
                                        href="/room"
                                        className="inline-flex items-center gap-2 text-sm text-amber-200 hover:text-amber-100"
                                    >
                                        ログインする
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </Link>
                                </div>

                                <div className="rounded-2xl border border-white/10 p-6">
                                    <EnvelopeIcon className="w-5 h-5 text-amber-200/80 mb-4" />
                                    <h3 className="text-neutral-50 mb-1">
                                        招待コードをお持ちでない方
                                    </h3>
                                    <p className="text-sm text-neutral-500 mb-5">
                                        利用申請をいただいた上で、審査の上ご案内します。
                                    </p>
                                    <Link
                                        href="/apply"
                                        className="inline-flex items-center gap-2 text-sm text-amber-200 hover:text-amber-100"
                                    >
                                        利用を申請する
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-white/5">
                    <div className="max-w-6xl mx-auto px-6 py-10 text-center text-xs tracking-widest text-neutral-600">
                        EXECUTIVE — PRIVATE PREVIEW
                    </div>
                </footer>
            </div>
        </>
    );
}
