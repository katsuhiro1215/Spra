# Components 構造ガイド

## 新しいディレクトリ構造

```
Components/
├── Alerts/          # アラート・確認ダイアログ
├── Buttons/         # ボタンコンポーネント
├── Forms/           # フォーム関連
├── Layout/          # レイアウト・UI要素
├── Navigation/      # ナビゲーション
├── Notifications/   # 通知・フラッシュメッセージ
├── ApplicationLogo.jsx
└── index.js         # メインエクスポート
```

## 詳細な構造

### 📁 Alerts/

-   `BaseAlert.jsx` - アラートベースコンポーネント
-   `DeleteAlert.jsx` - 削除確認アラート
-   `ConfirmAlert.jsx` - 汎用確認アラート
-   `SuccessAlert.jsx` - 成功通知アラート
-   `ContractConfirmAlert.jsx` - 契約確定アラート
-   `ServicePublishAlert.jsx` - サービス公開確認アラート

### 📁 Buttons/

-   `BasicButton.jsx` - 基本ボタン
-   `PrimaryButton.jsx` - プライマリボタン
-   `SecondaryButton.jsx` - セカンダリボタン
-   `DangerButton.jsx` - 危険アクションボタン
-   `CrudButtons.jsx` - CRUD 操作ボタン群

### 📁 Forms/

-   `TextInput.jsx` - テキスト入力
-   `InputLabel.jsx` - ラベル
-   `InputError.jsx` - エラー表示
-   `Checkbox.jsx` - チェックボックス
-   `ValidatedInput.jsx` - バリデーション付き入力
-   `ValidatedTextArea.jsx` - バリデーション付きテキストエリア
-   `RichTextEditor.jsx` - リッチテキストエディタ

### 📁 Layout/

-   `PageHeader.jsx` - ページヘッダー
-   `Pagination.jsx` - ページネーション
-   `SearchFilter.jsx` - 検索フィルタ
-   `Dropdown.jsx` - ドロップダウン
-   `Modal.jsx` - モーダル

### 📁 Navigation/

-   `NavLink.jsx` - ナビゲーションリンク
-   `ResponsiveNavLink.jsx` - レスポンシブナビゲーションリンク

### 📁 Notifications/

-   `FlashMessage.jsx` - フラッシュメッセージ

## 使用方法

### 基本的なインポート（推奨）

```jsx
// メインのindex.jsから全てインポート可能
import {
    PrimaryButton,
    ValidatedInput,
    DeleteAlert,
    PageHeader,
    FlashMessage,
} from "@/Components";
```

### カテゴリ別インポート

```jsx
// 特定のカテゴリからまとめてインポート
import {
    PrimaryButton,
    DangerButton,
    CreateButton,
} from "@/Components/Buttons";

import { DeleteAlert, ConfirmAlert, SuccessAlert } from "@/Components/Alerts";

import { ValidatedInput, TextInput, Checkbox } from "@/Components/Forms";
```

### 個別インポート

```jsx
// 必要なコンポーネントのみ直接インポート
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import DeleteAlert from "@/Components/Alerts/DeleteAlert";
import ValidatedInput from "@/Components/Forms/ValidatedInput";
```

## 新しいコンポーネントの追加方法

### 1. 適切なカテゴリを選択

新しいコンポーネントの機能に応じて適切なディレクトリを選択

### 2. コンポーネントファイルを作成

該当ディレクトリにコンポーネントファイルを追加

### 3. カテゴリの index.js を更新

そのカテゴリの`index.js`にエクスポートを追加

```jsx
// 例: 新しいボタンコンポーネントを追加
// Components/Buttons/WarningButton.jsx を作成後

// Components/Buttons/index.js に追加
export { default as WarningButton } from "./WarningButton";
```

### 4. メインの index.js は自動で更新

`export * from './Buttons';` により、新しいコンポーネントも自動的にメインからエクスポートされます

## 互換性

既存のインポートは引き続き動作します：

```jsx
// 以前のインポート方法も継続して使用可能
import { PrimaryButton, ValidatedInput } from "@/Components";
```

## ベストプラクティス

1. **メインからインポート**: 通常は`@/Components`からインポート
2. **カテゴリ別インポート**: 特定の機能群を多用する場合
3. **個別インポート**: バンドルサイズを最適化したい場合
4. **新規追加時**: 適切なカテゴリに配置し、index.js を更新
