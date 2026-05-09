/**
 * 管理者プロファイル・住所用バリデーションメッセージ
 */

// フィールド名の定義
export const AdminFieldLabels = {
    // プロファイル
    last_name: "姓",
    first_name: "名",
    last_name_kana: "姓（カナ）",
    first_name_kana: "名（カナ）",
    display_name: "表示名",
    birth_date: "生年月日",
    gender: "性別",
    phone: "電話番号",
    mobile: "携帯電話",
    emergency_contact_name: "緊急連絡先氏名",
    emergency_contact_phone: "緊急連絡先電話番号",
    bio: "自己紹介",

    // 住所
    type: "住所タイプ",
    label: "ラベル",
    postal_code: "郵便番号",
    prefecture: "都道府県",
    city: "市区町村",
    district: "町域",
    address_other: "番地・建物名",
    contact_person: "担当者名",
    notes: "備考",
};

// プロファイル用バリデーションメッセージ
export const ProfileMessages = {
    // 姓
    last_name: {
        required: "姓は必須です",
        maxLength: "姓は50文字以内で入力してください",
    },
    // 名
    first_name: {
        required: "名は必須です",
        maxLength: "名は50文字以内で入力してください",
    },
    // 姓（カナ）
    last_name_kana: {
        maxLength: "姓（カナ）は50文字以内で入力してください",
        pattern: "姓（カナ）は全角カタカナで入力してください",
    },
    // 名（カナ）
    first_name_kana: {
        maxLength: "名（カナ）は50文字以内で入力してください",
        pattern: "名（カナ）は全角カタカナで入力してください",
    },
    // 表示名
    display_name: {
        maxLength: "表示名は50文字以内で入力してください",
    },
    // 生年月日
    birth_date: {
        invalid: "正しい日付を入力してください",
        future: "未来の日付は入力できません",
    },
    // 性別
    gender: {
        invalid: "有効な性別を選択してください",
    },
    // 電話番号
    phone: {
        maxLength: "電話番号は20文字以内で入力してください",
        pattern: "正しい電話番号形式で入力してください（例: 03-1234-5678）",
    },
    // 携帯電話
    mobile: {
        maxLength: "携帯電話は20文字以内で入力してください",
        pattern: "正しい携帯電話形式で入力してください（例: 090-1234-5678）",
    },
    // 緊急連絡先氏名
    emergency_contact_name: {
        maxLength: "緊急連絡先氏名は100文字以内で入力してください",
    },
    // 緊急連絡先電話番号
    emergency_contact_phone: {
        maxLength: "緊急連絡先電話番号は20文字以内で入力してください",
        pattern: "正しい電話番号形式で入力してください",
    },
    // 自己紹介
    bio: {
        maxLength: "自己紹介は1000文字以内で入力してください",
    },
};

// 住所用バリデーションメッセージ
export const AddressMessages = {
    // 住所タイプ
    type: {
        required: "住所タイプは必須です",
        enum: "有効な住所タイプを選択してください",
    },
    // ラベル
    label: {
        maxLength: "ラベルは50文字以内で入力してください",
    },
    // 郵便番号
    postal_code: {
        required: "郵便番号は必須です",
        maxLength: "郵便番号は20文字以内で入力してください",
        pattern: "郵便番号は半角数字7桁で入力してください（例: 1000001）",
    },
    // 都道府県
    prefecture: {
        required: "都道府県は必須です",
        maxLength: "都道府県は20文字以内で入力してください",
    },
    // 市区町村
    city: {
        required: "市区町村は必須です",
        maxLength: "市区町村は50文字以内で入力してください",
    },
    // 町域
    district: {
        maxLength: "町域は100文字以内で入力してください",
    },
    // 番地・建物名
    address_other: {
        maxLength: "番地・建物名は255文字以内で入力してください",
    },
    // 電話番号
    phone: {
        maxLength: "電話番号は20文字以内で入力してください",
        pattern: "正しい電話番号形式で入力してください",
    },
    // 担当者名
    contact_person: {
        maxLength: "担当者名は100文字以内で入力してください",
    },
    // 備考
    notes: {
        maxLength: "備考は1000文字以内で入力してください",
    },
};
