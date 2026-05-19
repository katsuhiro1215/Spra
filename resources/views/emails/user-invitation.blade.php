<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>アカウント作成のご案内</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }

        .content {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 16px;
            margin-bottom: 20px;
        }

        .message {
            margin-bottom: 30px;
            line-height: 1.8;
        }

        .button-container {
            text-align: center;
            margin: 30px 0;
        }

        .button {
            display: inline-block;
            padding: 14px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s;
        }

        .button:hover {
            transform: translateY(-2px);
        }

        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .info-box strong {
            color: #667eea;
        }

        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            font-size: 13px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
        }

        .footer p {
            margin: 5px 0;
        }

        .security-notice {
            margin-top: 30px;
            padding: 15px;
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            border-radius: 4px;
            font-size: 14px;
        }

        .link-text {
            word-break: break-all;
            color: #667eea;
            font-size: 14px;
            margin-top: 15px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>🎉 アカウント作成のご案内</h1>
        </div>

        <div class="content">
            <div class="greeting">
                {{ $contact->name }} 様
            </div>

            <div class="message">
                <p>いつもお世話になっております。<br>Smart Sprouts運営チームでございます。</p>

                <p>この度は、お問い合わせいただきありがとうございます。<br>
                    正式な見積もりやプロジェクト管理をスムーズに進めるため、専用アカウントの作成をご案内させていただきます。</p>
            </div>

            <div class="info-box">
                <strong>アカウント作成のメリット：</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>プロジェクトの進捗状況をリアルタイムで確認</li>
                    <li>見積もりや請求書の管理が簡単に</li>
                    <li>担当者との円滑なコミュニケーション</li>
                    <li>過去のお問い合わせ履歴の確認</li>
                </ul>
            </div>

            <div class="button-container">
                <a href="{{ $invitationUrl }}" class="button">
                    アカウントを作成する
                </a>
            </div>

            <div class="link-text">
                ボタンが動作しない場合は、以下のURLをコピーしてブラウザに貼り付けてください：<br>
                <a href="{{ $invitationUrl }}">{{ $invitationUrl }}</a>
            </div>

            <div class="info-box" style="margin-top: 25px;">
                <strong>📅 有効期限：</strong> {{ $expiresAt }}<br>
                <strong>✉️ 登録メールアドレス：</strong> {{ $invitation->email }}
            </div>

            <div class="security-notice">
                <strong>⚠️ セキュリティについて</strong><br>
                このリンクは一度のみ使用可能です。第三者と共有しないでください。<br>
                心当たりのない場合は、このメールを無視していただいて構いません。
            </div>

            <div class="message" style="margin-top: 30px;">
                <p>ご不明な点がございましたら、お気軽にお問い合わせください。<br>
                    今後ともよろしくお願いいたします。</p>
            </div>
        </div>

        <div class="footer">
            <p><strong>Smart Sprouts</strong></p>
            <p>このメールは自動送信されています。</p>
            <p>このメールへの返信はできません。お問い合わせは公式サイトからお願いいたします。</p>
        </div>
    </div>
</body>

</html>
