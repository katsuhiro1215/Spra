<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectInquiryRequest;
use App\Models\ProjectInquiry;
use App\Models\User;
use App\Models\Company;
use App\Models\Admin;
use App\Models\Quote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectInquiryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = ProjectInquiry::with(['user', 'company', 'assignedAdmin', 'quote']);

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('inquiry_code', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by status
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        // Filter by assigned admin
        if ($assignedAdmin = $request->input('assigned_admin')) {
            $query->where('assigned_admin_id', $assignedAdmin);
        }

        $inquiries = $query
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        $admins = Admin::select('id', 'name', 'email')->orderBy('name')->get();

        return Inertia::render('Admin/ProjectInquiries/Index', [
            'inquiries' => $inquiries,
            'admins' => $admins,
            'filters' => $request->only(['search', 'status', 'assigned_admin']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $users = User::select('id', 'name', 'email')->orderBy('name')->get();
        $companies = Company::select('id', 'name')->where('status', 'active')->orderBy('name')->get();
        $admins = Admin::select('id', 'name', 'email')->orderBy('name')->get();

        return Inertia::render('Admin/ProjectInquiries/Create', [
            'users' => $users,
            'companies' => $companies,
            'admins' => $admins,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectInquiryRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['inquiry_code'] = $this->generateInquiryCode();
        $data['created_by'] = auth('admins')->id();

        ProjectInquiry::create($data);

        return redirect()
            ->route('admin.project-inquiries.index')
            ->with('success', 'プロジェクト問い合わせを作成しました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjectInquiry $projectInquiry): Response
    {
        $projectInquiry->load(['user', 'company', 'assignedAdmin', 'quote', 'project']);

        return Inertia::render('Admin/ProjectInquiries/Show', [
            'inquiry' => $projectInquiry,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProjectInquiry $projectInquiry): Response
    {
        $users = User::select('id', 'name', 'email')->orderBy('name')->get();
        $companies = Company::select('id', 'name')->where('status', 'active')->orderBy('name')->get();
        $admins = Admin::select('id', 'name', 'email')->orderBy('name')->get();
        $quotes = Quote::select('id', 'quote_number', 'title')
            ->where('user_id', $projectInquiry->user_id)
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Admin/ProjectInquiries/Edit', [
            'inquiry' => $projectInquiry,
            'users' => $users,
            'companies' => $companies,
            'admins' => $admins,
            'quotes' => $quotes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProjectInquiryRequest $request, ProjectInquiry $projectInquiry): RedirectResponse
    {
        $projectInquiry->update($request->validated());

        return redirect()
            ->route('admin.project-inquiries.index')
            ->with('success', 'プロジェクト問い合わせを更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjectInquiry $projectInquiry): RedirectResponse
    {
        $projectInquiry->delete();

        return redirect()
            ->route('admin.project-inquiries.index')
            ->with('success', 'プロジェクト問い合わせを削除しました。');
    }

    /**
     * Generate unique inquiry code
     */
    private function generateInquiryCode(): string
    {
        $year = date('Y');
        $lastInquiry = ProjectInquiry::where('inquiry_code', 'like', "INQ{$year}-%")
            ->orderByDesc('inquiry_code')
            ->first();

        if ($lastInquiry) {
            $lastNumber = (int)substr($lastInquiry->inquiry_code, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return sprintf('INQ%s-%04d', $year, $newNumber);
    }
}
