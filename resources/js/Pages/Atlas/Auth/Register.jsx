import { Head, Link, useForm } from "@inertiajs/react";
import { SparklesIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        password_confirmation: "",
        invite_code: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/register", {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="min-h-screen bg-[#08080a] text-neutral-200 flex items-center justify-center px-6 py-16">
            <Head title="招待コードで登録 | Atlas" />

            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <p className="text-xs tracking-[0.35em] text-amber-200/70 mb-3">
                        ATLAS
                    </p>
                    <h1 className="font-serif text-2xl text-neutral-50">
                        招待コードで登録
                    </h1>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="invite_code"
                            className="block text-xs text-neutral-500 mb-2"
                        >
                            招待コード
                        </label>
                        <input
                            id="invite_code"
                            type="text"
                            value={data.invite_code}
                            onChange={(e) =>
                                setData(
                                    "invite_code",
                                    e.target.value.toUpperCase(),
                                )
                            }
                            className="w-full rounded-lg bg-[#0d0d10] border border-white/10 px-4 py-3 text-sm tracking-[0.2em] text-center text-amber-200 placeholder-neutral-600 focus:outline-none focus:border-amber-200/50"
                            placeholder="XXXXXXXXXX"
                            autoFocus
                        />
                        {errors.invite_code && (
                            <p className="mt-2 text-sm text-red-400">
                                {errors.invite_code}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-xs text-neutral-500 mb-2"
                        >
                            メールアドレス
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full rounded-lg bg-[#0d0d10] border border-white/10 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-200/50"
                            placeholder="you@example.com"
                            autoComplete="username"
                        />
                        {errors.email && (
                            <p className="mt-2 text-sm text-red-400">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-xs text-neutral-500 mb-2"
                        >
                            パスワード
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="w-full rounded-lg bg-[#0d0d10] border border-white/10 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-200/50"
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                        {errors.password && (
                            <p className="mt-2 text-sm text-red-400">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password_confirmation"
                            className="block text-xs text-neutral-500 mb-2"
                        >
                            パスワード（確認）
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData(
                                    "password_confirmation",
                                    e.target.value,
                                )
                            }
                            className="w-full rounded-lg bg-[#0d0d10] border border-white/10 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-200/50"
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-200 text-[#08080a] text-sm font-medium py-3 hover:bg-amber-100 disabled:opacity-50 transition-colors"
                    >
                        <SparklesIcon className="w-4 h-4" />
                        登録する
                    </button>
                </form>

                <div className="mt-8 flex flex-col items-center gap-3 text-sm">
                    <Link
                        href="/login"
                        className="text-amber-200 hover:text-amber-100"
                    >
                        既にアカウントをお持ちの方はログイン
                    </Link>
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
