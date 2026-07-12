<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth('admins')->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $documentId = $this->route('document')?->id;

        $rules = [
            'document_category_id' => ['required', 'exists:document_categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:documents,slug,' . $documentId],
            'description' => ['nullable', 'string', 'max:1000'],
            'requires_acceptance' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];

        // 新規作成時のみ、初回バージョンの内容を必須にする
        if ($this->isMethod('post')) {
            $rules['content'] = ['required', 'string'];
        }

        return $rules;
    }

    /**
     * バリデーション前のデータ準備
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'requires_acceptance' => $this->boolean('requires_acceptance'),
        ]);
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'document_category_id' => 'カテゴリ',
            'title' => '文書名',
            'slug' => 'スラッグ',
            'description' => '説明',
            'requires_acceptance' => '同意必須',
            'sort_order' => '表示順',
            'content' => '内容',
        ];
    }
}
