import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function UserAuthLayout({ children }) {
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const handleInertiaStart = () => {
            setIsTransitioning(true);
        };

        const handleInertiaFinish = () => {
            setTimeout(() => {
                setIsTransitioning(false);
            }, 200);
        };

        document.addEventListener("inertia:start", handleInertiaStart);
        document.addEventListener("inertia:finish", handleInertiaFinish);

        return () => {
            document.removeEventListener("inertia:start", handleInertiaStart);
            document.removeEventListener("inertia:finish", handleInertiaFinish);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundRepeat: "repeat",
                    }}
                ></div>
            </div>

            {/* Header */}
            <div className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link
                            href="/"
                            className="flex items-center space-x-3 group"
                        >
                            <ApplicationLogo className="h-8 w-8 text-green-600 group-hover:text-green-700 transition-colors duration-200" />
                            <span className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-200">
                                Smart Sprouts
                            </span>
                        </Link>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <Link
                                href="/"
                                className="hover:text-green-600 transition-colors duration-200 font-medium"
                            >
                                ← ホームに戻る
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
                <div
                    className={`w-full max-w-md transition-all duration-300 ${
                        isTransitioning
                            ? "opacity-0 transform translate-y-4 pointer-events-none"
                            : "opacity-100 transform translate-y-0"
                    }`}
                >
                    {/* Auth Card */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                        <div className="px-8 py-10">{children}</div>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-8 text-center">
                        <div className="text-sm text-gray-600 space-x-6">
                            <Link
                                href="/terms"
                                className="hover:text-green-600 transition-colors duration-200"
                            >
                                利用規約
                            </Link>
                            <span className="text-gray-300">•</span>
                            <Link
                                href="/privacy"
                                className="hover:text-green-600 transition-colors duration-200"
                            >
                                プライバシーポリシー
                            </Link>
                            <span className="text-gray-300">•</span>
                            <Link
                                href="/contact"
                                className="hover:text-green-600 transition-colors duration-200"
                            >
                                お問い合わせ
                            </Link>
                        </div>
                        <div className="mt-4 text-xs text-gray-400">
                            © 2024 Smart Sprouts. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-green-200/30 rounded-full blur-xl"></div>
            <div className="absolute top-32 right-16 w-16 h-16 bg-blue-200/30 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-200/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-32 right-10 w-18 h-18 bg-green-200/25 rounded-full blur-xl"></div>
        </div>
    );
}
