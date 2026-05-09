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
export { default as NumberInput } from "./NumberInput";
export { default as ColorInput } from "./ColorInput";
export { default as ImageUpload } from "./ImageUpload";

// Advanced Components
export { default as ButtonSelect } from "./ButtonSelect";
export { default as ArrayFieldEditor } from "./ArrayFieldEditor";

// Form Structure
export { default as FormWrapper, FormField, FormActions } from "./FormWrapper";
export { default as FormGroup } from "./FormGroup";
export { default as FormSectionTitle } from "./FormSectionTitle";

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
