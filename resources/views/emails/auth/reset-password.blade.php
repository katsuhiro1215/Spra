<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>パスワード再設定のご案内</title>
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
        }

        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
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
            <h1>🔑 パスワード再設定のご案内</h1>
        </div>

        <div class="content">
            <div class="message">
                <p>パスワード再設定のリクエストを受け付けました。<br>
                    下のボタンから新しいパスワードを設定してください。</p>
            </div>

            <div class="button-container">
                <a href="{{ $url }}" class="button">
                    パスワードを再設定する
                </a>
            </div>

            <div class="link-text">
                ボタンが動作しない場合は、以下のURLをコピーしてブラウザに貼り付けてください：<br>
                <a href="{{ $url }}">{{ $url }}</a>
            </div>

            <div class="info-box">
                <strong>⏱ 有効期限：</strong> このリンクは発行から{{ $expireMinutes }}分間有効です。
            </div>

            <div class="security-notice">
                <strong>⚠️ セキュリティについて</strong><br>
                このメールに心当たりがない場合は、お手数ですが無視してください。パスワードは変更されません。
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
