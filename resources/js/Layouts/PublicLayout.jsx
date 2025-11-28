import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Header, Footer } from "@/Components/Public";
import LoadingAnimation from "@/Components/Loading/LoadingAnimation";

export default function PublicLayout({ children, auth, showLoading = false }) {
    const [hasShownInitialLoading, setHasShownInitialLoading] = useState(() => {
        try {
            return sessionStorage.getItem("hasShownInitialLoading") === "true";
        } catch {
            return false;
        }
    });

    const [isLoading, setIsLoading] = useState(() => {
        return showLoading && !hasShownInitialLoading;
    });

    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        // 初回訪問時のみローディングアニメーションを表示
        if (showLoading && !hasShownInitialLoading) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [showLoading, hasShownInitialLoading]);

    useEffect(() => {
        // Inertiaのページ遷移イベントをリッスン
        const handleStart = () => {
            setIsTransitioning(true);
        };

        const handleFinish = () => {
            setTimeout(() => setIsTransitioning(false), 100);
        };

        // documentイベントで監視（より安全な方法）
        document.addEventListener("inertia:start", handleStart);
        document.addEventListener("inertia:finish", handleFinish);

        return () => {
            document.removeEventListener("inertia:start", handleStart);
            document.removeEventListener("inertia:finish", handleFinish);
        };
    }, []);

    const handleLoadingComplete = () => {
        setIsLoading(false);
        setHasShownInitialLoading(true);
        try {
            sessionStorage.setItem("hasShownInitialLoading", "true");
        } catch (error) {
            console.warn("SessionStorage is not available:", error);
        }
    };

    return (
        <>
            {isLoading && (
                <LoadingAnimation onComplete={handleLoadingComplete} />
            )}
            <div
                className={`min-h-screen flex flex-col bg-white transition-all duration-300 ease-in-out ${
                    isLoading
                        ? "opacity-0 pointer-events-none"
                        : isTransitioning
                        ? "opacity-95 scale-[0.99]"
                        : "opacity-100 scale-100"
                }`}
                style={{
                    visibility: isLoading ? "hidden" : "visible",
                }}
            >
                <Header auth={auth} />
                <main className="flex-grow pt-16">
                    <div
                        className={`transition-all duration-200 ease-in-out ${
                            isTransitioning
                                ? "opacity-80 translate-y-1"
                                : "opacity-100 translate-y-0"
                        }`}
                    >
                        {children}
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
