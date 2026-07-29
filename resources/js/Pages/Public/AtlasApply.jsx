import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PublicFlashMessage } from "@/Components/Notifications";

export default function AtlasApply() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("atlas.apply.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="利用申込み" />
            <PublicFlashMessage />
            <div className="min-h-screen bg-[#08080a] text-neutral-200 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md">
                    <p className="text-xs tracking-[0.35em] text-amber-200/70 mb-6 text-center">
                        ATLAS
                    </p>
                    <h1 className="font-serif text-2xl text-neutral-50 mb-4 text-center">
                        利用申込み
                    </h1>
                    <p className="text-neutral-400 leading-relaxed mb-10 text-center text-sm">
                        Atlasのご利用をご希望の方は、以下のフォームより
                        お申込みください。担当者よりご連絡いたします。
                    </p>

                    {flash?.success ? (
                        <p className="text-center text-amber-200 text-sm">
                            {flash.success}
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs tracking-widest text-neutral-500 mb-2">
                                    お名前
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full bg-transparent border-b border-neutral-700 focus:border-amber-200/70 outline-none py-2 text-neutral-100"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-400">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs tracking-widest text-neutral-500 mb-2">
                                    メールアドレス
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full bg-transparent border-b border-neutral-700 focus:border-amber-200/70 outline-none py-2 text-neutral-100"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-400">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs tracking-widest text-neutral-500 mb-2">
                                    電話番号（任意）
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    className="w-full bg-transparent border-b border-neutral-700 focus:border-amber-200/70 outline-none py-2 text-neutral-100"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-xs text-red-400">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs tracking-widest text-neutral-500 mb-2">
                                    ご紹介・ご要望（任意）
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.message}
                                    onChange={(e) =>
                                        setData("message", e.target.value)
                                    }
                                    className="w-full bg-transparent border-b border-neutral-700 focus:border-amber-200/70 outline-none py-2 text-neutral-100 resize-none"
                                />
                                {errors.message && (
                                    <p className="mt-1 text-xs text-red-400">
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full mt-4 py-3 text-sm tracking-widest text-neutral-950 bg-amber-200 hover:bg-amber-100 transition-colors disabled:opacity-50"
                            >
                                申し込む
                            </button>
                        </form>
                    )}

                    <div className="mt-10 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-amber-200 hover:text-amber-100"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Private Previewへ戻る
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
