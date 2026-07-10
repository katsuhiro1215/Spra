<?php

namespace App\Http\Controllers\Admin\Contract;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\ContractSignature;
use App\Jobs\ContractSignedNotificationJob;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\Inertia;

class ContractSignatureController extends Controller
{
    /**
     * 署名ページを表示（ユーザー向け）
     *署名用トークンが必要
     */
    public function showUserSignaturePage(Request $request, string $contractId)
    {
        $contract = Contract::find($contractId);

        if (!$contract) {
            abort(404, '契約書が見つかりません');
        }

        // 署名受け取り可能かチェック
        if (!$contract->canReceiveSignature()) {
            abort(403, 'この契約書はまだ署名できません');
        }

        // ユーザー署名が必要かチェック
        if (!$contract->isAwaitingUserSignature()) {
            abort(403, 'この契約書はユーザー署名が不要です');
        }

        return Inertia::render('UserSignature/Show', [
            'contract' => [
                'id' => $contract->id,
                'title' => $contract->title,
                'amount' => $contract->amount,
                'start_date' => $contract->start_date,
                'end_date' => $contract->end_date,
                'description' => $contract->description,
            ],
        ]);
    }

    /**
     * ユーザー署名を保存
     */
    public function storeUserSignature(Request $request, string $contractId)
    {
        $request->validate([
            'signature_image' => 'required|string',
            'method' => 'required|in:canvas,upload,typed',
        ]);

        $contract = Contract::find($contractId);

        if (!$contract) {
            return back()->withErrors(['contract' => '契約書が見つかりません']);
        }

        if (!$contract->isAwaitingUserSignature()) {
            return back()->withErrors(['signature' => 'この契約書はユーザー署名が不要です']);
        }

        // 署名記録作成
        $signature = ContractSignature::create([
            'contract_id' => $contract->id,
            'signed_by_user' => $contract->user_id,
            'signature_image' => $request->signature_image,
            'signature_type' => 'user',
            'method' => $request->method,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status' => 'pending',
        ]);

        // 署名を確定
        $signature->markAsSigned();

        // キュー通知を送信（管理者に）
        ContractSignedNotificationJob::dispatch($contract, 'user_signed');

        return back()->with('success', '署名を送信しました。管理者の確認をお待ちください。');
    }

    /**
     * 管理者がユーザー署名を確認・検証
     */
    public function verifyUserSignature(Request $request, string $contractId): RedirectResponse
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'reason' => 'nullable|string|max:500',
        ]);

        $contract = Contract::find($contractId);

        if (!$contract) {
            return back()->withErrors(['contract' => '契約書が見つかりません']);
        }

        $userSignature = $contract->signatures()
            ->where('signature_type', 'user')
            ->latest()
            ->first();

        if (!$userSignature) {
            return back()->withErrors(['signature' => 'ユーザー署名が見つかりません']);
        }

        if ($request->action === 'approve') {
            $userSignature->verify();

            // Admin署名が不要な場合、完了
            if ($contract->signature_required_from === 'user') {
                $contract->update(['signature_status' => 'fully_signed']);
            }

            return back()->with('success', 'ユーザー署名を確認しました');
        } else {
            // 却下
            $userSignature->reject($request->reason);

            return back()->with('warning', 'ユーザー署名を却下しました。クライアントに通知されます。');
        }
    }

    /**
     * 管理者署名ページを表示
     */
    public function showAdminSignaturePage(Contract $contract): Response
    {
        $this->authorize('update', $contract);

        if (!$contract->isAwaitingAdminSignature()) {
            abort(403, 'この契約書は管理者署名が不要です');
        }

        return Inertia::render('Admin/Contracts/AdminSign', [
            'contract' => [
                'id' => $contract->id,
                'title' => $contract->title,
                'amount' => $contract->amount,
                'signature_status' => $contract->signature_status,
                'user_signed_at' => $contract->user_signed_at,
                'signatures' => $contract->signatures()->get(),
            ],
        ]);
    }

    /**
     * 管理者が署名を実行
     */
    public function storeAdminSignature(Request $request, string $contractId)
    {
        $request->validate([
            'signature_image' => 'required|string',
            'method' => 'required|in:canvas,upload,typed',
        ]);

        $contract = Contract::find($contractId);

        if (!$contract) {
            return back()->withErrors(['contract' => '契約書が見つかりません']);
        }

        if (!$contract->isAwaitingAdminSignature()) {
            return back()->withErrors(['signature' => 'この契約書は管理者署名が不要です']);
        }

        // 署名記録作成
        $signature = ContractSignature::create([
            'contract_id' => $contract->id,
            'signed_by_admin' => auth('admins')->id(),
            'signature_image' => $request->signature_image,
            'signature_type' => 'admin',
            'method' => $request->method,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status' => 'pending',
        ]);

        // 署名を確定
        $signature->markAsSigned();

        // 契約書ステータスを完全署名に更新
        $contract->update(['signature_status' => 'fully_signed']);

        // キュー通知を送信（クライアントに）
        ContractSignedNotificationJob::dispatch($contract, 'fully_signed');

        return back()->with('success', '契約書に署名し、クライアントに完了通知を送信しました');
    }

    /**
     * 署名を却下
     */
    public function rejectSignature(Request $request, string $contractId): RedirectResponse
    {
        $request->validate([
            'reason' => 'required|string|max:500',
            'signature_id' => 'required|string',
        ]);

        $contract = Contract::find($contractId);
        $signature = ContractSignature::find($request->signature_id);

        if (!$contract || !$signature || $signature->contract_id !== $contract->id) {
            return back()->withErrors(['signature' => '署名が見つかりません']);
        }

        // 署名を却下
        $signature->reject($request->reason);

        // 通知を送信
        ContractSignedNotificationJob::dispatch($contract, 'signature_rejected', $request->reason);

        return back()->with('warning', '署名を却下し、クライアントに通知しました');
    }
}
