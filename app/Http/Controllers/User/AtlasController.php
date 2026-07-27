<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AtlasController extends Controller
{
    /**
     * ログイン中ユーザーのAtlas会員資格を返す
     *
     * User側ダッシュボードの紹介カードから呼び出される。会員でない場合は member: false を返す。
     */
    public function me(Request $request): JsonResponse
    {
        $membership = $request->user('users')->atlasMembership;

        if (!$membership) {
            return response()->json(['member' => false]);
        }

        return response()->json([
            'member' => true,
            'brand' => $membership->brand,
            'status' => $membership->status,
            'room_url' => $membership->isActive() ? route('atlas.room') : route('atlas'),
        ]);
    }
}
