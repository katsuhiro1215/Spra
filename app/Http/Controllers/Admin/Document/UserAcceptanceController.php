<?php

namespace App\Http\Controllers\Admin\Document;

use App\Http\Controllers\Controller;
use App\Models\UserAcceptance;
use Inertia\Inertia;

class UserAcceptanceController extends Controller
{
    /**
     * ユーザーの同意記録一覧（閲覧のみ）
     */
    public function index()
    {
        $acceptances = UserAcceptance::with(['user:id,email', 'documentVersion.document'])
            ->latest('accepted_at')
            ->paginate(30);

        return Inertia::render('Admin/Documents/Acceptances', [
            'acceptances' => $acceptances,
        ]);
    }
}
