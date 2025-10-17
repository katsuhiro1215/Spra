<?php

namespace App\Http\Requests\Admin;

use App\Models\Admin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class AdminRegistrationRequest extends FormRequest
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
      'name' => 'required|string|max:255',
      'email' => 'required|string|lowercase|email|max:255|unique:' . Admin::class,
      'password' => ['required', 'confirmed', Rules\Password::defaults()],
    ];
  }

  /**
   * Get custom error messages for validator errors.
   *
   * @return array<string, string>
   */
  public function messages(): array
  {
    return [
      'name.required' => __('validation.required', ['attribute' => __('validation.attributes.name')]),
      'name.string' => __('validation.string', ['attribute' => __('validation.attributes.name')]),
      'name.max' => __('validation.max.string', ['attribute' => __('validation.attributes.name'), 'max' => 255]),

      'email.required' => __('validation.required', ['attribute' => __('validation.attributes.email')]),
      'email.string' => __('validation.string', ['attribute' => __('validation.attributes.email')]),
      'email.email' => __('validation.email', ['attribute' => __('validation.attributes.email')]),
      'email.max' => __('validation.max.string', ['attribute' => __('validation.attributes.email'), 'max' => 255]),
      'email.unique' => __('validation.unique', ['attribute' => __('validation.attributes.email')]),

      'password.required' => __('validation.required', ['attribute' => __('validation.attributes.password')]),
      'password.confirmed' => __('validation.confirmed', ['attribute' => __('validation.attributes.password')]),
    ];
  }

  /**
   * Get custom attributes for validator errors.
   *
   * @return array<string, string>
   */
  public function attributes(): array
  {
    return [
      'name' => __('validation.attributes.name'),
      'email' => __('validation.attributes.email'),
      'password' => __('validation.attributes.password'),
      'password_confirmation' => __('validation.attributes.password_confirmation'),
    ];
  }
}
