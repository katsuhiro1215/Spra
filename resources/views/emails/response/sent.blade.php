<x-mail::message>
    # {{ $response->subject }}

    {{ $contact->name }} 様

    {!! nl2br(e($response->body)) !!}

    ---

    このメールは {{ $contact->email }} 宛に送信されました。

    @if ($admin)
        担当者: {{ $admin->profile->full_name ?? $admin->email }}
    @endif

    お問い合わせ内容について、ご不明な点がございましたら、お気軽にご返信ください。

    {{ config('app.name') }}
</x-mail::message>
