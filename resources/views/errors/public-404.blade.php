<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 - お探しのページが見つかりませんでした | {{ config('app.name', 'SmartSprouts') }}</title>
    <style>
        :root{--ink:#1e3931;--muted:#5a7065;--paper:#f4f7f0;--green:#3d7549;--lime:#d9ed8d}
        *{box-sizing:border-box}
        body{
            margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
            background:var(--paper);color:var(--ink);text-align:center;padding:40px 24px;
            font-family:"Noto Sans JP",-apple-system,BlinkMacSystemFont,"Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif;
        }
        .card{max-width:480px}
        .mark{width:64px;height:64px;margin:0 auto 28px}
        .code{font:600 15px/1 Arial,sans-serif;letter-spacing:.12em;color:var(--green);margin:0 0 14px}
        h1{font-size:clamp(22px,3vw,30px);font-weight:600;line-height:1.7;margin:0 0 16px}
        p{font-size:15px;line-height:2;color:var(--muted);margin:0 0 32px}
        .links{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
        a.button{
            display:inline-flex;align-items:center;gap:10px;border-radius:8px;background:var(--ink);
            color:#fff;padding:14px 24px;font-size:14px;font-weight:600;text-decoration:none;
        }
        a.text-link{
            display:inline-flex;align-items:center;gap:10px;color:var(--ink);font-size:14px;
            font-weight:600;text-decoration:none;padding:14px 4px;
        }
        a.text-link:hover,a.button:hover{opacity:.85}
    </style>
</head>
<body>
    <div class="card">
        <svg class="mark" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle cx="32" cy="32" r="31" fill="var(--lime)" opacity="0.5"/>
            <path d="M32 46V22" stroke="var(--green)" stroke-width="3" stroke-linecap="round"/>
            <path d="M32 24c0-8 6-13 14-13 0 8-6 13-14 13Z" fill="var(--green)"/>
            <path d="M32 30c0-7-5-12-13-12 0 7 5 12 13 12Z" fill="var(--green)"/>
        </svg>
        <p class="code">404 NOT FOUND</p>
        <h1>お探しのページが<br>見つかりませんでした。</h1>
        <p>URLが変更されたか、削除された可能性があります。<br>お手数ですが、トップページから改めてお探しください。</p>
        <div class="links">
            <a class="button" href="/">トップページへ</a>
            <a class="text-link" href="/contact">無料相談 →</a>
        </div>
    </div>
</body>
</html>
