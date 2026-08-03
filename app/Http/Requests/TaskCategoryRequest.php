<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('task_category')?->id;

        return [
            'name' => ['required', 'string', 'max:100', "unique:task_categories,name,{$categoryId}"],
            'color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'カテゴリ名を入力してください。',
            'name.unique' => 'このカテゴリ名は既に使用されています。',
            'color.regex' => 'カラーコードは#RRGGBB形式で入力してください。',
        ];
    }
}
