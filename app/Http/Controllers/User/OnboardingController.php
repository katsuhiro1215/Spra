<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
  /**
   * Show Profile Form
   */
  public function profileShow(): Response
  {
    $user = auth('users')->user();
    $profile = $user->profile;

    return Inertia::render('User/Onboarding/ProfileForm', [
      'user' => $user,
      'profile' => $profile ? [
        'first_name' => $profile->first_name,
        'last_name' => $profile->last_name,
        'first_name_kana' => $profile->first_name_kana,
        'last_name_kana' => $profile->last_name_kana,
        'phone' => $profile->phone,
        'mobile' => $profile->mobile,
        'birth_date' => $profile->birth_date,
        'gender' => $profile->gender,
      ] : [],
    ]);
  }

  /**
   * Store Profile
   */
  public function profileStore(Request $request): RedirectResponse
  {
    $user = auth('users')->user();

    $validated = $request->validate([
      'first_name' => 'required|string|max:50',
      'last_name' => 'required|string|max:50',
      'first_name_kana' => 'required|string|max:50',
      'last_name_kana' => 'required|string|max:50',
      'phone' => 'nullable|string|max:20',
      'mobile' => 'required|string|regex:/^[\d\-]+$/',
      'birth_date' => 'nullable|date',
      'gender' => 'nullable|in:male,female,other',
    ]);

    // プロフィールを作成または更新
    $profile = $user->profile ?? new Profile();
    $profile->fill([
      'first_name' => $validated['first_name'],
      'last_name' => $validated['last_name'],
      'first_name_kana' => $validated['first_name_kana'],
      'last_name_kana' => $validated['last_name_kana'],
      'phone' => $validated['phone'],
      'mobile' => $validated['mobile'],
      'birth_date' => $validated['birth_date'],
      'gender' => $validated['gender'],
    ]);

    if (!$profile->exists) {
      $profile->profilable_type = 'App\Models\User';
      $profile->profilable_id = $user->id;
    }

    $profile->save();

    return redirect()->route('user.onboarding.company')
      ->with('success', 'プロフィール情報を保存しました');
  }

  /**
   * Show Company Info Form
   */
  public function companyShow(): Response
  {
    $user = auth('users')->user();
    $company = $user->companies()->first();

    return Inertia::render('User/Onboarding/CompanyForm', [
      'user' => $user,
      'company' => $company ? [
        'name' => $company->name,
        'company_type' => $company->company_type,
        'legal_name' => $company->legal_name ?? '',
        'registration_number' => $company->registration_number ?? '',
        'establishment_date' => $company->establishment_date ?? '',
        'capital' => $company->capital ?? '',
        'employee_count' => $company->employee_count ?? '',
        'industry' => $company->industry ?? '',
        'description' => $company->description ?? '',
      ] : [],
    ]);
  }

  /**
   * Store Company Info
   */
  public function companyStore(Request $request): RedirectResponse
  {
    $user = auth('users')->user();

    $validated = $request->validate([
      'legal_name' => 'required|string|max:255',
      'registration_number' => 'nullable|string|max:50',
      'establishment_date' => 'nullable|date',
      'capital' => 'nullable|numeric',
      'employee_count' => 'nullable|integer',
      'industry' => 'nullable|string|max:100',
      'description' => 'nullable|string|max:1000',
    ]);

    $company = $user->companies()->firstOrFail();
    $company->update([
      'legal_name' => $validated['legal_name'],
      'registration_number' => $validated['registration_number'],
      'establishment_date' => $validated['establishment_date'],
      'capital' => $validated['capital'],
      'employee_count' => $validated['employee_count'],
      'industry' => $validated['industry'],
      'description' => $validated['description'],
    ]);

    return redirect()->route('user.onboarding.address')
      ->with('success', '会社情報を保存しました');
  }

  /**
   * Show Address Form
   */
  public function addressShow(): Response
  {
    $user = auth('users')->user();
    $company = $user->companies()->first();
    $address = $company?->addresses()->where('type', 'business')->first();

    return Inertia::render('User/Onboarding/AddressForm', [
      'user' => $user,
      'address' => $address ? [
        'postal_code' => $address->postal_code,
        'prefecture' => $address->prefecture,
        'city' => $address->city,
        'district' => $address->district,
        'address_other' => $address->address_other,
        'phone' => $address->phone,
      ] : [],
    ]);
  }

  /**
   * Store Address
   */
  public function addressStore(Request $request): RedirectResponse
  {
    $user = auth('users')->user();

    $validated = $request->validate([
      'postal_code' => 'required|string|regex:/^\d{3}-\d{4}$/',
      'prefecture' => 'required|string|max:50',
      'city' => 'required|string|max:100',
      'district' => 'nullable|string|max:100',
      'address_other' => 'required|string|max:255',
      'phone' => 'nullable|string|regex:/^[\d\-]+$/',
    ]);

    $company = $user->companies()->firstOrFail();
    $address = $company->addresses()->where('type', 'business')->first() ??
      $company->addresses()->make(['type' => 'business']);

    $address->fill([
      'postal_code' => $validated['postal_code'],
      'prefecture' => $validated['prefecture'],
      'city' => $validated['city'],
      'district' => $validated['district'],
      'address_other' => $validated['address_other'],
      'phone' => $validated['phone'],
    ]);

    if (!$address->exists) {
      $address->addressable_type = 'App\Models\Company';
      $address->addressable_id = $company->id;
    }

    $address->save();

    return redirect()->route('user.dashboard')
      ->with('success', '住所情報を保存しました。管理者の確認後、契約書をお送りします。');
  }
}
