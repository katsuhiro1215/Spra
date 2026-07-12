<?php

namespace App\Http\Requests\Website;

use Illuminate\Foundation\Http\FormRequest;

class SiteSettingRequest extends FormRequest
{
    /**
     * ユーザーリクエスト権限
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * バリデーションルール
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $settingId = $this->route('siteSetting')?->id;

        return [
            'key' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9_]+$/',
                'unique:site_settings,key,' . $settingId,
            ],
            'value' => ['nullable', 'string'],
            'type' => ['required', 'string', 'in:string,json,boolean,integer'],
            'group' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * カスタムエラーメッセージ
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'key.required' => 'キーは必須です。',
            'key.regex' => 'キーは英小文字、数字、アンダースコアのみ使用可能です。',
            'key.unique' => 'このキーは既に使用されています。',
            'type.required' => '型を選択してください。',
            'type.in' => '無効な型です。',
        ];
    }

    /**
     * カスタム属性名
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'key' => 'キー',
            'value' => '値',
            'type' => '型',
            'group' => 'グループ',
            'description' => '説明',
        ];
    }
}
