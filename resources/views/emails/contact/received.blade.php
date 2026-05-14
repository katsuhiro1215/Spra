@component('mail::message')
    # お問い合わせを受け付けました

    {{ $contact->name }} 様

    この度は、{{ config('app.name') }}へお問い合わせいただき、誠にありがとうございます。

    以下の内容でお問い合わせを受け付けました。

    ---

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

    担当者より2営業日以内にご返信させていただきます。
    今しばらくお待ちくださいませ。

    なお、このメールは自動送信されています。
    このメールへの返信はできませんので、予めご了承ください。

    @component('mail::panel')
        ご不明な点がございましたら、お気軽にお問い合わせください。
    @endcomponent

    お問い合わせありがとうございました。

    {{ config('app.name') }}
@endcomponent
