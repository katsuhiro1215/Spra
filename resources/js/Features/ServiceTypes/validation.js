/**
 * ServiceTypes用バリデーション定義
 * ルールとメッセージを一元管理
 */

import { ValidationMessages } from "@/Constants/ValidationMessages";

// ServiceType固有のバリデーションルール
export const serviceTypeValidationRules = {
    // 基本情報
    name: {
        required: true,
        min: 2,
        max: 100,
        label: "サービスタイプ名",
    },
    service_category_id: {
        required: true,
        label: "サービスカテゴリ",
    },
    slug: {
        required: true,
        min: 2,
        max: 100,
        pattern: /^[a-z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF-]+$/,
        label: "スラッグ",
    },
    description: {
        required: true,
        min: 10,
        max: 500,
        label: "説明",
    },
    detailed_description: {
        max: 2000,
        label: "詳細説明",
    },

    // 価格・納期
    base_price: {
        numeric: true,
        min: 0,
        label: "基本価格",
        custom: (value) => {
            if (value && parseFloat(value) < 0) {
                return "価格は0以上の値を入力してください";
            }
            return null;
        },
    },
    price_unit: {
        label: "価格単位",
    },
    estimated_delivery_days: {
        numeric: true,
        min: 1,
        label: "標準納期",
    },

    // 設定
    pricing_model: {
        required: true,
        label: "料金体系",
    },
    sort_order: {
        numeric: true,
        min: 0,
        label: "表示順序",
    },

    // 配列フィールド
    features: {
        array: true,
        label: "特徴・機能",
    },
    target_audience: {
        array: true,
        label: "対象顧客",
    },
    deliverables: {
        array: true,
        label: "成果物",
    },
    technologies: {
        array: true,
        label: "使用技術",
    },

    // ビジュアル
    icon: {
        label: "アイコン",
    },
    color: {
        pattern: /^#[0-9A-Fa-f]{6}$/,
        label: "テーマカラー",
    },

    // 相談設定
    consultation_note: {
        max: 1000,
        label: "相談時の注意事項",
    },
};

// ServiceType固有のバリデーションメッセージ
export const serviceTypeValidationMessages = {
    // 基本的なメッセージは ValidationMessages から継承
    ...ValidationMessages,

    // ServiceType固有のメッセージ
    serviceType: {
        nameRequired: "サービスタイプ名は必須です",
        nameMin: "サービスタイプ名は2文字以上で入力してください",
        nameMax: "サービスタイプ名は100文字以下で入力してください",

        slugRequired: "スラッグは必須です",
        slugPattern:
            "スラッグは英数字、ひらがな、カタカナ、漢字、ハイフンのみ使用できます",
        slugUnique: "このスラッグは既に使用されています",

        descriptionRequired: "説明は必須です",
        descriptionMin: "説明は10文字以上で入力してください",
        descriptionMax: "説明は500文字以下で入力してください",

        detailedDescriptionMax: "詳細説明は2000文字以下で入力してください",

        categoryRequired: "カテゴリを選択してください",
        pricingModelRequired: "料金体系を選択してください",

        priceNumeric: "基本価格は数値で入力してください",
        priceNegative: "価格は0以上の値を入力してください",

        deliveryDaysNumeric: "標準納期は数値で入力してください",
        deliveryDaysMin: "標準納期は1日以上で入力してください",

        sortOrderNumeric: "表示順序は数値で入力してください",
        sortOrderMin: "表示順序は0以上で入力してください",

        colorPattern: "カラーコードの形式が正しくありません（例: #FF0000）",

        consultationNoteMax: "相談時の注意事項は1000文字以下で入力してください",
    },
};

// Create用のバリデーションルール（必須項目を強化）
export const serviceTypeCreateValidationRules = {
    ...serviceTypeValidationRules,
    slug: {
        ...serviceTypeValidationRules.slug,
        required: true, // Create時は必須
    },
    pricing_model: {
        ...serviceTypeValidationRules.pricing_model,
        required: true,
    },
};

// Edit用のバリデーションルール（一部を緩和）
export const serviceTypeEditValidationRules = {
    ...serviceTypeValidationRules,
    slug: {
        ...serviceTypeValidationRules.slug,
        required: false, // Edit時は任意（自動生成された場合）
    },
};

// バリデーション実行ヘルパー
export const validateServiceTypeField = (
    fieldName,
    value,
    rules = serviceTypeValidationRules
) => {
    const rule = rules[fieldName];
    if (!rule) return null;

    const errors = [];

    // 必須チェック
    if (
        rule.required &&
        (!value || (typeof value === "string" && value.trim() === ""))
    ) {
        errors.push(serviceTypeValidationMessages.required(rule.label));
    }

    // 値が存在する場合のみ以下のチェックを実行
    if (value && value !== "") {
        // 最小長チェック
        if (rule.min && value.length < rule.min) {
            errors.push(
                serviceTypeValidationMessages.min(rule.label, rule.min)
            );
        }

        // 最大長チェック
        if (rule.max && value.length > rule.max) {
            errors.push(
                serviceTypeValidationMessages.max(rule.label, rule.max)
            );
        }

        // 数値チェック
        if (rule.numeric && isNaN(parseFloat(value))) {
            errors.push(serviceTypeValidationMessages.numeric(rule.label));
        }

        // パターンチェック
        if (rule.pattern && !rule.pattern.test(value)) {
            errors.push(
                serviceTypeValidationMessages.serviceType[
                    `${fieldName}Pattern`
                ] || `${rule.label}の形式が正しくありません`
            );
        }

        // カスタムバリデーション
        if (rule.custom) {
            const customError = rule.custom(value);
            if (customError) {
                errors.push(customError);
            }
        }
    }

    return errors.length > 0 ? errors[0] : null;
};

// 全フィールドバリデーション
export const validateAllServiceTypeFields = (
    data,
    rules = serviceTypeValidationRules
) => {
    const errors = {};

    Object.keys(rules).forEach((fieldName) => {
        const error = validateServiceTypeField(
            fieldName,
            data[fieldName],
            rules
        );
        if (error) {
            errors[fieldName] = error;
        }
    });

    return errors;
};
