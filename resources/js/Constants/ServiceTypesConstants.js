// 統合的な定数管理
export const ServiceTypesConstants = {
    // ページ情報
    page: {
        title: "サービスタイプ管理",
        description: "契約管理のベースとなるサービスタイプを管理します",
        documentTitle: "サービスタイプ管理",
    },

    // アクション関連
    actions: {
        create: "新規作成",
        edit: "編集",
        delete: "削除",
        view: "詳細",
        duplicate: "複製",
        export: "エクスポート",
        import: "インポート",
    },

    // 検索・フィルター
    search: {
        placeholder: "サービスタイプ名、説明で検索...",
    },

    filters: {
        category: {
            label: "カテゴリ",
            placeholder: "すべてのカテゴリ",
        },
        pricingModel: {
            label: "料金体系",
            placeholder: "すべての料金体系",
        },
        status: {
            label: "ステータス",
            placeholder: "すべてのステータス",
            options: {
                active: "アクティブ",
                inactive: "非アクティブ",
                featured: "おすすめ",
            },
        },
    },

    // 確認メッセージ
    confirmMessages: {
        delete: "このサービスタイプを削除しますか？",
        bulkAction: (count, action) =>
            `選択した${count}件のアイテムに対して「${action}」を実行しますか？`,
    },

    // 通知メッセージ
    notifications: {
        created: "サービスタイプを作成しました",
        updated: "サービスタイプを更新しました",
        deleted: "サービスタイプを削除しました",
        bulkUpdated: (count) => `${count}件のサービスタイプを更新しました`,
    },

    // テーブルヘッダー
    table: {
        headers: {
            serviceType: "サービスタイプ",
            category: "カテゴリ",
            pricingModel: "料金体系",
            basePrice: "基本価格",
            status: "ステータス",
            updatedAt: "更新日",
            actions: "操作",
        },
    },

    // バルクアクション
    bulkActions: {
        activate: "アクティブ化",
        deactivate: "非アクティブ化",
        delete: "削除",
    },

    // 作成・編集フォーム
    form: {
        create: {
            title: "新しいサービスタイプを作成",
            description:
                "契約管理で使用するサービスタイプの詳細情報を入力してください",
            documentTitle: "サービスタイプ作成",
        },
        edit: {
            title: "サービスタイプを編集",
            description: "サービスタイプの詳細情報を編集してください",
            documentTitle: "サービスタイプ編集",
        },
        sections: {
            basicInfo: "基本情報",
            pricing: "料金設定",
            features: "機能・特徴",
            targeting: "ターゲティング",
            delivery: "成果物・技術",
            visual: "ビジュアル設定",
            advanced: "詳細設定",
        },
        fields: {
            name: "サービスタイプ名",
            productName: "商品愛称",
            version: "バージョン",
            category: "カテゴリ",
            description: "説明",
            detailedDescription: "詳細説明",
            pricingModel: "料金体系",
            basePrice: "基本価格",
            priceUnit: "価格単位",
            estimatedDeliveryDays: "標準納期（日数）",
            features: "特徴・機能",
            targetAudience: "対象顧客",
            deliverables: "成果物",
            technologies: "使用技術",
            icon: "アイコン",
            color: "テーマカラー",
            sortOrder: "表示順序",
            isActive: "アクティブ状態",
            isFeatured: "おすすめサービス",
            requiresConsultation: "要相談フラグ",
            consultationNote: "相談時の注意事項",
        },
        placeholders: {
            name: "例: コーポレートサイト制作",
            productName: "例: Spra Corporate",
            version: "例: 1.0",
            description: "サービスの概要を入力してください",
            detailedDescription: "詳細な説明を入力してください",
            basePrice: "例: 800000",
            estimatedDeliveryDays: "例: 30",
            features: "カンマ区切りで入力（例: レスポンシブデザイン, CMS導入）",
            targetAudience:
                "カンマ区切りで入力（例: 中小企業, スタートアップ）",
            deliverables: "カンマ区切りで入力（例: Webサイト一式, 管理画面）",
            technologies: "カンマ区切りで入力（例: Laravel, React）",
            consultationNote: "相談時の注意事項を入力してください",
        },
        buttons: {
            save: "保存",
            saveAndContinue: "保存して続行",
            cancel: "キャンセル",
            back: "戻る",
        },
        validation: {
            nameRequired: "サービスタイプ名は必須です",
            categoryRequired: "カテゴリを選択してください",
            pricingModelRequired: "料金体系を選択してください",
        },
    },
};
