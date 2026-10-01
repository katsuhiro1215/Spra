<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RecurringTaskRequest extends FormRequest
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
            'priority' => ['required', Rule::in(Task::PRIORITIES)],
            'task_category_id' => ['nullable', 'exists:task_categories,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'admin_id' => ['nullable', 'exists:admins,id'],
            'due_time' => ['nullable', 'date_format:H:i'],
            'recurrence_rule' => ['required', 'array'],
            'recurrence_rule.freq' => ['required', Rule::in(['daily', 'weekly'])],
            'recurrence_rule.byweekday' => ['nullable', 'array', 'min:1', 'required_if:recurrence_rule.freq,weekly'],
            'recurrence_rule.byweekday.*' => [Rule::in(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'タイトルを入力してください。',
            'due_time.date_format' => '時刻はHH:MM形式で入力してください。',
            'recurrence_rule.byweekday.required_if' => '少なくとも1つの曜日を選択してください。',
        ];
    }
}
