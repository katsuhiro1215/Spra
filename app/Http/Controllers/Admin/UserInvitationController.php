<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\UserInvitation;
use App\Mail\UserInvitationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserInvitationController extends Controller
{
    /**
     * お問い合わせから招待を作成
     */
    public function store(Request $request, Contact $contact)
    {
        $request->validate([
            'notes' => 'nullable|string|max:1000',
            'expires_days' => 'nullable|integer|min:1|max:30',
        ]);

        // 既に有効な招待が存在するかチェック
        $existingInvitation = $contact->invitations()
            ->valid()
            ->first();

        if ($existingInvitation) {
            return back()->with('error', __('messages.user_invitation.already_invited'));
        }

        // 招待を作成
        $invitation = UserInvitation::create([
            'contact_id' => $contact->id,
            'email' => $contact->email,
            'token' => UserInvitation::generateToken(),
            'expires_at' => now()->addDays($request->input('expires_days', UserInvitation::DEFAULT_EXPIRY_DAYS)),
            'status' => UserInvitation::STATUS_PENDING,
            'invited_by' => Auth::guard('admins')->id(),
            'notes' => $request->input('notes'),
        ]);

        // 招待メールを送信
        try {
            Mail::to($contact->email)->send(new UserInvitationMail($invitation, $contact));

            return back()->with('success', __('messages.sent', ['attribute' => '招待メール']));
        } catch (\Exception $e) {
            // メール送信失敗時も招待は作成済み
            Log::error('Invitation email failed', [
                'invitation_id' => $invitation->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('warning', '招待は作成されましたが、メール送信に失敗しました。');
        }
    }

    /**
     * 招待を再送信
     */
    public function resend(UserInvitation $invitation)
    {
        if (!$invitation->isValid()) {
            return back()->with('error', __('messages.user_invitation.already_used_or_expired'));
        }

        try {
            Mail::to($invitation->email)->send(new UserInvitationMail($invitation, $invitation->contact));

            return back()->with('success', __('messages.resent', ['attribute' => '招待メール']));
        } catch (\Exception $e) {
            Log::error('Invitation resend failed', [
                'invitation_id' => $invitation->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', __('messages.user_invitation.email_send_failed'));
        }
    }

    /**
     * 招待を取り消し
     */
    public function revoke(UserInvitation $invitation)
    {
        if ($invitation->isAccepted()) {
            return back()->with('error', __('messages.user_invitation.already_approved'));
        }

        $invitation->revoke();

        return back()->with('success', __('messages.user_invitation.revoked'));
    }
}
