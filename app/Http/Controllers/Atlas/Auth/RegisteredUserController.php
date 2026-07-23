<?php

namespace App\Http\Controllers\Atlas\Auth;

use App\Http\Controllers\Controller;
use App\Models\AtlasInviteCode;
use App\Models\AtlasMembership;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the Atlas registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Atlas/Auth/Register');
    }

    /**
     * 招待コードを使ってAtlas会員として新規登録する。
     *
     * メインサイトの登録（Contact経由の招待リンク）とは別の、招待コード単体で完結する
     * 軽量な登録フロー。登録と同時にAtlasMembershipをactiveで作成する。
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'invite_code' => ['required', 'string'],
        ]);

        $inviteCode = AtlasInviteCode::where('code', strtoupper($validated['invite_code']))->first();

        if (!$inviteCode || !$inviteCode->isRedeemable()) {
            throw ValidationException::withMessages([
                'invite_code' => '招待コードが無効か、有効期限が切れています。',
            ]);
        }

        $user = DB::transaction(function () use ($validated, $inviteCode) {
            $user = User::create([
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'status' => 'active',
            ]);

            AtlasMembership::create([
                'user_id' => $user->id,
                'brand' => $inviteCode->brand,
                'status' => 'active',
                'activated_at' => now(),
            ]);

            $inviteCode->update([
                'status' => 'used',
                'used_by' => $user->id,
                'used_at' => now(),
            ]);

            return $user;
        });

        event(new Registered($user));

        Auth::guard('users')->login($user);

        return redirect()->route('atlas.room')->with('success', 'ようこそ。Atlasへの登録が完了しました。');
    }
}
