<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Services\TwoFactorTotpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SecuritySettingsController extends Controller
{
    public function __construct(
        private TwoFactorTotpService $totp
    ) {}

    /**
     * セキュリティ設定画面を表示
     */
    public function edit(): Response
    {
        $admin = auth('admins')->user();

        return Inertia::render('Admin/Settings/Security', [
            'twoFactorEnabled' => $admin->two_factor_enabled,
            'twoFactorMethod' => $admin->twoFactorMethod(),
            'totpConfirmed' => $admin->two_factor_confirmed_at !== null,
            'recoveryCodesRemaining' => $admin->usesTotp() ? $admin->remainingRecoveryCodesCount() : null,
        ]);
    }

    /**
     * 二段階認証（メールOTP方式）の有効・無効を切り替える
     * TOTPが確定済みの場合、このエンドポイントでの無効化はTOTPごと解除する
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'two_factor_enabled' => ['required', 'boolean'],
        ]);

        $admin = auth('admins')->user();

        if (! $request->boolean('two_factor_enabled')) {
            $admin->disableTwoFactor();

            return back()->with('success', '二段階認証を無効にしました。');
        }

        if ($admin->usesTotp()) {
            return back()->with('success', '二段階認証は認証アプリ方式で有効になっています。');
        }

        $admin->update([
            'two_factor_enabled' => true,
            'two_factor_method' => Admin::TWO_FACTOR_METHOD_EMAIL,
        ]);

        return back()->with(
            'success',
            '二段階認証を有効にしました。次回ログイン時からメールで認証コードが送信されます。'
        );
    }

    /**
     * TOTPセットアップを開始し、QRコードを表示する（この時点ではまだ未確定）
     */
    public function setupTotp(): RedirectResponse
    {
        $admin = auth('admins')->user();
        $secret = $this->totp->generateSecretKey();

        session(['totp_pending_secret' => encrypt($secret)]);

        return back()->with('totpSetup', [
            'secret' => $secret,
            'qrSvg' => $this->totp->getQrCodeSvg(config('app.name'), $admin->email, $secret),
        ]);
    }

    /**
     * セットアップ中のTOTPコードを検証し、確定する（リカバリーコードを発行）
     */
    public function confirmTotp(Request $request): RedirectResponse
    {
        $request->validate(['code' => ['required', 'string']]);

        $encryptedSecret = session('totp_pending_secret');
        abort_unless($encryptedSecret, 422, 'セットアップがまだ開始されていません。');

        $secret = decrypt($encryptedSecret);
        $admin = auth('admins')->user();

        if (! $this->totp->verify($secret, trim($request->input('code')))) {
            return back()->withErrors(['code' => '認証コードが正しくありません。']);
        }

        $admin->two_factor_secret = $secret;
        $admin->two_factor_method = Admin::TWO_FACTOR_METHOD_TOTP;
        $admin->two_factor_enabled = true;
        $admin->two_factor_confirmed_at = now();
        $admin->save();

        session()->forget('totp_pending_secret');

        $recoveryCodes = $admin->generateRecoveryCodes();

        return back()
            ->with('success', '認証アプリによる二段階認証を有効にしました。')
            ->with('recoveryCodesReveal', $recoveryCodes);
    }

    /**
     * リカバリーコードを再発行する（以前のコードは即失効）
     */
    public function regenerateRecoveryCodes(): RedirectResponse
    {
        $admin = auth('admins')->user();
        abort_unless($admin->usesTotp(), 422, '認証アプリ方式が有効化されていません。');

        $recoveryCodes = $admin->generateRecoveryCodes();

        return back()
            ->with('success', 'リカバリーコードを再発行しました。以前のコードは無効になりました。')
            ->with('recoveryCodesReveal', $recoveryCodes);
    }
}
