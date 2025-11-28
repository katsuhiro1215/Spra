import { Link } from "@inertiajs/react";
import {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";
import {
    FaTwitter,
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaGithub,
    FaYoutube,
} from "react-icons/fa";

export default function Footer({ logoUrl = "/upload/logo.svg" }) {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        services: [
            { name: "Web制作", href: "/service" },
            { name: "システム開発", href: "/service" },
            { name: "アプリ開発", href: "/service" },
            { name: "料金プラン", href: "/plans" },
            { name: "ランディングページ", href: "/lp" },
        ],
        company: [
            { name: "会社概要", href: "/company" },
            { name: "お知らせ", href: "/news" },
            { name: "ブログ", href: "/blog" },
            { name: "採用情報", href: "/careers" },
        ],
        support: [
            { name: "お問い合わせ", href: "/contact" },
            { name: "よくある質問", href: "/faq" },
            { name: "利用規約", href: "/terms" },
            { name: "プライバシーポリシー", href: "/privacy-policy" },
        ],
    };

    const socialLinks = [
        {
            name: "Twitter",
            href: "https://twitter.com/smartsprouts",
            icon: FaTwitter,
            color: "hover:text-blue-400",
        },
        {
            name: "Facebook",
            href: "https://facebook.com/smartsprouts",
            icon: FaFacebook,
            color: "hover:text-blue-600",
        },
        {
            name: "Instagram",
            href: "https://instagram.com/smartsprouts",
            icon: FaInstagram,
            color: "hover:text-pink-600",
        },
        {
            name: "LinkedIn",
            href: "https://linkedin.com/company/smartsprouts",
            icon: FaLinkedin,
            color: "hover:text-blue-700",
        },
        {
            name: "GitHub",
            href: "https://github.com/smartsprouts",
            icon: FaGithub,
            color: "hover:text-gray-900",
        },
        {
            name: "YouTube",
            href: "https://youtube.com/@smartsprouts",
            icon: FaYoutube,
            color: "hover:text-red-600",
        },
    ];

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Logo & Brand */}
                    <div className="lg:col-span-2">
                        <Link
                            href="/"
                            className="flex items-center gap-2 mb-4 group"
                        >
                            <img
                                src={logoUrl}
                                alt="Smart Sprouts"
                                className="h-10 w-auto brightness-0 invert"
                                onError={(e) => {
                                    e.target.src = "/upload/logo.svg";
                                }}
                            />
                            <span className="text-xl font-bold text-white">
                                Smart Sprouts
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                            最新のテクノロジーとクリエイティブな発想で、
                            あなたのビジネスを次のステージへと導きます。
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-sm">
                                <MapPinIcon className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                                <span>
                                    〒100-0001
                                    <br />
                                    東京都千代田区千代田1-1-1
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <PhoneIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                <span>03-1234-5678</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <EnvelopeIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                <a
                                    href="mailto:info@smartsprouts.com"
                                    className="hover:text-white transition-colors"
                                >
                                    info@smartsprouts.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                            サービス
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.services.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm hover:text-white transition-colors inline-block hover:translate-x-1 transform duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                            会社情報
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm hover:text-white transition-colors inline-block hover:translate-x-1 transform duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                            サポート
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm hover:text-white transition-colors inline-block hover:translate-x-1 transform duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Social Links */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                                Follow us:
                            </span>
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-gray-400 ${social.color} transition-all transform hover:scale-110`}
                                        aria-label={social.name}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>

                        {/* Newsletter (Optional) */}
                        <div className="flex items-center gap-2">
                            <input
                                type="email"
                                placeholder="メールアドレス"
                                className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            />
                            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all">
                                購読
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                        <p>
                            © {currentYear} Smart Sprouts. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link
                                href="/sitemap"
                                className="hover:text-white transition-colors"
                            >
                                サイトマップ
                            </Link>
                            <Link
                                href="/terms"
                                className="hover:text-white transition-colors"
                            >
                                利用規約
                            </Link>
                            <Link
                                href="/privacy"
                                className="hover:text-white transition-colors"
                            >
                                プライバシーポリシー
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
