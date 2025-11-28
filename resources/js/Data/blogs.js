// Blog記事のサンプルデータ
export const categories = [
    { id: 1, name: "技術", slug: "tech", color: "blue" },
    { id: 2, name: "ビジネス", slug: "business", color: "green" },
    { id: 3, name: "デザイン", slug: "design", color: "purple" },
    { id: 4, name: "マーケティング", slug: "marketing", color: "pink" },
    { id: 5, name: "開発事例", slug: "case-study", color: "orange" },
];

export const tags = [
    "React",
    "Laravel",
    "JavaScript",
    "TypeScript",
    "UI/UX",
    "SEO",
    "AWS",
    "Docker",
    "AI",
    "Machine Learning",
    "Web開発",
    "アプリ開発",
    "DX",
    "クラウド",
    "セキュリティ",
];

export const blogs = [
    {
        id: 1,
        title: "React 18の新機能を徹底解説",
        slug: "react-18-features",
        excerpt:
            "React 18で導入された新機能について、実際のコード例を交えながら詳しく解説します。Concurrent Rendering、Automatic Batching、Suspenseの改善など。",
        content: `
# React 18の新機能を徹底解説

React 18では、多くの新機能と改善が導入されました。この記事では、主要な新機能について詳しく解説していきます。

## Concurrent Rendering

Concurrent Renderingは、React 18の最も重要な新機能の一つです。これにより、Reactはレンダリング作業を中断し、より重要な更新を優先することができます。

\`\`\`javascript
import { startTransition } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    
    startTransition(() => {
      // この更新は優先度が低い
      setResults(filterResults(e.target.value));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      <ResultsList results={results} />
    </div>
  );
}
\`\`\`

## Automatic Batching

React 18では、自動バッチングが改善され、Promise、setTimeout、ネイティブイベントハンドラー内でも複数の状態更新がバッチ処理されるようになりました。

## Suspenseの改善

SuspenseがSSRでも利用できるようになり、より柔軟なローディング状態の管理が可能になりました。

これらの新機能により、よりパフォーマンスの高いアプリケーションを構築できるようになりました。
        `,
        category: categories[0],
        tags: ["React", "JavaScript", "Web開発"],
        author: {
            name: "山田 太郎",
            avatar: "👨‍💻",
            bio: "フロントエンドエンジニア",
        },
        publishedAt: "2024-11-15",
        thumbnail: "/images/blog/react-18.jpg",
        views: 1234,
        featured: true,
    },
    {
        id: 2,
        title: "DX推進のための5つのステップ",
        slug: "dx-five-steps",
        excerpt:
            "デジタルトランスフォーメーション(DX)を成功させるための具体的なステップと、実際の導入事例を紹介します。",
        content: `
# DX推進のための5つのステップ

デジタルトランスフォーメーション(DX)は、現代のビジネスにおいて避けて通れない課題となっています。

## 1. 現状分析

まず、自社の現状を正確に把握することが重要です。

## 2. ビジョンの策定

DXによって実現したい姿を明確にします。

## 3. ロードマップの作成

段階的な実行計画を立てます。

## 4. 技術の選定

適切なツールとプラットフォームを選びます。

## 5. 組織変革

社内の意識改革と体制づくりを進めます。
        `,
        category: categories[1],
        tags: ["DX", "ビジネス"],
        author: {
            name: "佐藤 花子",
            avatar: "👩‍💼",
            bio: "ITコンサルタント",
        },
        publishedAt: "2024-11-10",
        thumbnail: "/images/blog/dx.jpg",
        views: 987,
        featured: true,
    },
    {
        id: 3,
        title: "UI/UXデザインのベストプラクティス2024",
        slug: "ui-ux-best-practices-2024",
        excerpt:
            "2024年のUI/UXデザインのトレンドとベストプラクティスを紹介。ユーザー体験を向上させるための実践的なテクニック。",
        content: `
# UI/UXデザインのベストプラクティス2024

優れたUI/UXデザインは、ユーザーエンゲージメントを高め、ビジネスの成功に直結します。

## モバイルファースト

スマートフォンでの利用を最優先に設計します。

## アクセシビリティ

すべてのユーザーが利用できるデザインを心がけます。

## マイクロインタラクション

細部までこだわったアニメーションで、ユーザー体験を向上させます。
        `,
        category: categories[2],
        tags: ["UI/UX", "デザイン", "Web開発"],
        author: {
            name: "田中 次郎",
            avatar: "🎨",
            bio: "UIデザイナー",
        },
        publishedAt: "2024-11-05",
        thumbnail: "/images/blog/uiux.jpg",
        views: 756,
        featured: false,
    },
    {
        id: 4,
        title: "Laravel 11で構築する高速Webアプリケーション",
        slug: "laravel-11-high-performance",
        excerpt:
            "Laravel 11の新機能を活用して、高速で拡張性の高いWebアプリケーションを構築する方法を解説します。",
        content: `
# Laravel 11で構築する高速Webアプリケーション

Laravel 11では、パフォーマンスと開発者体験の両面で大きな改善が行われました。

## 新しいディレクトリ構造

より直感的で管理しやすい構造になりました。

## パフォーマンスの最適化

クエリの最適化とキャッシュ戦略について解説します。
        `,
        category: categories[0],
        tags: ["Laravel", "PHP", "Web開発"],
        author: {
            name: "山田 太郎",
            avatar: "👨‍💻",
            bio: "フロントエンドエンジニア",
        },
        publishedAt: "2024-10-28",
        thumbnail: "/images/blog/laravel.jpg",
        views: 543,
        featured: false,
    },
    {
        id: 5,
        title: "SEO対策の基礎から応用まで",
        slug: "seo-complete-guide",
        excerpt:
            "検索エンジン最適化(SEO)の基礎知識から、最新のテクニックまでを網羅的に解説します。",
        content: `
# SEO対策の基礎から応用まで

SEOは、Webサイトの成功に欠かせない要素です。

## テクニカルSEO

サイトの技術的な最適化について。

## コンテンツSEO

質の高いコンテンツの作成方法。

## リンクビルディング

効果的なバックリンク獲得戦略。
        `,
        category: categories[3],
        tags: ["SEO", "マーケティング", "Web開発"],
        author: {
            name: "佐藤 花子",
            avatar: "👩‍💼",
            bio: "ITコンサルタント",
        },
        publishedAt: "2024-10-20",
        thumbnail: "/images/blog/seo.jpg",
        views: 891,
        featured: true,
    },
    {
        id: 6,
        title: "ECサイト構築の成功事例",
        slug: "ec-site-case-study",
        excerpt: "実際に構築したECサイトの事例を紹介。売上を3倍にした施策とは?",
        content: `
# ECサイト構築の成功事例

クライアントのECサイトを構築し、売上を3倍に伸ばした事例を紹介します。

## 課題

既存サイトのコンバージョン率が低かった。

## 解決策

ユーザー体験の改善とマーケティング施策の最適化。

## 結果

3ヶ月で売上が3倍に増加しました。
        `,
        category: categories[4],
        tags: ["開発事例", "EC", "Web開発"],
        author: {
            name: "田中 次郎",
            avatar: "🎨",
            bio: "UIデザイナー",
        },
        publishedAt: "2024-10-15",
        thumbnail: "/images/blog/ec.jpg",
        views: 1100,
        featured: false,
    },
];

// アーカイブデータ(年月ごとの記事数)
export const archives = [
    { year: 2024, month: 11, count: 3 },
    { year: 2024, month: 10, count: 3 },
    { year: 2024, month: 9, count: 2 },
    { year: 2024, month: 8, count: 4 },
    { year: 2024, month: 7, count: 5 },
];

// ギャラリー画像
export const galleryImages = [
    {
        id: 1,
        url: "/images/gallery/project1.jpg",
        title: "Webサイトリニューアル",
        alt: "プロジェクト1",
    },
    {
        id: 2,
        url: "/images/gallery/project2.jpg",
        title: "アプリ開発",
        alt: "プロジェクト2",
    },
    {
        id: 3,
        url: "/images/gallery/project3.jpg",
        title: "ECサイト構築",
        alt: "プロジェクト3",
    },
    {
        id: 4,
        url: "/images/gallery/project4.jpg",
        title: "システム開発",
        alt: "プロジェクト4",
    },
    {
        id: 5,
        url: "/images/gallery/project5.jpg",
        title: "AIソリューション",
        alt: "プロジェクト5",
    },
    {
        id: 6,
        url: "/images/gallery/project6.jpg",
        title: "コンサルティング",
        alt: "プロジェクト6",
    },
];
