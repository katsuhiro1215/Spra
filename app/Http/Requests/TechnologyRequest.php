<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TechnologyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('admins')->check();
    }

    public function rules(): array
    {
        $slugRule = ['nullable', 'string', 'max:255'];

        if ($this->isMethod('patch') && $this->route('technology')) {
            $slugRule[] = Rule::unique('technologies', 'slug')->ignore($this->route('technology')->id);
        } else {
            $slugRule[] = 'unique:technologies,slug';
        }

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => $slugRule,
            'icon' => ['nullable', 'string', 'max:255'],
            'color' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => '技術名',
            'slug' => 'スラッグ',
            'icon' => 'アイコン',
            'color' => 'カラー',
            'sort_order' => '表示順',
            'is_active' => '有効',
        ];
    }

    public function messages(): array
    {
        return [
            'color.regex' => 'カラーは有効なHEXカラーコード（例：#3B82F6）で入力してください。',
        ];
    }
}
