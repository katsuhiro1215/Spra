<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnalyticsEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Jenssegers\Agent\Agent;

class AnalyticsEventController extends Controller
{
    /**
     * 公開サイトからの匿名イベント(pageview等)を記録する
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => ['nullable', 'string', 'max:100'],
            'event_type' => ['nullable', 'string', 'max:50'],
            'url' => ['required', 'string', 'max:2048'],
            'referrer_url' => ['nullable', 'string', 'max:2048'],
            'utm_source' => ['nullable', 'string', 'max:255'],
            'utm_medium' => ['nullable', 'string', 'max:255'],
            'utm_campaign' => ['nullable', 'string', 'max:255'],
            'utm_term' => ['nullable', 'string', 'max:255'],
            'utm_content' => ['nullable', 'string', 'max:255'],
        ]);

        $agent = new Agent();
        $agent->setUserAgent($request->userAgent());

        $deviceType = match (true) {
            $agent->isMobile() => 'mobile',
            $agent->isTablet() => 'tablet',
            default => 'desktop',
        };

        AnalyticsEvent::create([
            'session_id' => $validated['session_id'] ?? null,
            'visitor_hash' => $this->buildVisitorHash($request),
            'event_type' => $validated['event_type'] ?? AnalyticsEvent::TYPE_PAGEVIEW,
            'url' => $validated['url'],
            'referrer_url' => $validated['referrer_url'] ?? null,
            'utm_source' => $validated['utm_source'] ?? null,
            'utm_medium' => $validated['utm_medium'] ?? null,
            'utm_campaign' => $validated['utm_campaign'] ?? null,
            'utm_term' => $validated['utm_term'] ?? null,
            'utm_content' => $validated['utm_content'] ?? null,
            'device_type' => $deviceType,
            'browser' => $agent->browser(),
            'platform' => $agent->platform(),
            'occurred_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * IP・UA・日付から匿名の訪問者ハッシュを生成する（生IPは保存しない）
     */
    private function buildVisitorHash(Request $request): string
    {
        $raw = $request->ip() . '|' . $request->userAgent() . '|' . now()->toDateString();

        return hash('sha256', $raw);
    }
}
