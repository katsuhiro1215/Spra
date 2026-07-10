<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ご見積ありがとうございます。アカウント作成のご案内</title>
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
            font-size: 14px;
            line-height: 1.8;
        }

        .button {
            text-align: center;
            margin: 30px 0;
        }

        .button a {
            display: inline-block;
            padding: 12px 30px;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }

        .info-box {
            background-color: #dbeafe;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 13px;
        }

        .info-box strong {
            color: #1e40af;
        }

        .steps {
            margin: 20px 0;
            font-size: 14px;
        }

        .steps ol {
            padding-left: 20px;
        }

        .steps li {
            margin-bottom: 10px;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #999;
            padding: 20px;
            border-top: 1px solid #eee;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>ご見積ありがとうございます</h1>
        </div>

        <div class="content">
            <div class="greeting">
                {{ $quoteResponse->email }} 様
            </div>

            <div class="message">
                <p>
                    ご依頼いただいたご見積をご確認いただきありがとうございます。<br>
                    ご了承いただきましたので、今後の円滑な進行のため、本サービスのアカウントをお作りいただきたくご案内いたします。
                </p>
            </div>

            <div class="message">
                <p>
                    以下のリンクからアカウントを作成し、会社情報を入力してください。<br>
                    入力いただいた情報は、弊社にて確認させていただきます。
                </p>
            </div>

            <div class="button">
                <a href="{{ route('quote.response.register', ['token' => $quoteResponse->token]) }}">
                    アカウント作成ページへ
                </a>
            </div>

            <div class="info-box">
                <strong>このリンクの有効期限：7日間</strong><br>
                期限を過ぎた場合は、お手数ですが別途ご連絡ください。
            </div>

            <div class="steps">
                <p><strong>次のステップ</strong></p>
                <ol>
                    <li>上記のリンクをクリック</li>
                    <li>アカウント情報（メール、パスワード）を入力</li>
                    <li>会社情報を入力</li>
                    <li>送信</li>
                    <li>弊社にて確認後、契約書をお送りいたします</li>
                </ol>
            </div>

            <div class="message">
                <p>
                    何かご不明な点がございましたら、お気軽にお問い合わせください。<br>
                    よろしくお願いいたします。
                </p>
            </div>
        </div>

        <div class="footer">
            <p>このメールに心当たりがない場合は、このメールを削除してください。</p>
        </div>
    </div>
</body>

</html>
