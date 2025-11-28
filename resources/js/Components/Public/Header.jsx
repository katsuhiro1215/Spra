import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
    Bars3Icon,
    XMarkIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";

export default function Header({ auth, logoUrl = "/upload/logo.svg" }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredMenu, setHoveredMenu] = useState(null);

    // スクロール検知
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = [
        {
            name: "サービス",
            href: "/service",
            hasSubmenu: true,
            submenu: {
                title: "私たちのサービス",
                description: "ビジネス成長を支援する包括的なソリューション",
                image: "/upload/menu-service.jpg",
                items: [
                    {
                        name: "Web制作",
                        href: "/service/web-development",
                        description: "レスポンシブWebサイト・アプリ開発",
                    },
                    {
                        name: "システム開発",
                        href: "/service/system-development",
                        description: "業務システム・API開発",
                    },
                    {
                        name: "ECサイト構築",
                        href: "/service/ecommerce",
                        description: "オンラインストア・決済システム",
                    },
                    {
                        name: "AI・DX支援",
                        href: "/service/ai-dx",
                        description: "AI導入・デジタル変革支援",
                    },
                    {
                        name: "ITコンサルティング",
                        href: "/service/consulting",
                        description: "IT戦略・技術アドバイス",
                    },
                    {
                        name: "保守・運用",
                        href: "/service/maintenance",
                        description: "システム保守・運用サポート",
                    },
                    {
                        name: "スタンダードLP",
                        href: "/lp",
                        description: "バランスの取れたランディングページ",
                    },
                    {
                        name: "ミニマルLP",
                        href: "/lp-minimal",
                        description: "シンプルで洗練されたデザイン",
                    },
                    {
                        name: "クリエイティブLP",
                        href: "/lp-creative",
                        description: "インタラクティブで動的なデザイン",
                    },
                ],
            },
        },
        {
            name: "ソリューション",
            href: "/solution",
            hasSubmenu: true,
            submenu: {
                title: "業界別ソリューション",
                description: "様々な業界に特化したソリューション",
                image: "/upload/menu-solution.jpg",
                items: [
                    {
                        name: "製造業向け",
                        href: "/solution/manufacturing",
                        description: "生産管理・品質管理システム",
                    },
                    {
                        name: "小売・EC",
                        href: "/solution/retail",
                        description: "在庫管理・販売管理システム",
                    },
                    {
                        name: "医療・介護",
                        href: "/solution/healthcare",
                        description: "患者管理・電子カルテシステム",
                    },
                    {
                        name: "教育機関",
                        href: "/solution/education",
                        description: "学習管理・出席管理システム",
                    },
                    {
                        name: "金融・保険",
                        href: "/solution/finance",
                        description: "顧客管理・リスク管理システム",
                    },
                    {
                        name: "スタートアップ",
                        href: "/solution/startup",
                        description: "MVP開発・事業成長支援",
                    },
                ],
            },
        },
        {
            name: "ブログ",
            href: "/blog",
            hasSubmenu: false,
        },
        {
            name: "会社情報",
            href: "/company",
            hasSubmenu: true,
            submenu: {
                title: "Smart Sproutsについて",
                description: "私たちの会社情報・サポート",
                image: "/upload/menu-company.jpg",
                items: [
                    {
                        name: "会社概要",
                        href: "/company",
                        description: "企業情報・沿革・アクセス",
                    },
                    {
                        name: "チーム紹介",
                        href: "/about",
                        description: "メンバー・企業理念・文化",
                    },
                    {
                        name: "お知らせ",
                        href: "/news",
                        description: "最新情報・プレスリリース",
                    },
                    {
                        name: "お問い合わせ",
                        href: "/contact",
                        description: "相談・見積もり・サポート",
                    },
                    {
                        name: "よくある質問",
                        href: "/faq",
                        description: "FAQ・サポート情報",
                    },
                    {
                        name: "プライバシーポリシー",
                        href: "/privacy-policy",
                        description: "個人情報保護方針",
                    },
                ],
            },
        },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/95 backdrop-blur-md shadow-md"
                    : "bg-transparent"
            }`}
        >
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 group transition-transform hover:scale-105"
                    >
                        <img
                            src={logoUrl}
                            alt="Smart Sprouts"
                            className="h-8 w-auto"
                            onError={(e) => {
                                e.target.src = "/upload/logo.svg";
                            }}
                        />
                        <span
                            className={`text-lg font-bold transition-colors ${
                                isScrolled
                                    ? "text-gray-900"
                                    : "text-green-500 drop-shadow-md"
                            }`}
                        >
                            Smart Sprouts
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {menuItems.map((item) => (
                            <div
                                key={item.name}
                                className="relative group"
                                onMouseEnter={() =>
                                    item.hasSubmenu && setHoveredMenu(item.name)
                                }
                                onMouseLeave={() => setHoveredMenu(null)}
                            >
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all hover:bg-gray-100/80 ${
                                        isScrolled
                                            ? "text-gray-700 hover:text-gray-900"
                                            : "text-gray-500 hover:bg-white/20"
                                    }`}
                                >
                                    {item.name}
                                    {item.hasSubmenu && (
                                        <ChevronDownIcon className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" />
                                    )}
                                </Link>

                                {/* Dropdown Menu */}
                                {item.hasSubmenu && (
                                    <div
                                        className={`absolute top-full left-0 mt-2 w-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 transform z-50 ${
                                            hoveredMenu === item.name
                                                ? "opacity-100 visible translate-y-0"
                                                : "opacity-0 invisible translate-y-2 pointer-events-none"
                                        }`}
                                    >
                                        <div className="flex">
                                            {/* Left Side - Image */}
                                            <div className="w-1/3 p-6">
                                                <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center">
                                                    <div className="text-4xl opacity-50">
                                                        {item.name ===
                                                            "サービス" && "�️"}
                                                        {item.name ===
                                                            "ソリューション" &&
                                                            "💡"}
                                                        {item.name ===
                                                            "会社情報" && "🏢"}
                                                    </div>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                    {item.submenu.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {item.submenu.description}
                                                </p>
                                            </div>

                                            {/* Right Side - Menu Items */}
                                            <div className="w-2/3 p-6 border-l border-gray-100">
                                                <div className="grid grid-cols-2 gap-1">
                                                    {item.submenu.items.map(
                                                        (subItem) => (
                                                            <Link
                                                                key={
                                                                    subItem.name
                                                                }
                                                                href={
                                                                    subItem.href
                                                                }
                                                                className="group/sub p-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                                            >
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-semibold text-gray-900 group-hover/sub:text-blue-600 transition-colors">
                                                                        {
                                                                            subItem.name
                                                                        }
                                                                    </span>
                                                                    <span className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                                        {
                                                                            subItem.description
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </Link>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* User Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {auth?.user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                                        isScrolled
                                            ? "text-gray-700 hover:bg-gray-100"
                                            : "text-white hover:bg-white/20"
                                    }`}
                                >
                                    <UserCircleIcon className="w-5 h-5" />
                                    {auth.user.name}
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                                        isScrolled
                                            ? "text-gray-700 hover:bg-gray-100"
                                            : "text-white hover:bg-white/20"
                                    }`}
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                    ログアウト
                                </Link>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105 ${
                                    isScrolled
                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                        : "bg-white text-gray-900"
                                }`}
                            >
                                <UserCircleIcon className="w-5 h-5" />
                                ログイン
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${
                            isScrolled
                                ? "text-gray-900 hover:bg-gray-100"
                                : "text-white hover:bg-white/20"
                        }`}
                        aria-label="メニュー"
                    >
                        {isMenuOpen ? (
                            <XMarkIcon className="w-6 h-6" />
                        ) : (
                            <Bars3Icon className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 bg-white rounded-b-2xl shadow-lg">
                        <nav className="flex flex-col space-y-1">
                            {menuItems.map((item) => (
                                <div key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span>{item.name}</span>
                                        {item.hasSubmenu && (
                                            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                                        )}
                                    </Link>

                                    {/* Mobile Submenu Items */}
                                    {item.hasSubmenu && (
                                        <div className="bg-gray-50 border-l-2 border-blue-500 ml-4">
                                            {item.submenu.items.map(
                                                (subItem) => (
                                                    <Link
                                                        key={subItem.name}
                                                        href={subItem.href}
                                                        className="block px-6 py-2 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                                        onClick={() =>
                                                            setIsMenuOpen(false)
                                                        }
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="border-t border-gray-200 my-2"></div>
                            {auth?.user ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <UserCircleIcon className="w-5 h-5" />
                                        {auth.user.name}
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                        ログアウト
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 mx-4 px-5 py-3 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all justify-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <UserCircleIcon className="w-5 h-5" />
                                    ログイン
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
