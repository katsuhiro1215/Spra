<?php

namespace App\Http\Controllers\User\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserInvitation;
use App\Models\Company;
use App\Models\Profile;
use App\Models\Document;
use App\Models\UserAcceptance;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view with invitation token.
     *
     * 招待なしの自己登録は廃止したため、登録画面は招待リンク経由でのみ表示する。
     */
    public function createWithInvitation(string $token): Response|RedirectResponse
    {
        $invitation = UserInvitation::where('token', $token)
            ->with('contact')
            ->first();

        // 招待が存在しない、または無効な場合
        if (!$invitation) {
            return redirect()->route('user.login')
                ->with('error', '無効な招待リンクです。');
        }

        if (!$invitation->isValid()) {
            $message = $invitation->isExpired()
                ? '招待リンクの有効期限が切れています。'
                : 'この招待は既に使用されています。';

            return redirect()->route('user.login')
                ->with('error', $message);
        }

        return Inertia::render('User/Auth/Register', [
            'invitation' => [
                'token' => $invitation->token,
                'email' => $invitation->email,
                'contact' => [
                    'name' => $invitation->contact->name,
                    'company' => $invitation->contact->company,
                ],
            ],
            'requiredDocuments' => $this->requiredDocumentsForRegistration(),
        ]);
    }

    /**
     * アカウント作成時に同意が必要な文書（同意必須かつ有効なバージョンがあるもの）
     */
    private function requiredDocumentsForRegistration()
    {
        return Document::requiresAcceptance()
            ->with('activeVersion:id,document_id,version')
            ->get()
            ->filter(fn (Document $document) => $document->activeVersion)
            ->map(fn (Document $document) => [
                'title' => $document->title,
                'slug' => $document->slug,
                'version_id' => $document->activeVersion->id,
            ])
            ->values();
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // 基本バリデーション（招待なしの自己登録は廃止したためinvitation_tokenは必須）
        $validated = $request->validate([
            'invitation_token' => 'required|string',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],

            // Company情報（任意）
            'has_company' => 'nullable|boolean',
            'company_name' => 'required_if:has_company,true|nullable|string|max:255',
            'company_type' => 'required_if:has_company,true|nullable|in:individual,corporate',
            'company_registration_number' => 'nullable|string|max:50',
            'company_phone' => 'nullable|string|max:20',
            'company_address' => 'nullable|string|max:500',

            'accepted_document_version_ids' => 'array',
            'accepted_document_version_ids.*' => 'string',
        ]);

        // 同意必須の文書に全て同意しているか確認
        $requiredVersionIds = $this->requiredDocumentsForRegistration()
            ->pluck('version_id');
        $acceptedVersionIds = collect($request->input('accepted_document_version_ids', []));

        if ($requiredVersionIds->diff($acceptedVersionIds)->isNotEmpty()) {
            return back()->withErrors(['acceptance' => '必須文書への同意が必要です。'])->withInput();
        }

        DB::beginTransaction();
        try {
            // 招待トークンを検証
            $invitation = UserInvitation::where('token', $request->invitation_token)
                ->valid()
                ->first();

            if (!$invitation) {
                return back()->withErrors(['invitation_token' => '無効または期限切れの招待です。'])->withInput();
            }

            // 招待のメールアドレスと一致するか確認
            if ($invitation->email !== $request->email) {
                return back()->withErrors(['email' => '招待されたメールアドレスと一致しません。'])->withInput();
            }

            // ユーザー作成
            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'status' => 'active',
            ]);

            // プロフィール作成（名前を姓名に分割して保存。UserService/AdminServiceと同じ簡易的な処理）
            $nameParts = explode(' ', $invitation->contact->name, 2);
            $user->profile()->create([
                'last_name' => $nameParts[0] ?? null,
                'first_name' => $nameParts[1] ?? null,
            ]);

            // 同意必須文書への同意を記録
            foreach ($requiredVersionIds as $versionId) {
                UserAcceptance::create([
                    'user_id' => $user->id,
                    'document_version_id' => $versionId,
                    'accepted_at' => now(),
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);
            }

            // Company情報がある場合は作成して紐付け
            if ($request->boolean('has_company') && $request->filled('company_name')) {
                $company = Company::create([
                    'name' => $request->company_name,
                    'company_type' => $request->company_type ?? 'individual',
                    'registration_number' => $request->company_registration_number,
                    'phone' => $request->company_phone,
                    'status' => 'active',
                ]);

                // Company住所がある場合
                if ($request->filled('company_address')) {
                    $company->addresses()->create([
                        'address' => $request->company_address,
                        'is_default' => true,
                        'is_active' => true,
                    ]);
                }

                // ユーザーとCompanyを紐付け
                $user->companies()->attach($company->id, [
                    'role' => 'owner',
                    'is_primary' => true,
                    'joined_at' => now(),
                ]);
            }

            // 招待を承認済みにする
            $invitation->markAsAccepted($user);

            // Contactにuser_idを紐付け
            $invitation->contact->update([
                'user_id' => $user->id,
            ]);

            // IPアドレスとユーザーエージェントを記録
            $invitation->update([
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            event(new Registered($user));

            Auth::login($user);

            DB::commit();

            return redirect(user_home_url())->with('success', 'アカウントを作成しました。');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('User registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with('error', 'アカウント作成に失敗しました。もう一度お試しください。')->withInput();
        }
    }
}
