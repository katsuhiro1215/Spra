/**
 * Pages用バリデーション定義
 * ルールとメッセージを一元管理
 */
import { CommonMessages } from "@/Constants/Validation/CommonMessages";

export const pageValidationRules = {
  // 基本情報
  title: {
    required: true,
    min: 2,
    max: 100,
    label: "タイトル",
  },
  slug: {
    required: true,
    min: 2,
    max: 100,
    pattern: /^[a-z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF-]+$/,
    label: "スラッグ",
  },
};

export const pageValidationMessages = {
  // 基本的なメッセージは CommonMessages から継承
  ...CommonMessages,

  // Page固有のメッセージ
  page: {
    titleRequired: "タイトルは必須です",
    titleMin: "タイトルは2文字以上で入力してください",
    titleMax: "タイトルは100文字以内で入力してください",

    slugRequired: "スラッグは必須です",
    slugMin: "スラッグは2文字以上で入力してください",
    slugMax: "スラッグは100文字以内で入力してください",
    slugPattern: "スラッグは半角英数字と一部の記号（-）のみ使用できます",
    slugUnique: "このスラッグは既に使用されています",
  },
};









