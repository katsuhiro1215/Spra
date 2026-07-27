import { Head, Link, useForm } from "@inertiajs/react";
import { KeyIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post("/login", {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="min-h-screen bg-[#08080a] text-neutral-200 flex items-center justify-center px-6">
            <Head title="ログイン | Atlas" />

            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <p className="text-xs tracking-[0.35em] text-amber-200/70 mb-3">
                        ATLAS
                    </p>
                    <h1 className="font-serif text-2xl text-neutral-50">
                        Private Roomへ
                    </h1>
                </div>

                {status && (
                    <div className="mb-6 rounded-lg border border-amber-200/20 bg-amber-200/5 px-4 py-3 text-sm text-amber-200">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
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
                            autoFocus
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
                            autoComplete="current-password"
                        />
                        {errors.password && (
                            <p className="mt-2 text-sm text-red-400">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <label className="flex items-center gap-2 text-sm text-neutral-500">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                            className="rounded border-white/20 bg-[#0d0d10] text-amber-200 focus:ring-amber-200/50"
                        />
                        ログイン状態を保持
                    </label>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-200 text-[#08080a] text-sm font-medium py-3 hover:bg-amber-100 disabled:opacity-50 transition-colors"
                    >
                        <KeyIcon className="w-4 h-4" />
                        ログイン
                    </button>
                </form>

                <div className="mt-8 flex flex-col items-center gap-3 text-sm">
                    <Link
                        href="/register"
                        className="text-amber-200 hover:text-amber-100"
                    >
                        はじめての方（招待コードで登録）
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
