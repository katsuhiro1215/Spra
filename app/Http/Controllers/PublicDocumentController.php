<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PublicDocumentController extends Controller
{
    /**
     * 公開サイトの規約・ポリシー文書(Document + 有効バージョン)
     */
    public function show(string $slug): InertiaResponse
    {
        $document = Document::where('slug', $slug)->firstOrFail();

        abort_unless($document->activeVersion, 404);

        return Inertia::render('Public/Document', [
            'document' => [
                'title' => $document->title,
                'description' => $document->description,
                'content' => $document->activeVersion->content,
                'version' => $document->activeVersion->version,
                'effective_date' => $document->activeVersion->effective_date,
            ],
        ]);
    }

    /**
     * プライバシーポリシー(固定slug)
     */
    public function privacyPolicy(): InertiaResponse
    {
        return $this->show('privacy-policy');
    }

    /**
     * 利用規約(固定slug)
     */
    public function terms(): InertiaResponse
    {
        return $this->show('terms-of-service');
    }
}
