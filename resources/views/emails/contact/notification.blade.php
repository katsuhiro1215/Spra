@component('mail::message')
    # 新規お問い合わせが届きました

    {{ config('app.name') }}に新しいお問い合わせが届きました。

    ---

    **お問い合わせID**
    {{ $contact->id }}

    **受信日時**
    {{ $contact->created_at->format('Y年m月d日 H:i') }}

    **お名前**
    {{ $contact->name }}

    **メールアドレス**
    {{ $contact->email }}

    @if ($contact->phone)
        **電話番号**
        {{ $contact->phone }}
    @endif

    @if ($contact->company)
        **会社名**
        {{ $contact->company }}
    @endif

    **件名**
    {{ $contact->subject }}

    **お問い合わせ内容**
    {{ $contact->message }}

    ---

    **流入元情報**

    **ソース**
    {{ $contact->source }}

    **IPアドレス**
    {{ $contact->ip }}

    @if ($contact->referrer)
        **リファラー**
        {{ $contact->referrer }}
    @endif

    ---

    @component('mail::button', ['url' => route('admin.contact.show', $contact->id)])
        お問い合わせを確認する
    @endcomponent

    {{ config('app.name') }} 管理システム
@endcomponent
