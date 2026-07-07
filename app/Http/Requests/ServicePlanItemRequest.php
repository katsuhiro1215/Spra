<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServicePlanItemRequest extends FormRequest
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
            'items' => 'required|array',
            'items.*.id' => 'nullable|exists:service_plan_items,id',
            'items.*.service_item_id' => 'required|exists:service_items,id',
            'items.*.quantity' => 'nullable|integer|min:1',
            'items.*.estimated_days' => 'nullable|integer|min:0',
            'items.*.sort_order' => 'nullable|integer|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
        ];
    }
}
