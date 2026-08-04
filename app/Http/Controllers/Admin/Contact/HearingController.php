<?php

namespace App\Http\Controllers\Admin\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\HearingRequest;
use App\Models\Contact;
use App\Models\Hearing;
use App\Services\HearingService;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;

class HearingController extends Controller
{
    public function __construct(
        private HearingService $hearingService
    ) {}

    /**
     * Show the form for creating a new hearing.
     */
    public function create(Contact $contact): InertiaResponse
    {
        return Inertia::render('Admin/Hearing/Create', [
            'contact' => $contact,
            'groupedItems' => $this->hearingService->getGroupedTemplateItems(),
        ]);
    }

    /**
     * Store a newly created hearing.
     */
    public function store(HearingRequest $request, Contact $contact): RedirectResponse
    {
        $validated = $request->validated();

        try {
            $hearing = $this->hearingService->createWithAnswers([
                'contact_id' => $contact->id,
                'quote_id' => $validated['quote_id'] ?? null,
                'title' => $validated['title'],
                'notes' => $validated['notes'] ?? null,
                'created_by' => auth('admins')->id(),
            ], $validated['answers'] ?? []);

            return redirect()
                ->route('admin.contact.hearing.show', ['contact' => $contact->id, 'hearing' => $hearing->id])
                ->with('success', __('messages.created', ['attribute' => 'ヒアリング']));
        } catch (\Exception $e) {
            return back()->with('error', __('messages.action_failed_detail', ['attribute' => 'ヒアリングの作成', 'message' => $e->getMessage()]))
                ->withInput();
        }
    }

    /**
     * Display the specified hearing.
     */
    public function show(Contact $contact, Hearing $hearing): InertiaResponse
    {
        $hearing->load(['creator.profile', 'quote', 'answers.templateItem']);

        return Inertia::render('Admin/Hearing/Show', [
            'contact' => $contact,
            'hearing' => $hearing,
        ]);
    }

    /**
     * Show the form for editing the specified hearing.
     */
    public function edit(Contact $contact, Hearing $hearing): InertiaResponse
    {
        $hearing->load(['answers']);

        return Inertia::render('Admin/Hearing/Edit', [
            'contact' => $contact,
            'hearing' => $hearing,
            'groupedItems' => $this->hearingService->getGroupedTemplateItems(),
        ]);
    }

    /**
     * Update the specified hearing.
     */
    public function update(HearingRequest $request, Contact $contact, Hearing $hearing): RedirectResponse
    {
        $validated = $request->validated();

        try {
            $this->hearingService->updateWithAnswers($hearing, [
                'quote_id' => $validated['quote_id'] ?? null,
                'title' => $validated['title'],
                'notes' => $validated['notes'] ?? null,
            ], $validated['answers'] ?? []);

            return redirect()
                ->route('admin.contact.hearing.show', ['contact' => $contact->id, 'hearing' => $hearing->id])
                ->with('success', __('messages.updated', ['attribute' => 'ヒアリング']));
        } catch (\Exception $e) {
            return back()->with('error', __('messages.action_failed_detail', ['attribute' => 'ヒアリングの更新', 'message' => $e->getMessage()]))
                ->withInput();
        }
    }

    /**
     * Remove the specified hearing.
     */
    public function destroy(Contact $contact, Hearing $hearing): RedirectResponse
    {
        try {
            $this->hearingService->delete($hearing);

            return redirect()->route('admin.contact.show', $contact)
                ->with('success', __('messages.deleted', ['attribute' => 'ヒアリング']));
        } catch (\Exception $e) {
            return back()->with('error', __('messages.action_failed_detail', ['attribute' => 'ヒアリングの削除', 'message' => $e->getMessage()]));
        }
    }
}
