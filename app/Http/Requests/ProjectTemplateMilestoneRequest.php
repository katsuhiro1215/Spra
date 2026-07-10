<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectTemplateMilestoneRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'milestones' => 'required|array|min:1',
            'milestones.*.milestone_name' => 'required|string|max:255',
            'milestones.*.description' => 'nullable|string',
            'milestones.*.order' => 'required|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'milestones.required' => 'マイルストーンを1つ以上入力してください。',
            'milestones.array' => 'マイルストーンの形式が正しくありません。',
            'milestones.min' => 'マイルストーンを1つ以上入力してください。',
            'milestones.*.milestone_name.required' => 'マイルストーン名は必須です。',
            'milestones.*.milestone_name.string' => 'マイルストーン名は文字列である必要があります。',
            'milestones.*.milestone_name.max' => 'マイルストーン名は255文字以下である必要があります。',
            'milestones.*.description.string' => '説明は文字列である必要があります。',
            'milestones.*.order.required' => '順序は必須です。',
            'milestones.*.order.integer' => '順序は数値である必要があります。',
            'milestones.*.order.min' => '順序は0以上である必要があります。',
        ];
    }
}
