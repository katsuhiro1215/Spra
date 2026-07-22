<?php

namespace App\Http\Requests\Website;

use Illuminate\Foundation\Http\FormRequest;

class FaqRequest extends FormRequest
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
            'faq_category_id' => ['required', 'exists:faq_categories,id'],
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string', 'max:2000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'service_ids' => ['nullable', 'array'],
            'service_ids.*' => ['string', 'exists:services,id'],
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
            'faq_category_id.required' => 'カテゴリを選択してください。',
            'faq_category_id.exists' => '選択されたカテゴリが存在しません。',
            'question.required' => '質問を入力してください。',
            'question.max' => '質問は500文字以内で入力してください。',
            'answer.required' => '回答を入力してください。',
            'answer.max' => '回答は2000文字以内で入力してください。',
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
            'faq_category_id' => 'カテゴリ',
            'question' => '質問',
            'answer' => '回答',
            'sort_order' => '表示順序',
            'is_featured' => 'よくある質問',
            'is_published' => '公開状態',
            'service_ids' => '対象サービス',
        ];
    }
}
