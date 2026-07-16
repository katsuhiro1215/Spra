import { useState, useEffect, useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Bars3Icon,
    XMarkIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";

const resolveHref = (item) => {
    if (item.url) return item.url;
    if (item.page?.slug) return `/${item.page.slug}`;
    return "#";
};

function MegaMenuIcon({ image, letter }) {
    const [hasError, setHasError] = useState(false);

    if (image && !hasError) {
        return (
            <img
                src={image}
                alt=""
                className="w-full h-32 object-cover rounded-xl mb-4"
                onError={() => setHasError(true)}
            />
        );
    }

    return (
        <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center">
            <div className="text-4xl font-bold text-blue-300">{letter}</div>
        </div>
    );
}

const buildMenuItems = (headerMenu) => {
    const topLevelItems = headerMenu?.menu_items ?? [];

    return topLevelItems.map((item) => {
        const children = item.children ?? [];
        const hasSubmenu = children.length > 0;

        return {
            name: item.label,
            href: resolveHref(item),
            hasSubmenu,
            submenu: hasSubmenu
                ? {
                      title: item.label,
                      description: item.description,
                      image: item.image_path,
                      items: children.map((child) => ({
                          name: child.label,
                          href: resolveHref(child),
                          description: child.description,
                      })),
                  }
                : null,
        };
    });
};

const DEFAULT_LOGO_URL = "/upload/logo.svg";
const DEFAULT_SITE_NAME = "Smart Sprouts";

export default function Header({ auth }) {
    const { props } = usePage();
    const organization = props.organization;
    const logoUrl = organization?.logo_path || DEFAULT_LOGO_URL;
    const siteName =
        organization?.site_name || organization?.name || DEFAULT_SITE_NAME;
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

    const menuItems = useMemo(
        () => buildMenuItems(props.headerMenu),
        [props.headerMenu],
    );

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
                            alt={siteName}
                            className="h-8 w-auto"
                            onError={(e) => {
                                e.target.src = DEFAULT_LOGO_URL;
                            }}
                        />
                        <span
                            className={`text-lg font-bold transition-colors ${
                                isScrolled
                                    ? "text-gray-900"
                                    : "text-green-500 drop-shadow-md"
                            }`}
                        >
                            {siteName}
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
                                                <MegaMenuIcon
                                                    image={item.submenu.image}
                                                    letter={item.name.charAt(
                                                        0,
                                                    )}
                                                />
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
