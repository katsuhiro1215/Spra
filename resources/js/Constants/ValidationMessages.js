// バリデーションメッセージ
export const ValidationMessages = {
    required: (field) => `${field}は必須です`,
    email: "正しいメールアドレスを入力してください",
    min: (field, min) => `${field}は${min}文字以上で入力してください`,
    max: (field, max) => `${field}は${max}文字以下で入力してください`,
    numeric: (field) => `${field}は数値で入力してください`,
    url: "正しいURLを入力してください",
    unique: (field) => `この${field}は既に使用されています`,
    positive: (field) => `${field}は0以上の値を入力してください`,

    // サービスタイプ固有
    serviceType: {
        nameRequired: "サービスタイプ名は必須です",
        slugUnique: "このスラッグは既に使用されています",
        priceInvalid: "有効な価格を入力してください",
        priceNegative: "価格は0以上の値を入力してください",
        categoryRequired: "カテゴリを選択してください",
    },
};
