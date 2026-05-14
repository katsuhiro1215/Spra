<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Response;
use App\Services\ContactService;
use App\Services\ResponseService;
use App\Services\ResponseTemplateService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ResponseController extends Controller
{
    public function __construct(
        private ResponseService $responseService,
        private ContactService $contactService,
        private ResponseTemplateService $responseTemplateService
    ) {}

    /**
     * Display a listing of responses for a contact.
     */
    public function index(Contact $contact): InertiaResponse
    {
        $responses = $this->responseService->getByContact($contact->id);

        return Inertia::render('Admin/Contacts/Responses/Index', [
            'contact' => $contact->load(['assignedAdmin', 'responses']),
            'responses' => $responses,
        ]);
    }

    /**
     * Show the form for creating a new response.
     */
    public function create(Contact $contact): InertiaResponse
    {
        $templates = $this->responseTemplateService->getActive();

        return Inertia::render('Admin/Contacts/Responses/Create', [
            'contact' => $contact,
            'templates' => $templates,
            'categories' => $this->responseTemplateService->getCategories(),
            'placeholders' => $this->responseTemplateService->getAvailablePlaceholders(),
        ]);
    }

    /**
     * Store a newly created response (draft).
     */
    public function store(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'response_template_id' => 'nullable|exists:response_templates,id',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'send_now' => 'boolean',
        ]);

        try {
            $data = [
                'contact_id' => $contact->id,
                'response_template_id' => $validated['response_template_id'] ?? null,
                'admin_id' => auth('admins')->id(),
                'subject' => $validated['subject'],
                'body' => $validated['body'],
                'recipient_email' => $contact->email,
                'recipient_name' => $contact->name,
                'status' => 'draft',
                'created_by' => auth('admins')->id(),
            ];

            $response = $this->responseService->createResponse($data);

            // 即座に送信する場合
            if ($request->boolean('send_now')) {
                $this->responseService->sendResponse($response);
                return redirect()->route('admin.homepage.contacts.show', $contact)
                    ->with('success', '返答を送信しました。');
            }

            return redirect()->route('admin.homepage.contacts.show', $contact)
                ->with('success', '返答を下書き保存しました。');
        } catch (\Exception $e) {
            return back()->with('error', '返答の保存に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified response.
     */
    public function show(Contact $contact, Response $response): InertiaResponse
    {
        $response->load(['admin', 'responseTemplate', 'creator']);

        return Inertia::render('Admin/Contacts/Responses/Show', [
            'contact' => $contact,
            'response' => $response,
        ]);
    }

    /**
     * Show the form for editing the specified response.
     */
    public function edit(Contact $contact, Response $response)
    {
        // 送信済みの返答は編集できない
        if ($response->isSent()) {
            return redirect()->route('admin.homepage.contacts.show', $contact)
                ->with('error', '送信済みの返答は編集できません。');
        }

        $templates = $this->responseTemplateService->getActive();

        return Inertia::render('Admin/Contacts/Responses/Edit', [
            'contact' => $contact,
            'response' => $response,
            'templates' => $templates,
            'categories' => $this->responseTemplateService->getCategories(),
            'placeholders' => $this->responseTemplateService->getAvailablePlaceholders(),
        ]);
    }

    /**
     * Update the specified response.
     */
    public function update(Request $request, Contact $contact, Response $response)
    {
        // 送信済みの返答は編集できない
        if ($response->isSent()) {
            return back()->with('error', '送信済みの返答は編集できません。');
        }

        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        try {
            $this->responseService->updateResponse($response, $validated);

            return redirect()->route('admin.homepage.contacts.show', $contact)
                ->with('success', '返答を更新しました。');
        } catch (\Exception $e) {
            return back()->with('error', '返答の更新に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified response.
     */
    public function destroy(Contact $contact, Response $response)
    {
        try {
            $this->responseService->deleteResponse($response);

            return redirect()->route('admin.homepage.contacts.show', $contact)
                ->with('success', '返答を削除しました。');
        } catch (\Exception $e) {
            return back()->with('error', '返答の削除に失敗しました: ' . $e->getMessage());
        }
    }

    /**
     * Send the response email.
     */
    public function send(Contact $contact, Response $response)
    {
        // 既に送信済みの場合
        if ($response->isSent()) {
            return back()->with('error', 'この返答は既に送信済みです。');
        }

        try {
            $this->responseService->sendResponse($response);

            return redirect()->route('admin.homepage.contacts.show', $contact)
                ->with('success', '返答を送信しました。');
        } catch (\Exception $e) {
            return back()->with('error', '返答の送信に失敗しました: ' . $e->getMessage());
        }
    }
}
