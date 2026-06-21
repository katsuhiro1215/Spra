<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppointmentSlot;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentSlotController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(Request $request): Response
  {
    $filters = $request->only(['search', 'slot_type', 'status', 'assigned_admin_id', 'date_from', 'date_to']);
    $sort = [
      'field' => $request->get('sort', 'date'),
      'direction' => $request->get('direction', 'asc')
    ];

    $query = AppointmentSlot::query()
      ->with(['assignedAdmin.profile', 'appointments'])
      ->withCount(['appointments as active_bookings' => function ($query) {
        $query->whereIn('status', ['pending', 'confirmed']);
      }]);

    // 検索フィルター
    if (!empty($filters['search'])) {
      $search = $filters['search'];
      $query->where(function ($q) use ($search) {
        $q->where('notes', 'like', "%{$search}%")
          ->orWhereHas('assignedAdmin.profile', function ($q) use ($search) {
            $q->where('full_name', 'like', "%{$search}%");
          });
      });
    }

    // 予約タイプフィルター
    if (!empty($filters['slot_type'])) {
      $query->where('slot_type', $filters['slot_type']);
    }

    // ステータスフィルター
    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    // 担当者フィルター
    if (!empty($filters['assigned_admin_id'])) {
      $query->where('assigned_admin_id', $filters['assigned_admin_id']);
    }

    // 日付範囲フィルター
    if (!empty($filters['date_from'])) {
      $query->where('date', '>=', $filters['date_from']);
    }
    if (!empty($filters['date_to'])) {
      $query->where('date', '<=', $filters['date_to']);
    }

    // ソート
    $query->orderBy($sort['field'], $sort['direction']);
    if ($sort['field'] !== 'date') {
      $query->orderBy('date', 'asc')->orderBy('start_time', 'asc');
    } else {
      $query->orderBy('start_time', 'asc');
    }

    $appointmentSlots = $query->paginate(20)->withQueryString();

    // 選択肢データ
    $admins = Admin::with('profile')
      ->whereHas('profile')
      ->get()
      ->map(fn($admin) => [
        'value' => $admin->id,
        'label' => $admin->profile->full_name ?? $admin->email
      ]);

    $slotTypes = [
      ['value' => 'meeting', 'label' => '面談'],
      ['value' => 'progress_review', 'label' => '進捗会'],
      ['value' => 'consultation', 'label' => '相談'],
      ['value' => 'other', 'label' => 'その他'],
    ];

    $statuses = [
      ['value' => 'available', 'label' => '予約可能'],
      ['value' => 'blocked', 'label' => 'ブロック中'],
      ['value' => 'full', 'label' => '満席'],
    ];

    return Inertia::render('Admin/AppointmentSlots/Index', [
      'appointmentSlots' => $appointmentSlots,
      'admins' => $admins,
      'slotTypes' => $slotTypes,
      'statuses' => $statuses,
      'filters' => $filters,
      'sort' => $sort,
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create(): Response
  {
    $admins = Admin::with('profile')
      ->whereHas('profile')
      ->get()
      ->map(fn($admin) => [
        'value' => $admin->id,
        'label' => $admin->profile->full_name ?? $admin->email
      ]);

    $slotTypes = [
      ['value' => 'meeting', 'label' => '面談'],
      ['value' => 'progress_review', 'label' => '進捗会'],
      ['value' => 'consultation', 'label' => '相談'],
      ['value' => 'other', 'label' => 'その他'],
    ];

    return Inertia::render('Admin/AppointmentSlots/Create', [
      'admins' => $admins,
      'slotTypes' => $slotTypes,
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $validated = $request->validate([
      'date' => 'required|date',
      'start_time' => 'required|date_format:H:i',
      'end_time' => 'required|date_format:H:i|after:start_time',
      'slot_type' => 'required|in:meeting,progress_review,consultation,other',
      'max_capacity' => 'required|integer|min:1|max:100',
      'assigned_admin_id' => 'nullable|exists:admins,id',
      'status' => 'required|in:available,blocked',
      'notes' => 'nullable|string|max:1000',
    ]);

    try {
      $validated['current_bookings'] = 0;
      $validated['created_by'] = Auth::guard('admin')->id();

      $appointmentSlot = AppointmentSlot::create($validated);

      return redirect()->route('admin.appointment-slots.index')
        ->with('success', '予約枠が作成されました。');
    } catch (\Exception $e) {
      Log::error('AppointmentSlot store error: ' . $e->getMessage());
      return redirect()->back()
        ->withInput()
        ->with('error', '予約枠の作成に失敗しました。');
    }
  }

  /**
   * Display the specified resource.
   */
  public function show(AppointmentSlot $appointmentSlot): Response
  {
    $appointmentSlot->load([
      'assignedAdmin.profile',
      'appointments.user',
      'appointments.company',
      'appointments.project',
      'creator.profile',
      'updater.profile'
    ]);

    return Inertia::render('Admin/AppointmentSlots/Show', [
      'appointmentSlot' => $appointmentSlot,
    ]);
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(AppointmentSlot $appointmentSlot): Response
  {
    $admins = Admin::with('profile')
      ->whereHas('profile')
      ->get()
      ->map(fn($admin) => [
        'value' => $admin->id,
        'label' => $admin->profile->full_name ?? $admin->email
      ]);

    $slotTypes = [
      ['value' => 'meeting', 'label' => '面談'],
      ['value' => 'progress_review', 'label' => '進捗会'],
      ['value' => 'consultation', 'label' => '相談'],
      ['value' => 'other', 'label' => 'その他'],
    ];

    $statuses = [
      ['value' => 'available', 'label' => '予約可能'],
      ['value' => 'blocked', 'label' => 'ブロック中'],
    ];

    return Inertia::render('Admin/AppointmentSlots/Edit', [
      'appointmentSlot' => $appointmentSlot->load('assignedAdmin.profile'),
      'admins' => $admins,
      'slotTypes' => $slotTypes,
      'statuses' => $statuses,
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, AppointmentSlot $appointmentSlot)
  {
    $validated = $request->validate([
      'date' => 'required|date',
      'start_time' => 'required|date_format:H:i',
      'end_time' => 'required|date_format:H:i|after:start_time',
      'slot_type' => 'required|in:meeting,progress_review,consultation,other',
      'max_capacity' => 'required|integer|min:1|max:100',
      'assigned_admin_id' => 'nullable|exists:admins,id',
      'status' => 'required|in:available,blocked,full',
      'notes' => 'nullable|string|max:1000',
    ]);

    try {
      $validated['updated_by'] = Auth::guard('admin')->id();

      $appointmentSlot->update($validated);

      return redirect()->route('admin.appointment-slots.index')
        ->with('success', '予約枠が更新されました。');
    } catch (\Exception $e) {
      Log::error('AppointmentSlot update error: ' . $e->getMessage());
      return redirect()->back()
        ->withInput()
        ->with('error', '予約枠の更新に失敗しました。');
    }
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(AppointmentSlot $appointmentSlot)
  {
    try {
      // 予約がある場合は削除不可
      if ($appointmentSlot->appointments()->whereIn('status', ['pending', 'confirmed'])->exists()) {
        return redirect()->back()
          ->with('error', '予約が入っている予約枠は削除できません。');
      }

      $appointmentSlot->deleted_by = Auth::guard('admin')->id();
      $appointmentSlot->save();
      $appointmentSlot->delete();

      return redirect()->route('admin.appointment-slots.index')
        ->with('success', '予約枠が削除されました。');
    } catch (\Exception $e) {
      Log::error('AppointmentSlot destroy error: ' . $e->getMessage());
      return redirect()->back()
        ->with('error', '予約枠の削除に失敗しました。');
    }
  }
}
