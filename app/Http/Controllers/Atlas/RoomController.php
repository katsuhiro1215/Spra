<?php

namespace App\Http\Controllers\Atlas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    /**
     * Private Room（会員限定コンテンツ）
     *
     * ルート側で 'auth:users' と 'atlas.member' を適用済みのため、
     * ここに到達する時点で有効なAtlas会員であることが保証されている。
     */
    public function index(Request $request): Response
    {
        $membership = $request->user('users')->atlasMembership;

        return Inertia::render('Public/AtlasRoom', [
            'brand' => $membership->brand,
            'email' => $request->user('users')->email,
            'consultationUrl' => route('consultation'),
        ]);
    }

    /**
     * ログイン済みだが会員資格がない/有効でない場合の案内
     */
    public function membershipRequired(Request $request): Response
    {
        $membership = $request->user('users')?->atlasMembership;

        return Inertia::render('Public/AtlasMembershipRequired', [
            'status' => $membership?->status,
        ]);
    }
}
