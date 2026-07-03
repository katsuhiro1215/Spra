import { Link } from "@inertiajs/react";

export default function UserFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* コピーライト */}
                    <div className="text-sm text-gray-600">
                        © {currentYear}{" "}
                        <Link href="/" className="hover:text-indigo-600">
                            {typeof window !== "undefined"
                                ? document.querySelector("[data-app-name]")
                                      ?.dataset.appName || "Spra"
                                : "Spra"}
                        </Link>
                        . All rights reserved.
                    </div>

                    {/* リンク */}
                    <div className="flex items-center gap-6 text-sm">
                        {/* <Link
                            href={route("contact.index")}
                            className="text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            ヘルプ
                        </Link>

                        <Link
                            href={route("contact.create")}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            Adminへお問い合わせ
                        </Link> */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
