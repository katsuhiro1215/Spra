<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HolidayRequest extends FormRequest
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
        // 一括登録の場合
        if ($this->isMethod('post') && $this->has('holidays')) {
            return [
                'holidays' => ['required', 'array', 'min:1'],
                'holidays.*.date' => ['required', 'date'],
                'holidays.*.name' => ['required', 'string', 'max:255'],
                'holidays.*.type' => ['nullable', 'in:national,international'],
                'holidays.*.color' => ['nullable', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
                'holidays.*.is_recurring' => ['nullable', 'boolean'],
                'holidays.*.description' => ['nullable', 'string', 'max:800'],
            ];
        }

        // 単一登録・更新の場合
        $holidayId = $this->route('holiday') ? $this->route('holiday')->id : null;

        return [
            'date' => ['required', 'date', 'unique:holidays,date,' . $holidayId],
            'color' => '祝日の色',
            'is_recurring' => '毎年繰り返す',
            'description' => '説明',
        ];
    }

    /**
     * カスタムバリデーションメッセージ
     */
    public function messages(): array
    {
        return [
            'date.unique' => '指定された日付の祝日は既に存在します。',
            'color.regex' => '色は有効な16進カラーコードで指定してください（例: #FF5733）。',
        ];
    }
}
