<?php

namespace App\Http\Requests\Admin\Service;

use App\Models\ServiceTypePriceItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ServiceTypePriceItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::guard('admins')->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category' => [
                'required',
                'string',
                Rule::in(array_keys(ServiceTypePriceItem::CATEGORIES))
            ],
            'name' => [
                'required',
                'string',
                'max:255'
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000'
            ],
            'price' => [
                'required',
                'numeric',
                'min:0',
                'max:99999999.99'
            ],
            'unit' => [
                'required',
                'string',
                'max:50'
            ],
            'quantity' => [
                'required',
                'integer',
                'min:1',
                'max:1000'
            ],
            'is_optional' => [
                'boolean'
            ],
            'is_variable' => [
                'boolean'
            ],
            'sort_order' => [
                'nullable',
                'integer',
                'min:0',
                'max:9999'
            ],
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'category.required' => __('validation.required', ['attribute' => 'カテゴリ']),
            'category.in' => __('validation.in', ['attribute' => 'カテゴリ']),
            'name.required' => __('validation.required', ['attribute' => '項目名']),
            'name.max' => __('validation.max.string', ['attribute' => '項目名', 'max' => 255]),
            'description.max' => __('validation.max.string', ['attribute' => '詳細説明', 'max' => 1000]),
            'price.required' => __('validation.required', ['attribute' => '価格']),
            'price.numeric' => __('validation.numeric', ['attribute' => '価格']),
            'price.min' => __('validation.min.numeric', ['attribute' => '価格', 'min' => 0]),
            'price.max' => __('validation.max.numeric', ['attribute' => '価格', 'max' => 99999999.99]),
            'unit.required' => __('validation.required', ['attribute' => '単位']),
            'unit.max' => __('validation.max.string', ['attribute' => '単位', 'max' => 50]),
            'quantity.required' => __('validation.required', ['attribute' => '数量']),
            'quantity.integer' => __('validation.integer', ['attribute' => '数量']),
            'quantity.min' => __('validation.min.numeric', ['attribute' => '数量', 'min' => 1]),
            'quantity.max' => __('validation.max.numeric', ['attribute' => '数量', 'max' => 1000]),
            'sort_order.integer' => __('validation.integer', ['attribute' => '表示順序']),
            'sort_order.min' => __('validation.min.numeric', ['attribute' => '表示順序', 'min' => 0]),
            'sort_order.max' => __('validation.max.numeric', ['attribute' => '表示順序', 'max' => 9999]),
        ];
    }

    /**
     * Get custom attribute names.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'category' => 'カテゴリ',
            'name' => '項目名',
            'description' => '詳細説明',
            'price' => '価格',
            'unit' => '単位',
            'quantity' => '数量',
            'is_optional' => 'オプション項目',
            'is_variable' => '可変価格',
            'sort_order' => '表示順序',
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation(): void
    {
        // boolean値の処理
        $this->merge([
            'is_optional' => $this->boolean('is_optional'),
            'is_variable' => $this->boolean('is_variable'),
        ]);

        // 価格の正規化
        if ($this->has('price')) {
            $this->merge([
                'price' => (float) str_replace(',', '', $this->input('price'))
            ]);
        }
    }

    /**
     * Handle a passed validation attempt.
     *
     * @return void
     */
    protected function passedValidation(): void
    {
        // 小計の自動計算（モデルのbootメソッドでも計算されるが、念のため）
        $this->merge([
            'total_price' => $this->input('price') * $this->input('quantity')
        ]);
    }
}
