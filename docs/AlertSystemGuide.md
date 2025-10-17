# アラートシステム使用ガイド

## 概要

汎用的なアラートシステムを作成しました。目的に応じて適切なコンポーネントを選択できます。

## コンポーネント構成

### BaseAlert

すべてのアラートの基盤となる汎用コンポーネント

### 専用アラートコンポーネント

-   **DeleteAlert** - 削除確認
-   **ContractConfirmAlert** - 契約確定確認
-   **ServicePublishAlert** - サービス公開確認
-   **SuccessAlert** - 成功通知
-   **ConfirmAlert** - 汎用確認

## 使用例

### 1. 削除確認アラート

```jsx
import { DeleteAlert } from "@/Components";

const ExampleComponent = () => {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const handleDelete = () => {
        // 削除処理
        console.log("削除実行");
    };

    return (
        <>
            <button onClick={() => setShowDeleteAlert(true)}>削除</button>

            <DeleteAlert
                isOpen={showDeleteAlert}
                onClose={() => setShowDeleteAlert(false)}
                onConfirm={handleDelete}
                itemName="ユーザー データ"
                // または deleteUrl="/users/123" を指定してサーバー削除
            />
        </>
    );
};
```

### 2. 契約確定アラート

```jsx
import { ContractConfirmAlert } from "@/Components";

const ContractPage = () => {
    const [showContractAlert, setShowContractAlert] = useState(false);

    const contractDetails = {
        serviceName: "ウェブサイト制作",
        contractPeriod: "3ヶ月",
        price: 500000,
        startDate: "2024年1月1日",
        endDate: "2024年3月31日",
    };

    return (
        <>
            <button onClick={() => setShowContractAlert(true)}>
                契約を確定する
            </button>

            <ContractConfirmAlert
                isOpen={showContractAlert}
                onClose={() => setShowContractAlert(false)}
                contractDetails={contractDetails}
                confirmUrl="/contracts/confirm"
            />
        </>
    );
};
```

### 3. サービス公開確認アラート

```jsx
import { ServicePublishAlert } from "@/Components";

const ServiceManagement = () => {
    const [showPublishAlert, setShowPublishAlert] = useState(false);

    const serviceDetails = {
        name: "ウェブサイト制作サービス",
        category: "ウェブ開発",
        price: 300000,
        priceUnit: "プロジェクト",
        description: "モダンで効果的なウェブサイトを制作いたします...",
    };

    return (
        <>
            <button onClick={() => setShowPublishAlert(true)}>
                サービスを公開
            </button>

            <ServicePublishAlert
                isOpen={showPublishAlert}
                onClose={() => setShowPublishAlert(false)}
                serviceDetails={serviceDetails}
                publishUrl="/services/123/publish"
            />
        </>
    );
};
```

### 4. 成功通知アラート

```jsx
import { SuccessAlert } from "@/Components";

const ExampleComponent = () => {
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        // 保存処理後
        setShowSuccess(true);
    };

    return (
        <>
            <button onClick={handleSave}>保存</button>

            <SuccessAlert
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="保存完了"
                message="データが正常に保存されました。"
                autoClose={true}
                autoCloseDelay={3000}
            />
        </>
    );
};
```

### 5. 汎用確認アラート

```jsx
import { ConfirmAlert } from "@/Components";

const ExampleComponent = () => {
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <>
            <button onClick={() => setShowConfirm(true)}>送信</button>

            <ConfirmAlert
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                title="データ送信の確認"
                message="この内容で送信しますか？"
                type="warning"
                confirmText="送信する"
                actionUrl="/submit-data"
                method="post"
            >
                {/* カスタムコンテンツを挿入可能 */}
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <p>送信後は修正できません。</p>
                </div>
            </ConfirmAlert>
        </>
    );
};
```

### 6. BaseAlert を直接使用（カスタム用途）

```jsx
import { BaseAlert } from "@/Components";

const CustomAlert = () => {
    const [showAlert, setShowAlert] = useState(false);

    return (
        <BaseAlert
            isOpen={showAlert}
            onClose={() => setShowAlert(false)}
            title="カスタムアラート"
            message="独自の処理を実行しますか？"
            type="info"
            confirmText="実行"
            cancelText="キャンセル"
            size="lg"
            onConfirm={() => {
                // カスタム処理
                console.log("カスタム処理実行");
            }}
        >
            {/* 任意のコンテンツ */}
            <div className="custom-content">
                <h4>詳細情報</h4>
                <p>ここに詳しい説明を記載...</p>
            </div>
        </BaseAlert>
    );
};
```

## プロパティ一覧

### BaseAlert Props

-   `isOpen`: boolean - アラート表示状態
-   `onClose`: function - 閉じる時のコールバック
-   `onConfirm`: function - 確認ボタン押下時のコールバック
-   `title`: string - タイトル
-   `message`: string - メッセージ
-   `type`: 'success' | 'warning' | 'error' | 'info' | 'confirm' - アラートタイプ
-   `confirmText`: string - 確認ボタンのテキスト
-   `cancelText`: string - キャンセルボタンのテキスト
-   `showCancel`: boolean - キャンセルボタンの表示/非表示
-   `size`: 'sm' | 'md' | 'lg' | 'xl' - アラートサイズ
-   `actionUrl`: string - サーバーアクション用 URL
-   `method`: string - HTTP メソッド
-   `children`: ReactNode - カスタムコンテンツ

### 各専用アラートの Props

各コンポーネントのソースコードを参照してください。特定の用途に最適化されたプロパティを提供しています。
