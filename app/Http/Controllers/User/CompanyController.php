<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    /**
     * Show company info form for onboarding
     */
    public function create(): Response
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
     * Store company information
     */
    public function store(Request $request): RedirectResponse
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
}
