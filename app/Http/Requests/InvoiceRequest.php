<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceRequest extends FormRequest
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
            'contract_id'           => 'nullable|ulid|exists:contracts,id',
            'invoice_type'          => 'nullable|string|in:deposit,interim,final,full,monthly,other',
            'issue_date'            => 'required|date',
            'user_id'               => 'nullable|uuid|exists:users,id',
            'company_id'            => 'nullable|ulid|exists:companies,id',
            'status'                => 'required|string|in:draft,sent,paid,overdue,cancelled',
            'due_date'              => 'nullable|date|after:issue_date',
            'billing_period_start'  => 'nullable|date|after_or_equal:issue_date',
            'billing_period_end'    => 'nullable|date|after_or_equal:billing_period_start',
            'subtotal'              => 'required|integer|min:0',
            'tax_rate'              => 'required|numeric|min:0|max:100',
            'tax_amount'            => 'required|integer|min:0',
            'total_amount'          => 'required|integer|min:0',
            'notes'                 => 'nullable|string',
        ];
    }
}
