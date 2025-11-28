import { useState } from "react";
import {
    MagnifyingGlassIcon,
    CalendarIcon,
    FolderIcon,
    TagIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";

// アーカイブWidget
export function ArchiveWidget({ archives }) {
    const monthNames = [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                アーカイブ
            </h3>
            <ul className="space-y-2">
                {archives.map((archive, index) => (
                    <li key={index}>
                        <a
                            href={`/blog?year=${archive.year}&month=${archive.month}`}
                            className="flex items-center justify-between text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <span>
                                {archive.year}年 {monthNames[archive.month - 1]}
                            </span>
                            <span className="text-sm text-gray-400">
                                ({archive.count})
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// カテゴリーWidget
export function CategoryWidget({ categories }) {
    const colorClasses = {
        blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
        green: "bg-green-100 text-green-600 hover:bg-green-200",
        purple: "bg-purple-100 text-purple-600 hover:bg-purple-200",
        pink: "bg-pink-100 text-pink-600 hover:bg-pink-200",
        orange: "bg-orange-100 text-orange-600 hover:bg-orange-200",
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FolderIcon className="w-5 h-5 text-blue-600" />
                カテゴリー
            </h3>
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <a
                        key={category.id}
                        href={`/blog?category=${category.slug}`}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            colorClasses[category.color] || colorClasses.blue
                        }`}
                    >
                        {category.name}
                    </a>
                ))}
            </div>
        </div>
    );
}

// カレンダーWidget
export function CalendarWidget() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        return { firstDay, daysInMonth };
    };

    const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
    const monthNames = [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
    ];
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

    const prevMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
        );
    };

    const nextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                    {currentDate.getFullYear()}年{" "}
                    {monthNames[currentDate.getMonth()]}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {dayNames.map((day) => (
                    <div
                        key={day}
                        className="text-center text-xs font-semibold text-gray-500 py-1"
                    >
                        {day}
                    </div>
                ))}
                {[...Array(firstDay)].map((_, i) => (
                    <div key={`empty-${i}`} className="text-center py-1"></div>
                ))}
                {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const isToday =
                        currentDate.getMonth() === today.getMonth() &&
                        currentDate.getFullYear() === today.getFullYear() &&
                        day === today.getDate();

                    return (
                        <div
                            key={day}
                            className={`text-center text-sm py-1 rounded cursor-pointer hover:bg-blue-50 ${
                                isToday
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "text-gray-700"
                            }`}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// 検索Widget
export function SearchWidget() {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        window.location.href = `/blog?search=${encodeURIComponent(query)}`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-blue-600" />
                検索
            </h3>
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="記事を検索..."
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}

// ロゴWidget
export function LogoWidget() {
    return (
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-md p-8 text-center text-white">
            <div className="text-4xl font-bold mb-2">Smart Sprouts</div>
            <p className="text-blue-100 text-sm">
                革新的なITソリューションで
                <br />
                ビジネスを成長させる
            </p>
        </div>
    );
}

// 最近の記事Widget
export function RecentPostsWidget({ posts, limit = 5 }) {
    const recentPosts = posts.slice(0, limit);

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">最近の記事</h3>
            <ul className="space-y-4">
                {recentPosts.map((post) => (
                    <li key={post.id}>
                        <a
                            href={`/blog/${post.slug}`}
                            className="group block hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                        >
                            <div className="flex gap-3">
                                {post.thumbnail && (
                                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg"></div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                                        {post.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {post.publishedAt}
                                    </p>
                                </div>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// タグクラウドWidget
export function TagCloudWidget({ tags }) {
    const sizes = ["text-xs", "text-sm", "text-base", "text-lg", "text-xl"];
    const colors = [
        "text-blue-600 hover:text-blue-700",
        "text-purple-600 hover:text-purple-700",
        "text-pink-600 hover:text-pink-700",
        "text-green-600 hover:text-green-700",
        "text-orange-600 hover:text-orange-700",
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-blue-600" />
                タグ
            </h3>
            <div className="flex flex-wrap gap-3">
                {tags.map((tag, index) => {
                    const size =
                        sizes[Math.floor(Math.random() * sizes.length)];
                    const color =
                        colors[Math.floor(Math.random() * colors.length)];

                    return (
                        <a
                            key={index}
                            href={`/blog?tag=${encodeURIComponent(tag)}`}
                            className={`${size} ${color} font-medium transition-colors`}
                        >
                            #{tag}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

// ギャラリーWidget
export function GalleryWidget({ images }) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">ギャラリー</h3>
            <div className="grid grid-cols-3 gap-2">
                {images.map((image) => (
                    <a
                        key={image.id}
                        href={image.url}
                        className="aspect-square bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                        title={image.title}
                    >
                        {/* 実際の画像がある場合は img タグを使用 */}
                        {/* <img src={image.url} alt={image.alt} className="w-full h-full object-cover" /> */}
                    </a>
                ))}
            </div>
        </div>
    );
}

// サイドバーコンテナ
export function BlogSidebar({ widgets = [] }) {
    const widgetComponents = {
        archive: ArchiveWidget,
        category: CategoryWidget,
        calendar: CalendarWidget,
        search: SearchWidget,
        logo: LogoWidget,
        recentPosts: RecentPostsWidget,
        tagCloud: TagCloudWidget,
        gallery: GalleryWidget,
    };

    return (
        <aside className="space-y-6">
            {widgets.map((widget, index) => {
                const WidgetComponent = widgetComponents[widget.type];
                if (!WidgetComponent) return null;

                return <WidgetComponent key={index} {...widget.props} />;
            })}
        </aside>
    );
}
