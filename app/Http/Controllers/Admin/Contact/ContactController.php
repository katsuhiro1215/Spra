<?php

namespace App\Http\Controllers\Admin\Contact;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Admin;
use App\Models\ContactCategory;
use App\Services\ContactService;
use App\Http\Requests\ContactRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

/**
 * Admin用お問い合わせコントローラー
 *
 * Service層を通じてお問い合わせの管理を実施
 */
class ContactController extends Controller
{
    public function __construct(
        private ContactService $contactService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['status', 'category', 'source', 'search']);
        $sort = [
            'field' => $request->get('sort_by', 'created_at'),
            'direction' => $request->get('sort_order', 'desc'),
        ];

        // Service層から取得
        $contacts = $this->contactService->getPaginatedForAdmin($filters, $sort, 20);
        $stats = $this->contactService->getStatsForAdmin();

        // カテゴリオプションを取得
        $categories = ContactCategory::where('is_active', true)
            ->orderBy('sort_order')
            ->select('id', 'name')
            ->get();

        return Inertia::render('Admin/Contact/Index', [
            'contacts' => $contacts,
            'stats' => $stats,
            'filters' => $filters,
            'categories' => $categories,
            'admins' => Admin::select('id', 'email')->get(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact): Response
    {
        // リレーション読み込み
        $contact->load([
            'assignedAdmin',
            'contactCategory',
            'responses.admin',
            'quotes',
            'invitations.invitedBy',
            'invitations.user',
        ]);

        return Inertia::render('Admin/Contact/Show', [
            'contact' => $contact,
            'admins' => Admin::select('id', 'email')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ContactRequest $request, Contact $contact): RedirectResponse
    {
        try {
            $this->contactService->updateContact($contact, $request->validated());

            return redirect()->back()->with('success', 'お問い合わせ情報を更新しました。');
        } catch (\Exception $e) {
            Log::error('Contact update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', 'お問い合わせの更新に失敗しました。');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact): RedirectResponse
    {
        try {
            $this->contactService->deleteContact($contact);

            return redirect()->route('admin.contact.index')
                ->with('success', 'お問い合わせを削除しました。');
        } catch (\Exception $e) {
            Log::error('Contact delete error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'お問い合わせの削除に失敗しました。');
        }
    }

    /**
     * Bulk update contacts status
     */
    public function bulkUpdate(Request $request): RedirectResponse
    {
        try {
            $request->validate([
                'contact_ids' => 'required|array',
                'contact_ids.*' => 'exists:contacts,id',
                'status' => 'required|in:new,in_progress,replied,resolved,closed',
                'assigned_to' => 'nullable|exists:admins,id',
            ]);

            $updateData = ['status' => $request->status];

            if ($request->filled('assigned_to')) {
                $updateData['assigned_to'] = $request->assigned_to;
            }

            // Service層で一括更新
            $count = $this->contactService->bulkUpdateStatus(
                $request->contact_ids,
                $updateData
            );

            return redirect()->back()->with('success', "{$count}件のお問い合わせを更新しました。");
        } catch (\Exception $e) {
            Log::error('Contact bulk update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', 'お問い合わせの一括更新に失敗しました。');
        }
    }

    /**
     * Export contacts data
     */
    public function export(Request $request)
    {
        try {
            $filters = $request->only(['status', 'category', 'source', 'search']);
            $sort = [
                'field' => $request->get('sort_by', 'created_at'),
                'direction' => 'desc',
            ];

            // Service層からエクスポート用データを取得
            $contacts = $this->contactService->getForExport($filters, $sort);

            $csvData = [];
            $csvData[] = [
                'ID',
                '名前',
                'メール',
                '電話番号',
                '会社名',
                'カテゴリ',
                '件名',
                'メッセージ',
                'ステータス',
                '担当者',
                '管理者メモ',
                '作成日',
                '返信日'
            ];

            foreach ($contacts as $contact) {
                $csvData[] = [
                    $contact['id'],
                    $contact['name'],
                    $contact['email'],
                    $contact['phone'],
                    $contact['company'],
                    Contact::find($contact['id'])?->category_label,
                    $contact['subject'],
                    $contact['message'],
                    Contact::find($contact['id'])?->status_label,
                    $contact['assigned_admin']['name'] ?? '',
                    $contact['admin_notes'],
                    $contact['created_at'],
                    $contact['responded_at'],
                ];
            }

            $filename = 'contacts_' . now()->format('Y_m_d_H_i_s') . '.csv';

            $handle = fopen('php://temp', 'w+');
            foreach ($csvData as $row) {
                fputcsv($handle, $row);
            }
            rewind($handle);
            $csvContent = stream_get_contents($handle);
            fclose($handle);

            return response($csvContent)
                ->header('Content-Type', 'text/csv')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
        } catch (\Exception $e) {
            Log::error('Contact export error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'お問い合わせのエクスポートに失敗しました。');
        }
    }
}
