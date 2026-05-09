<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>管理者アカウント作成</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }

        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            margin: -30px -30px 30px -30px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .warning-box {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .credentials-box {
            background-color: #f8f9fa;
            border: 2px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }

        .credentials-box h2 {
            margin-top: 0;
            color: #667eea;
            font-size: 18px;
        }

        .credential-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 10px;
            background-color: #ffffff;
            border-radius: 4px;
        }

        .credential-label {
            font-weight: bold;
            color: #666;
        }

        .credential-value {
            font-family: 'Courier New', monospace;
            background-color: #e9ecef;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
        }

        .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
        }

        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            font-size: 12px;
            color: #6c757d;
            text-align: center;
        }

        .important {
            color: #dc3545;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>🔐 管理者アカウントが作成されました</h1>
        </div>

        <p>管理者アカウントが作成されました。<br>以下の認証情報でログインしてください。</p>

        <div class="credentials-box">
            <h2>ログイン情報</h2>
            <div class="credential-row">
                <span class="credential-label">メールアドレス:</span>
                <span class="credential-value">{{ $admin->email }}</span>
            </div>
            <div class="credential-row">
                <span class="credential-label">初期パスワード:</span>
                <span class="credential-value">{{ $password }}</span>
            </div>
        </div>

        <div class="warning-box">
            <p><span class="important">⚠️ 重要:</span></p>
            <ul>
                <li>このパスワードは<strong>一度しか表示されません</strong>。必ず控えてください。</li>
                <li>ログイン後、<strong>必ずパスワードを変更</strong>してください。</li>
                <li>セキュリティのため、このメールは削除せずに保管してください。</li>
            </ul>
        </div>

        <div style="text-align: center;">
            <a href="{{ $loginUrl }}" class="button">
                管理画面にログイン
            </a>
        </div>

        <div style="margin-top: 30px; padding: 15px; background-color: #e7f3ff; border-radius: 6px;">
            <p style="margin: 0; font-size: 14px;">
                <strong>💡 次のステップ:</strong>
            </p>
            <ol style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px;">
                <li>上記の認証情報でログイン</li>
                <li>プロフィール情報を入力</li>
                <li>パスワードを変更</li>
                <li>二要素認証を設定（推奨）</li>
            </ol>
        </div>

        <div class="footer">
            <p>このメールに心当たりがない場合は、システム管理者にお問い合わせください。</p>
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
