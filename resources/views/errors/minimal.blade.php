<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $status }} - {{ config('app.name', 'Laravel') }}</title>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0f172a;
            color: #e2e8f0;
            font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, "Hiragino Sans", "Noto Sans JP", sans-serif;
        }
        .card {
            text-align: center;
            padding: 2.5rem 2rem;
        }
        .code {
            font-size: 4rem;
            font-weight: 700;
            color: #6366f1;
            margin: 0 0 0.5rem;
        }
        .message {
            font-size: 1.125rem;
            margin: 0 0 1.5rem;
        }
        a {
            color: #a5b4fc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="card">
        <p class="code">{{ $status }}</p>
        <p class="message">{{ $message }}</p>
        <a href="/">トップページへ戻る</a>
    </div>
</body>
</html>
