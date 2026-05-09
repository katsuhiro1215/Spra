# Card コンポーネント

再利用可能なカードコンポーネント群です。

## コンポーネント一覧

- **Card**: 基本的なカードコンポーネント
- **CardHeader**: カードのヘッダー部分
- **CardBody**: カードのボディ部分
- **CardFooter**: カードのフッター部分
- **CardTitle**: カード内のタイトル
- **CardWithImage**: 画像付きカード

## インポート

```javascript
import {
    Card,
    CardTitle,
    CardHeader,
    CardBody,
    CardFooter,
    CardWithImage,
} from "@/Components/Card";
```

## 使用例

### 1. シンプルなCard

```jsx
<Card>
    <CardTitle>タイトル</CardTitle>
    <p>コンテンツがここに入ります。</p>
</Card>
```

### 2. バリアント付きCard

```jsx
<Card variant="primary">
  <CardTitle>重要な情報</CardTitle>
  <p>プライマリカラーのカードです。</p>
</Card>

<Card variant="success">
  <CardTitle>成功</CardTitle>
  <p>操作が成功しました。</p>
</Card>

<Card variant="warning">
  <CardTitle>警告</CardTitle>
  <p>注意が必要です。</p>
</Card>

<Card variant="danger">
  <CardTitle>エラー</CardTitle>
  <p>問題が発生しました。</p>
</Card>
```

### 3. ヘッダー・フッター付きCard

```jsx
<Card
    header={<CardTitle>ヘッダータイトル</CardTitle>}
    footer={
        <div className="flex justify-end space-x-2">
            <button className="btn btn-secondary">キャンセル</button>
            <button className="btn btn-primary">保存</button>
        </div>
    }
    variant="bordered"
>
    <p>メインコンテンツ</p>
</Card>
```

### 4. ホバーエフェクト付きCard

```jsx
<Card variant="elevated" hoverable>
    <CardTitle>ホバーしてみてください</CardTitle>
    <p>カードが浮き上がります。</p>
</Card>
```

### 5. アイコン・サブタイトル付きCardTitle

```jsx
import { UserIcon } from "@heroicons/react/24/outline";

<Card>
    <CardTitle
        icon={<UserIcon className="h-6 w-6 text-blue-500" />}
        subtitle="ユーザー情報を管理"
        size="lg"
    >
        ユーザー管理
    </CardTitle>
    <p>ユーザーの詳細情報</p>
</Card>;
```

### 6. カスタム構成のCard

```jsx
<Card variant="elevated" hoverable>
    <CardHeader>
        <CardTitle
            icon={<ChartBarIcon className="h-5 w-5" />}
            subtitle="今月の統計"
        >
            ダッシュボード
        </CardTitle>
    </CardHeader>
    <CardBody>
        <div className="space-y-4">
            <div>総売上: ¥1,234,567</div>
            <div>新規顧客: 42人</div>
        </div>
    </CardBody>
    <CardFooter>
        <Link href="/reports" className="text-blue-600 hover:text-blue-700">
            詳細を見る →
        </Link>
    </CardFooter>
</Card>
```

### 7. 画像付きCard（画像が上部）

```jsx
<CardWithImage
    image="/images/product.jpg"
    imageAlt="商品画像"
    imagePosition="top"
    imageHeight="h-64"
    variant="default"
    hoverable
>
    <CardTitle>商品名</CardTitle>
    <p className="text-gray-600 mt-2">商品の説明がここに入ります。</p>
    <div className="mt-4">
        <span className="text-2xl font-bold text-blue-600">¥9,800</span>
    </div>
</CardWithImage>
```

### 8. 画像付きCard（画像が左側）

```jsx
<CardWithImage
    image="/images/blog-thumb.jpg"
    imageAlt="ブログサムネイル"
    imagePosition="left"
    header={<CardTitle size="md">ブログタイトル</CardTitle>}
    footer={
        <div className="flex items-center justify-between text-sm text-gray-500">
            <span>2026年4月29日</span>
            <Link href="#" className="text-blue-600">
                続きを読む →
            </Link>
        </div>
    }
>
    <p className="text-gray-600">ブログの概要テキストがここに表示されます...</p>
</CardWithImage>
```

### 9. バッジ付き画像Card

```jsx
<CardWithImage
    image="/images/featured.jpg"
    imageAlt="特集記事"
    imageBadge={
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            NEW
        </span>
    }
    hoverable
>
    <CardTitle>特集記事</CardTitle>
    <p>最新の情報をお届けします。</p>
</CardWithImage>
```

## Props

### Card

| Prop      | Type      | Default   | Description                                                                             |
| --------- | --------- | --------- | --------------------------------------------------------------------------------------- |
| variant   | string    | 'default' | カードのスタイル (default, primary, success, warning, danger, info, bordered, elevated) |
| header    | ReactNode | null      | ヘッダーコンテンツ                                                                      |
| children  | ReactNode | -         | メインコンテンツ（必須）                                                                |
| footer    | ReactNode | null      | フッターコンテンツ                                                                      |
| className | string    | ''        | 追加のCSSクラス                                                                         |
| hoverable | boolean   | false     | ホバーエフェクトを有効化                                                                |

### CardTitle

| Prop      | Type      | Default | Description              |
| --------- | --------- | ------- | ------------------------ |
| children  | ReactNode | -       | タイトルテキスト（必須） |
| subtitle  | string    | null    | サブタイトル             |
| icon      | ReactNode | null    | アイコン                 |
| size      | string    | 'md'    | サイズ (sm, md, lg, xl)  |
| className | string    | ''      | 追加のCSSクラス          |

### CardWithImage

| Prop          | Type      | Default   | Description                   |
| ------------- | --------- | --------- | ----------------------------- |
| image         | string    | -         | 画像URL（必須）               |
| imageAlt      | string    | ''        | 画像の代替テキスト            |
| imagePosition | string    | 'top'     | 画像の位置 (top, left, right) |
| imageHeight   | string    | 'h-48'    | 画像の高さ（Tailwind クラス） |
| imageBadge    | ReactNode | null      | 画像上に表示するバッジ        |
| variant       | string    | 'default' | カードのスタイル              |
| header        | ReactNode | null      | ヘッダーコンテンツ            |
| children      | ReactNode | -         | メインコンテンツ（必須）      |
| footer        | ReactNode | null      | フッターコンテンツ            |
| className     | string    | ''        | 追加のCSSクラス               |
| hoverable     | boolean   | false     | ホバーエフェクトを有効化      |

## バリアント

- **default**: 標準スタイル（白背景、グレーボーダー）
- **primary**: プライマリカラー（青の左ボーダー）
- **success**: 成功スタイル（緑の左ボーダー）
- **warning**: 警告スタイル（黄色の左ボーダー）
- **danger**: エラースタイル（赤の左ボーダー）
- **info**: 情報スタイル（シアンの左ボーダー）
- **bordered**: 太いボーダースタイル
- **elevated**: シャドウ強調スタイル（グラデーションヘッダー）

## カラー設定

カードのカラーバリアントは `CommonUIConstants.cardVariants` で管理されています。
新しいバリアントを追加する場合は、`/resources/js/Constants/CommonUIConstants.js` を編集してください。
