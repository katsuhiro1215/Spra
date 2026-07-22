<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class ProjectTemplateRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'milestones' => ['nullable', 'array'],
            'milestones.*.milestone_name' => ['required', 'string', 'max:255'],
            'milestones.*.description' => ['nullable', 'string'],
            'milestones.*.order' => ['required', 'integer', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'テンプレート名は必須です。',
            'name.string' => 'テンプレート名は文字列である必要があります。',
            'name.max' => 'テンプレート名は255文字以下である必要があります。',
            'description.string' => '説明は文字列である必要があります。',
            'icon.string' => 'アイコンは文字列である必要があります。',
            'icon.max' => 'アイコンは255文字以下である必要があります。',
            'sort_order.integer' => '表示順は整数である必要があります。',
            'sort_order.min' => '表示順は0以上である必要があります。',
            'is_active.boolean' => 'ステータスはtrueまたはfalseである必要があります。',
            'milestones.*.milestone_name.required' => 'マイルストーン名は必須です。',
            'milestones.*.milestone_name.string' => 'マイルストーン名は文字列である必要があります。',
            'milestones.*.milestone_name.max' => 'マイルストーン名は255文字以下である必要があります。',
            'milestones.*.description.string' => 'マイルストーン説明は文字列である必要があります。',
            'milestones.*.order.required' => 'マイルストーン順序は必須です。',
            'milestones.*.order.integer' => 'マイルストーン順序は整数である必要があります。',
            'milestones.*.order.min' => 'マイルストーン順序は0以上である必要があります。',
        ];
    }
}
