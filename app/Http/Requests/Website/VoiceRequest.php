<?php

namespace App\Http\Requests\Website;

use Illuminate\Foundation\Http\FormRequest;

class VoiceRequest extends FormRequest
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
        return [
            'user_id' => ['nullable', 'exists:users,id'],
            'service_id' => ['nullable', 'exists:services,id'],
            'avatar_id' => ['nullable', 'exists:media,id'],
            'author_name' => ['required', 'string', 'max:100'],
            'author_title' => ['nullable', 'string', 'max:100'],
            'company_name' => ['nullable', 'string', 'max:150'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'content' => ['required', 'string', 'max:2000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
        ];
    }

    /**
     * バリデーション前のデータ準備
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_featured' => $this->boolean('is_featured'),
            'is_published' => $this->boolean('is_published', true),
            'sort_order' => $this->filled('sort_order') ? (int) $this->sort_order : 0,
            'user_id' => $this->filled('user_id') ? $this->user_id : null,
            'service_id' => $this->filled('service_id') ? $this->service_id : null,
            'avatar_id' => $this->filled('avatar_id') ? $this->avatar_id : null,
            'rating' => $this->filled('rating') ? (int) $this->rating : null,
        ]);
    }

    /**
     * カスタムエラーメッセージ
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'user_id.exists' => '選択されたクライアントが存在しません。',
            'service_id.exists' => '選択されたサービスが存在しません。',
            'avatar_id.exists' => '選択された画像が存在しません。',
            'author_name.required' => '表示名を入力してください。',
            'author_name.max' => '表示名は100文字以内で入力してください。',
            'content.required' => 'お客様の声の本文を入力してください。',
            'content.max' => '本文は2000文字以内で入力してください。',
            'rating.integer' => '評価は数値で入力してください。',
            'rating.min' => '評価は1〜5の範囲で入力してください。',
            'rating.max' => '評価は1〜5の範囲で入力してください。',
            'sort_order.integer' => '表示順序は数値で入力してください。',
            'sort_order.min' => '表示順序は0以上の値を入力してください。',
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
            'user_id' => 'クライアント',
            'service_id' => '対象サービス',
            'avatar_id' => 'アバター画像',
            'author_name' => '表示名',
            'author_title' => '役職',
            'company_name' => '会社名',
            'rating' => '評価',
            'content' => '本文',
            'sort_order' => '表示順序',
            'is_featured' => '注目表示',
            'is_published' => '公開状態',
        ];
    }
}
