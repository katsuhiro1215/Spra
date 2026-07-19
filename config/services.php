<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'search_console' => [
        // 'dummy'（デフォルト）または 'google'。本番移行時に 'google' へ切り替える
        'driver' => env('SEARCH_CONSOLE_DRIVER', 'dummy'),
        'site_url' => env('SEARCH_CONSOLE_SITE_URL'),
        // サービスアカウントJSON鍵のパス（'google'ドライバ用、未実装）
        'credentials_path' => env('SEARCH_CONSOLE_CREDENTIALS_PATH'),
    ],

    'instagram' => [
        'app_id' => env('INSTAGRAM_APP_ID'),
        'app_secret' => env('INSTAGRAM_APP_SECRET'),
        'page_access_token' => env('INSTAGRAM_PAGE_ACCESS_TOKEN'),
        // Webhook購読設定時にMeta側で指定する検証用トークン
        'verify_token' => env('INSTAGRAM_VERIFY_TOKEN'),
    ],

];
