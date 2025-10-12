// 日本語バリデーションメッセージの使用例

// 1. FormRequestでの自動的な日本語メッセージ適用
class StoreServiceTypeRequest extends FormRequest
{
public function rules()
{
return [
'name' => 'required|min:2|max:100',
'email' => 'required|email',
'service_category_id' => 'required|exists:service_categories,id',
'base_price' => 'nullable|numeric|min:0',
'description' => 'required|min:10|max:500',
];
}

// カスタムメッセージ（必要に応じて）
public function messages()
{
return [
'name.required' => ':attributeは必須入力です。',
'name.min' => ':attributeは:min文字以上で入力してください。',
'email.email' => '正しい:attributeの形式で入力してください。',
];
}

// 属性名のカスタマイズ
public function attributes()
{
return [
'name' => 'サービス名',
'email' => 'メールアドレス',
'service_category_id' => 'サービスカテゴリ',
'base_price' => '基本価格',
'description' => 'サービス説明',
];
}
}

// 2. コントローラーでの手動バリデーション
class ServiceTypeController extends Controller
{
public function store(StoreServiceTypeRequest $request)
{
// FormRequestで自動的に日本語バリデーションが適用される

try {
$serviceType = ServiceType::create($request->validated());

return redirect()
->route('admin.service.service-types.index')
->with('success', 'サービスタイプが正常に作成されました。');

} catch (\Exception $e) {
return back()
->withInput()
->with('error', 'サービスタイプの作成に失敗しました。');
}
}

// 手動バリデーションの例
public function update(Request $request, ServiceType $serviceType)
{
$validator = Validator::make($request->all(), [
'name' => 'required|min:2|max:100',
'email' => 'required|email',
]);

if ($validator->fails()) {
// 日本語のエラーメッセージが自動的に適用される
return back()
->withErrors($validator)
->withInput();
}

// 更新処理...
}
}

// 3. Bladeテンプレートでのエラー表示
/*
<!-- resources/views/admin/service/service-types/create.blade.php -->
@if ($errors->any())
<div class="alert alert-danger">
  <ul>
    @foreach ($errors->all() as $error)
    <li>{{ $error }}</li> <!-- 日本語メッセージが表示される -->
    @endforeach
  </ul>
</div>
@endif

<!-- 個別フィールドのエラー表示 -->
<input type="text" name="name" value="{{ old('name') }}">
@error('name')
<span class="text-red-500">{{ $message }}</span> <!-- 日本語メッセージ -->
@enderror
*/

// 4. Reactコンポーネントでの使用（Inertia.js）
/*
// Create.jsx でのエラー表示
const Create = ({ errors }) => {
return (
<div>
  <ValidatedInput
    name="name"
    label="サービス名"
    error={errors.name} // 日本語エラーメッセージが表示される
    required />

  <ValidatedInput
    name="email"
    label="メールアドレス"
    type="email"
    error={errors.email} // 日本語エラーメッセージが表示される
    required />
</div>
);
};
*/

// 5. 言語ファイルでの翻訳関数使用例
class ServiceTypeController extends Controller
{
public function destroy(ServiceType $serviceType)
{
try {
$serviceType->delete();

return redirect()
->route('admin.service.service-types.index')
->with('success', __('messages.service_type.deleted'));

} catch (\Exception $e) {
return back()
->with('error', __('messages.service_type.delete_failed'));
}
}
}

// 6. 追加の言語ファイル作成例
// lang/ja/messages.php
return [
'service_type' => [
'created' => 'サービスタイプが正常に作成されました。',
'updated' => 'サービスタイプが正常に更新されました。',
'deleted' => 'サービスタイプが正常に削除されました。',
'create_failed' => 'サービスタイプの作成に失敗しました。',
'update_failed' => 'サービスタイプの更新に失敗しました。',
'delete_failed' => 'サービスタイプの削除に失敗しました。',
'not_found' => 'サービスタイプが見つかりません。',
],
'general' => [
'save' => '保存',
'cancel' => 'キャンセル',
'edit' => '編集',
'delete' => '削除',
'create' => '作成',
'update' => '更新',
'back' => '戻る',
'search' => '検索',
'reset' => 'リセット',
'submit' => '送信',
'close' => '閉じる',
],
];