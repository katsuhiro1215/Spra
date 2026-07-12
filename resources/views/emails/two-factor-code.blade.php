<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: sans-serif; line-height: 1.6; margin: 20px; color: #1f2937;">
    <p>認証コードは以下の通りです。</p>
    <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 24px 0;">{{ $code }}</p>
    <p>このコードは発行から{{ \App\Models\OneTimePassword::VALID_MINUTES }}分間有効です。</p>
    <p style="color: #6b7280; font-size: 13px;">このメールに心当たりがない場合は、第三者がログインを試みた可能性があります。パスワードの変更をご検討ください。</p>
</body>
</html>
