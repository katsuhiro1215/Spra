# Button コンポーネント リファクタリング完了

## 📋 概要

Buttonコンポーネントを統一し、以下の改善を実施しました：

1. ✅ **BaseButton強化** - アイコン機能、カラーテーマ対応、variantシステム拡張
2. ✅ **新しいコンポーネント** - Button、IconButton、CrudButton追加
3. ✅ **カラーテーマ対応** - AdminHeaderのカラーテーマをボタンに適用可能
4. ✅ **リンク対応** - すべてのボタンで`href`プロパティによるリンク化をサポート
5. ✅ **後方互換性** - 既存のPrimaryButton、SecondaryButton等は引き続き使用可能

---

## 🎨 新しいButtonコンポーネントの使い方

### 1. Button（汎用ボタン）

基本的なボタンコンポーネント。すべての用途に対応。

```jsx
import { Button } from "@/Components/Buttons";

// 基本的な使い方
<Button variant="primary">保存</Button>

// カラーテーマ適用（AdminHeaderのカラー設定を使用）
<Button variant="primary" useTheme>保存</Button>

// アイコン付き
<Button variant="secondary" icon={PlusIcon}>
  新規作成
</Button>

// リンクボタン
<Button variant="primary" href={route('admin.users')}>
  ユーザー一覧
</Button>

// ローディング状態
<Button variant="primary" loading={processing}>
  保存中...
</Button>

// サイズ指定
<Button variant="primary" size="sm">小さいボタン</Button>
<Button variant="primary" size="lg">大きいボタン</Button>
```

**利用可能なvariant:**

- `primary` - プライマリボタン（青）
- `secondary` - セカンダリボタン（グレー枠）
- `danger` - 危険な操作（赤）
- `success` - 成功/作成（緑）
- `warning` - 警告（黄）
- `info` - 情報（シアン）
- `text` - テキストのみ（背景なし）

---

### 2. CrudButton（CRUD操作用）

CRUD操作に特化した簡略化ボタン。アイコンとラベルが自動設定されます。

**⚠️ 重要: `action`プロパティでCRUD操作タイプを指定**

- CRUDタイプは`action`プロパティで指定（~~`type`~~ではありません）
- `type`プロパティはHTML button要素の`type`属性（submit/button/reset）として機能

```jsx
import { CrudButton } from "@/Components/Buttons";

// 新規作成ボタン（緑、+アイコン）
<CrudButton action="create" href={route('admin.users.create')} />

// 保存ボタン（青、保存アイコン）- フォーム送信用
<CrudButton action="store" type="submit" loading={processing} />

// 編集ボタン（黄、鉛筆アイコン）
<CrudButton action="edit" href={route('admin.users.edit', user.id)} />

// 削除ボタン（赤、ゴミ箱アイコン）
<CrudButton action="delete" onClick={() => handleDelete(user.id)} />

// カスタムラベル
<CrudButton action="create" useTheme>
  管理者を新規作成
</CrudButton>
```

**利用可能なaction:**

- `create` - 新規作成（緑）
- `store` - 保存（青）
- `show` - 詳細表示（シアン）
- `edit` - 編集（黄）
- `update` - 更新（青）
- `delete` - 削除（赤）

---

### 3. IconButton（アイコン専用）

アイコンのみのボタン。テキストなし。

```jsx
import { IconButton } from "@/Components/Buttons";
import { PencilIcon } from "@heroicons/react/24/outline";

// 基本的な使い方
<IconButton icon={PencilIcon} />

// カラー指定
<IconButton icon={PencilIcon} variant="primary" />
<IconButton icon={TrashIcon} variant="danger" />

// リンクとして
<IconButton icon={PencilIcon} href={route('admin.users.edit', user.id)} />
```

---

## 🎨 カラーテーマの使用

AdminHeaderでカラーテーマ（Indigo、Blue、Purple、Pink、Green）を設定した場合、
ボタンに`useTheme`を指定することでテーマカラーが適用されます。

```jsx
// カラーテーマを使用
<Button variant="primary" useTheme>保存</Button>
<CrudButton action="create" useTheme />

// 使用しない場合は固定色（Indigo）
<Button variant="primary">保存</Button>
```

---

## 📦 既存コンポーネントとの互換性

既存のButtonコンポーネントは引き続き使用可能です（内部的にBaseButtonを利用するように更新済み）。

### 旧コンポーネント

```jsx
import { PrimaryButton, SecondaryButton, DangerButton } from "@/Components/Buttons";

// 引き続き使用可能
<PrimaryButton>保存</PrimaryButton>
<SecondaryButton>キャンセル</SecondaryButton>
<DangerButton>削除</DangerButton>
```

### 旧CrudButtons

```jsx
import { CreateButton, StoreButton, EditButton } from "@/Components/Buttons";

// 引き続き使用可能（BasicButtonベース、リンク非対応）
<CreateButton>新規作成</CreateButton>
<StoreButton loading={processing}>保存</StoreButton>
```

---

## 🔄 移行ガイド

### 置き換え例

#### Before（旧）

```jsx
import { CreateButton, SecondaryButton } from "@/Components/Buttons";

<CreateButton href={route('admin.users.create')}>
  <PlusIcon className="h-4 w-4 mr-2" />
  新規作成
</CreateButton>

<SecondaryButton onClick={handleCancel}>
  <XMarkIcon className="h-4 w-4 mr-2" />
  キャンセル
</SecondaryButton>
```

#### After（新）

```jsx
import { Button, CrudButton } from "@/Components/Buttons";

<CrudButton
  action="create"
  useTheme
  href={route('admin.users.create')}
>
  新規作成
</CrudButton>

<Button
  variant="secondary"
  icon={XMarkIcon}
  onClick={handleCancel}
>
  キャンセル
</Button>
```

---

## ✅ 適用済み箇所

- ✅ Admin/Admin/Index.jsx - 新しいButtonとCrudButtonに移行済み
- ✅ tailwind.config.js - カラーテーマ定義追加済み
- ✅ Components/Buttons/ - 新コンポーネント追加済み

---

## 📝 今後の段階的移行

以下のパターンで段階的に既存箇所を移行してください：

1. **新規実装** - 新しくページを作る際は`Button`と`CrudButton`を使用
2. **既存修正時** - 既存ページを編集する際に気づいた箇所を移行
3. **完全移行** - すべての箇所を移行したら旧CrudButtons.jsxを削除可能

---

## 🎯 推奨パターン

### ページヘッダーのアクション

```jsx
const headerActions = [
    {
        label: "新規作成",
        icon: PlusIcon,
        variant: "primary", // useThemeはPageHeaderで自動適用
        route: route("admin.users.create"),
    },
];
```

### フォームボタン

```jsx
<div className="flex justify-end gap-3">
    <Button variant="secondary" href={route("admin.users.index")}>
        キャンセル
    </Button>

    <CrudButton action="store" type="submit" useTheme loading={processing}>
        保存
    </CrudButton>
</div>
```

### テーブルアクションボタン

```jsx
<div className="flex gap-2">
    <IconButton
        icon={PencilIcon}
        variant="warning"
        href={route("admin.users.edit", user.id)}
    />

    <IconButton
        icon={TrashIcon}
        variant="danger"
        onClick={() => handleDelete(user.id)}
    />
</div>
```

---

## 🚀 次のステップ

1. 他のページを編集する際に、徐々にButtonコンポーネントを新しいものに置き換える
2. 特にCRUD操作のボタンは`CrudButton`で統一すると保守性が向上
3. カラーテーマを活用する場合は`useTheme`を積極的に使用

---

2026-07-14 実装完了
