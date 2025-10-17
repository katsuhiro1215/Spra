// ==========================================
// Forms バレルエクスポート (Laravel Breeze互換)
// ==========================================

// Basic Form Elements
export { default as InputLabel } from "./InputLabel";
export { default as TextInput } from "./TextInput";
export { default as TextArea } from "./TextArea";
export { default as SelectInput } from "./SelectInput";
export { default as InputError } from "./InputError";
export { default as Checkbox } from "./Checkbox";

// Validated Components
export { default as ValidatedInput } from "./ValidatedInput";
export { default as ValidatedTextArea } from "./ValidatedTextArea";

// Rich Text Editor
export { default as RichTextEditor } from "./RichTextEditor";

// Input Types
export { default as RadioButton, RadioGroup } from "./RadioButton";
export { default as Select } from "./Select";
export { default as FileInput } from "./FileInput";

// Form Structure
export { default as FormWrapper, FormField, FormActions } from "./FormWrapper";

// ==========================================
// 重複解決のための優先順位
// 注意: 以下のコンポーネントは Components/ 直下にも存在
// - TextInput: Forms/TextInput (Laravel Breeze標準) vs Components/TextInput (拡張版)
// - InputLabel: 同様の重複
// - InputError: 同様の重複
//
// 現在の使い分け:
// - 認証系: Forms/ 版を使用 (Laravel Breeze標準)
// - 管理画面: Components/ 版を使用 (ValidatedInput等と統合)
// ==========================================
