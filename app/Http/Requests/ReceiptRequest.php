<?php

namespace App\Http\Requests;

use App\Models\Receipt;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReceiptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $receiptId = $this->route('receipt');

        return [
            'invoice_id'    => 'required|ulid|exists:invoices,id',
            'payment_id'    => 'nullable|ulid|exists:payments,id',
            'user_id'       => 'required|uuid|exists:users,id',
            'company_id'    => 'nullable|ulid|exists:companies,id',
            'amount'        => 'required|numeric|min:0',
            'tax_amount'    => 'required|numeric|min:0',
            'total_amount'  => 'required|numeric|min:0',
            'status'        => 'required|string|in:draft,issued,sent',
            'issued_at'     => 'nullable|date',
            'notes'         => 'nullable|string',
            'receipt_number' => [
                'nullable',
                'string',
                'max:50',
                Rule::when(
                    $receiptId && $this->input('receipt_number') !== Receipt::find($receiptId)?->receipt_number,
                    ['regex:/^[A-Z]{3}-\d{6}-\d{4}$/'],
                ),
                Rule::unique('receipts', 'receipt_number')->ignore($receiptId),
            ],
        ];
    }
}
