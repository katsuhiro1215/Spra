<?php

namespace App\Http\Requests;

use App\Services\ScheduleService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class ScheduleExceptionRequest extends FormRequest
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
        // 更新時と作成時でルールを分ける
        $isUpdate = $this->route('exception') !== null;

        $rules = [
            'is_open' => ['required', 'boolean'],
            'open_time' => ['nullable', 'date_format:H:i'],
            'close_time' => ['nullable', 'date_format:H:i'],
            'break_start' => ['nullable', 'date_format:H:i'],
            'break_end' => ['nullable', 'date_format:H:i'],
            'reason' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];

        // 作成時のみexception_dateが必要
        if (!$isUpdate) {
            $rules['exception_date'] = ['required', 'date'];
        }

        return $rules;
    }

    /**
     * 営業時間・休憩時間の整合性を検証する
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $error = app(ScheduleService::class)->validateTimeConsistency(
                (bool) $this->input('is_open'),
                $this->input('open_time'),
                $this->input('close_time'),
                $this->input('break_start'),
                $this->input('break_end'),
            );

            if ($error) {
                $validator->errors()->add('open_time', $error);
            }
        });
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'exception_date' => '日付',
            'is_open' => '営業状態',
            'open_time' => '開店時間',
            'close_time' => '閉店時間',
            'break_start' => '休憩開始時間',
            'break_end' => '休憩終了時間',
            'reason' => '理由',
            'notes' => '備考',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'exception_date.required' => '日付を入力してください。',
            'exception_date.date' => '有効な日付を入力してください。',
            'is_open.required' => '営業状態を選択してください。',
            'is_open.boolean' => '営業状態は真偽値である必要があります。',
            'open_time.date_format' => '開店時間は HH:MM 形式で入力してください。',
            'close_time.date_format' => '閉店時間は HH:MM 形式で入力してください。',
            'break_start.date_format' => '休憩開始時間は HH:MM 形式で入力してください。',
            'break_end.date_format' => '休憩終了時間は HH:MM 形式で入力してください。',
            'reason.max' => '理由は255文字以内で入力してください。',
            'notes.max' => '備考は500文字以内で入力してください。',
        ];
    }
}
