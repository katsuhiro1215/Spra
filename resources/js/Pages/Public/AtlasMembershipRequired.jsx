import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const MESSAGES = {
    pending: {
        title: "審査中です",
        body: "会員資格の審査中です。承認され次第、ご案内いたします。今しばらくお待ちください。",
    },
    paused: {
        title: "利用を一時停止しています",
        body: "現在このアカウントでのご利用を一時停止しています。詳細はご担当者へお問い合わせください。",
    },
    revoked: {
        title: "利用が終了しています",
        body: "このアカウントでのご利用は終了しています。詳細はご担当者へお問い合わせください。",
    },
    default: {
        title: "会員資格が確認できません",
        body: "このアカウントにはAtlas会員資格が登録されていません。招待コードをお持ちの場合は新規登録へお進みください。",
    },
};

export default function AtlasMembershipRequired({ status }) {
    const { title, body } = MESSAGES[status] ?? MESSAGES.default;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    return (
        <div className="min-h-screen bg-[#08080a] text-neutral-200 flex items-center justify-center px-6">
            <Head title="Atlas" />

            <div className="text-center max-w-md">
                <p className="text-xs tracking-[0.35em] text-amber-200/70 mb-6">
                    ATLAS
                </p>
                <h1 className="font-serif text-2xl text-neutral-50 mb-4">
                    {title}
                </h1>
                <p className="text-neutral-400 leading-relaxed mb-10">
                    {body}
                </p>
                <div className="flex flex-col items-center gap-3 text-sm">
                    {!status && (
                        <Link
                            href="/register"
                            className="text-amber-200 hover:text-amber-100"
                        >
                            招待コードで新規登録
                        </Link>
                    )}
                    <button
                        onClick={handleLogout}
                        className="text-neutral-500 hover:text-neutral-300"
                    >
                        ログアウト
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-300"
                    >
                        <ArrowLeftIcon className="w-3.5 h-3.5" />
                        Private Previewへ戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}
