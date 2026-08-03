<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'status' => ['nullable', Rule::in(Task::STATUSES)],
            'priority' => ['nullable', Rule::in(Task::PRIORITIES)],
            'task_category_id' => ['nullable', 'exists:task_categories,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'admin_id' => ['nullable', 'exists:admins,id'],
            'due_date' => ['required', 'date'],
            'due_time' => ['nullable', 'date_format:H:i'],
            'recurrence_rule' => ['nullable', 'array'],
            'recurrence_rule.freq' => ['required_with:recurrence_rule', Rule::in(['daily', 'weekly'])],
            'recurrence_rule.byweekday' => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'タイトルを入力してください。',
            'due_date.required' => '期限日を入力してください。',
            'due_time.date_format' => '時刻はHH:MM形式で入力してください。',
        ];
    }
}
