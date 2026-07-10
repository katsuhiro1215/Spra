<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>お問い合わせ受付</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .content {
            padding: 30px;
        }

        .greeting {
            font-size: 16px;
            margin-bottom: 20px;
        }

        .info-section {
            background-color: #f9f9f9;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .info-row {
            display: grid;
            grid-template-columns: 150px 1fr;
            gap: 20px;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }

        .info-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .info-label {
            font-weight: bold;
            color: #667eea;
        }

        .info-value {
            word-break: break-word;
        }

        .message-content {
            background-color: #fff;
            border: 1px solid #e0e0e0;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
            white-space: pre-wrap;
            word-break: break-word;
        }

        .message-header {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }

        .notice {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }

        .notice strong {
            display: block;
            margin-bottom: 5px;
        }

        .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
        }

        .footer p {
            margin: 8px 0;
        }

        .button-group {
            text-align: center;
            margin: 25px 0;
        }

        .button {
            display: inline-block;
            background-color: #667eea;
            color: white;
            padding: 12px 30px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
        }

        .button:hover {
            background-color: #5568d3;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- ヘッダー -->
        <div class="header">
            <h1>✓ お問い合わせを受け付けました</h1>
        </div>

        <!-- コンテンツ -->
        <div class="content">
            <div class="greeting">
                <p>{{ $contact->name }} 様</p>
                <p>いつもご利用いただき、誠にありがとうございます。<br>
                    このたびは {{ config('app.name') }} へお問い合わせいただき、ありがとうございます。</p>
            </div>

            <p>以下の内容でお問い合わせを受け付けました。</p>

            <!-- 情報セクション -->
            <div class="info-section">
                <div class="info-row">
                    <div class="info-label">氏名</div>
                    <div class="info-value">{{ $contact->name }}</div>
                </div>

                <div class="info-row">
                    <div class="info-label">メールアドレス</div>
                    <div class="info-value">{{ $contact->email }}</div>
                </div>

                @if ($contact->phone)
                    <div class="info-row">
                        <div class="info-label">電話番号</div>
                        <div class="info-value">{{ $contact->phone }}</div>
                    </div>
                @endif

                @if ($contact->company)
                    <div class="info-row">
                        <div class="info-label">会社名</div>
                        <div class="info-value">{{ $contact->company }}</div>
                    </div>
                @endif

                <div class="info-row">
                    <div class="info-label">件名</div>
                    <div class="info-value"><strong>{{ $contact->subject }}</strong></div>
                </div>
            </div>

            <!-- メッセージ -->
            <div class="message-header">お問い合わせ内容</div>
            <div class="message-content">{{ $contact->message }}</div>

            <!-- 注意事項 -->
            <div class="notice">
                <strong>📝 お知らせ</strong>
                <p>担当者より2営業日以内にご返信させていただきます。</p>
                <p style="margin: 0;">このメールへのご返信はできませんのでご了承ください。</p>
            </div>

            <!-- ボタン -->
            <div class="button-group">
                <a href="{{ route('contact.index') }}" class="button">お問い合わせ一覧へ</a>
            </div>
        </div>

        <!-- フッター -->
        <div class="footer">
            <p><strong>{{ config('app.name') }}</strong></p>
            <p>このメールは自動送信されています</p>
            <p>© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
