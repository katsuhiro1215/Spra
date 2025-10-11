<?php

namespace App\Http\Controllers\Admin\Homepage;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Contact::with(['assignedAdmin']);

        // フィルタリング
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        // ソート
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $contacts = $query->paginate(20)->withQueryString();

        // 統計情報
        $stats = [
            'total' => Contact::count(),
            'new' => Contact::new()->count(),
            'in_progress' => Contact::inProgress()->count(),
            'resolved' => Contact::resolved()->count(),
            'recent' => Contact::recent()->count(),
        ];

        return Inertia::render('Admin/Homepage/Contacts/Index', [
            'contacts' => $contacts,
            'stats' => $stats,
            'filters' => $request->only(['status', 'category', 'search', 'sort_by', 'sort_order']) ?: [],
            'admins' => Admin::select('id', 'name')->get(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact): Response
    {
        $contact->load(['assignedAdmin']);

        return Inertia::render('Admin/Homepage/Contacts/Show', [
            'contact' => $contact,
            'admins' => Admin::select('id', 'name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:new,in_progress,resolved,closed',
            'admin_notes' => 'nullable|string',
            'assigned_to' => 'nullable|exists:admins,id',
        ]);

        $updateData = $request->only(['status', 'admin_notes', 'assigned_to']);

        // ステータスが解決済みまたはクローズの場合、responded_atを設定
        if (in_array($request->status, ['resolved', 'closed']) && !$contact->responded_at) {
            $updateData['responded_at'] = now();
        }

        $contact->update($updateData);

        return redirect()->back()->with('success', 'お問い合わせ情報を更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact): RedirectResponse
    {
        $contact->delete();

        return redirect()->route('admin.contacts.index')
            ->with('success', 'お問い合わせを削除しました。');
    }

    /**
     * Bulk update contacts status
     */
    public function bulkUpdate(Request $request): RedirectResponse
    {
        $request->validate([
            'contact_ids' => 'required|array',
            'contact_ids.*' => 'exists:contacts,id',
            'status' => 'required|in:new,in_progress,resolved,closed',
            'assigned_to' => 'nullable|exists:admins,id',
        ]);

        $updateData = ['status' => $request->status];

        if ($request->filled('assigned_to')) {
            $updateData['assigned_to'] = $request->assigned_to;
        }

        // ステータスが解決済みまたはクローズの場合、responded_atを設定
        if (in_array($request->status, ['resolved', 'closed'])) {
            $updateData['responded_at'] = now();
        }

        Contact::whereIn('id', $request->contact_ids)->update($updateData);

        $count = count($request->contact_ids);
        return redirect()->back()->with('success', "{$count}件のお問い合わせを更新しました。");
    }

    /**
     * Export contacts data
     */
    public function export(Request $request)
    {
        $query = Contact::with(['assignedAdmin']);

        // 同じフィルタリングロジックを適用
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        $contacts = $query->orderBy('created_at', 'desc')->get();

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
                $contact->id,
                $contact->name,
                $contact->email,
                $contact->phone,
                $contact->company,
                $contact->category_label,
                $contact->subject,
                $contact->message,
                $contact->status_label,
                $contact->assignedAdmin?->name,
                $contact->admin_notes,
                $contact->created_at?->format('Y-m-d H:i:s'),
                $contact->responded_at?->format('Y-m-d H:i:s'),
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
    }
}
