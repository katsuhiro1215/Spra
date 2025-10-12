# コンポーネント設計ガイドライン

## 📋 概要

このドキュメントは、フォームコンポーネントの設計方針と使い分けについて説明します。

## 🎯 コンポーネント分類

### 1. **原子レベル（Atomic）コンポーネント**

-   `TextInput.jsx` - 基本的な input 要素
-   `InputLabel.jsx` - ラベル要素
-   `InputError.jsx` - エラー表示要素
-   `TextArea.jsx` - 基本的な textarea 要素

**特徴:**

-   単一責任
-   高い再利用性
-   最小限の機能

### 2. **分子レベル（Molecular）コンポーネント**

-   `ValidatedInput.jsx` - バリデーション統合型 input
-   `ValidatedTextArea.jsx` - バリデーション統合型 textarea

**特徴:**

-   複数の原子コンポーネントを組み合わせ
-   バリデーション機能統合
-   onBlur 対応

## 🔧 使い分け指針

### **原子レベル使用場面**

```jsx
// ✅ 推奨: 認証画面、シンプルなフォーム
<InputLabel htmlFor="email" value="Email" />
<TextInput
    id="email"
    value={data.email}
    onChange={(e) => setData('email', e.target.value)}
/>
<InputError message={errors.email} />
```

**理由:**

-   Laravel Breeze 標準パターン
-   シンプルで理解しやすい
-   認証は既存の安定したパターンを維持

### **分子レベル使用場面**

```jsx
// ✅ 推奨: 管理画面、複雑なフォーム
<ValidatedInput
    name="email"
    label="Email"
    value={data.email}
    onChange={(e) => setData("email", e.target.value)}
    onBlur={(e) => handleFieldBlur("email", e.target.value, rules)}
    error={validationErrors.email}
    required
/>
```

**理由:**

-   バリデーション機能内蔵
-   開発効率向上
-   一貫した UX

## 📈 段階的移行戦略

### **Phase 1: 共存期（現在）**

-   **認証系**: 原子レベル継続使用
-   **管理画面**: 分子レベル新規採用
-   **新規開発**: 分子レベル優先

### **Phase 2: 統一期（6 ヶ月後）**

-   **管理画面**: 全て分子レベルに統一
-   **認証系**: 必要に応じて段階的移行検討

### **Phase 3: 最適化期（1 年後）**

-   **全システム**: 使用頻度に基づいて最適化
-   **パフォーマンス**: バンドルサイズ最適化

## ✅ 推奨方針

### **ValidatedInput 系を推奨する理由**

1. **開発効率**: 1 つのコンポーネントで完結
2. **保守性**: バリデーションロジック集約
3. **一貫性**: エラー表示の統一
4. **UX 向上**: onBlur バリデーション

### **原子レベルを残す理由**

1. **柔軟性**: 特殊なレイアウト対応
2. **パフォーマンス**: 軽量な場面での使用
3. **互換性**: 既存コードとの整合性
4. **学習コスト**: Laravel 開発者の慣れ親しんだパターン

## 🎨 将来的な理想形

```jsx
// 目指すべき理想的なフォーム
const MyForm = () => {
    const { validate, errors } = useFormValidation(validationRules);

    return (
        <form>
            <ValidatedInput
                name="name"
                label="名前"
                value={data.name}
                onChange={handleChange}
                validation={validate}
                error={errors.name}
                required
            />

            <ValidatedTextArea
                name="description"
                label="説明"
                value={data.description}
                onChange={handleChange}
                validation={validate}
                error={errors.description}
            />
        </form>
    );
};
```

## 📊 判断基準

| 要因               | 原子レベル | 分子レベル |
| ------------------ | ---------- | ---------- |
| **開発速度**       | 遅い       | 速い       |
| **カスタマイズ性** | 高い       | 中程度     |
| **保守性**         | 低い       | 高い       |
| **学習コスト**     | 低い       | 中程度     |
| **バンドルサイズ** | 小さい     | 大きい     |
| **型安全性**       | 手動管理   | 自動管理   |

## 🎯 結論

**段階的に ValidatedInput 系への移行を推奨**しますが、**既存の原子レベルコンポーネントも価値がある**ため、用途に応じた使い分けを継続します。

重要なのは一貫したコーディング規約と、チーム全体での合意形成です。
