<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon/favicon-48x48.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon-180x180.png">
    <link rel="manifest" href="/favicon/site.webmanifest">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    {{-- ダークモードはAdmin側専用機能。User側は常にlightモードのみで表示するため、
         Admin側ルート以外ではこの初期化スクリプト自体を出力しない。
         (localStorageはオリジン単位で共有されるため、Admin側で一度ダークモードを
         有効にすると、スクリプトを常時実行した場合User側にも'dark'クラスが漏れてしまう) --}}
    @if (request()->is('admin*'))
        <!-- ダークモード初期化スクリプト（flashを防ぐ） -->
        <script>
            (function() {
                try {
                    const darkMode = localStorage.getItem('admin-dark-mode');
                    if (darkMode === 'true') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                } catch (e) {
                    console.error('Dark mode initialization error:', e);
                }
            })();
        </script>
    @endif

    @unless (request()->is('admin') || request()->is('admin/*'))
        <style>
            #boot-splash{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:#f4f7f0;animation:ss-boot-fade .45s ease .95s forwards}
            #boot-splash svg{width:84px;height:auto;animation:ss-boot-pop .9s cubic-bezier(.16,.84,.44,1) both;filter:drop-shadow(0 18px 30px rgba(30,57,49,.18))}
            @keyframes ss-boot-pop{0%{opacity:0;transform:perspective(900px) translateZ(-260px) rotateY(-720deg) scale(.3)}55%{opacity:1;transform:perspective(900px) translateZ(60px) rotateY(0deg) scale(1.18)}78%{transform:perspective(900px) translateZ(0) rotateY(0deg) scale(.95)}100%{opacity:1;transform:perspective(900px) translateZ(0) rotateY(0deg) scale(1)}}
            @keyframes ss-boot-fade{from{opacity:1;visibility:visible}to{opacity:0;visibility:hidden;pointer-events:none}}
            @media (prefers-reduced-motion: reduce){#boot-splash{display:none}}
        </style>
    @endunless

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    {{-- 公開サイトの初回読み込み時だけ出す簡単な起動アニメーション（Inertiaでのページ遷移では出さない。
         CSSのみの疑似3D：ロゴがくるくる回りながら前に迫ってくる→定位置で収まる→フェードして消える）。
         本物の3D（Three.js）はトップのヒーローだけで使う重い処理のため、ここでは使わない --}}
    @unless (request()->is('admin') || request()->is('admin/*'))
        <div id="boot-splash" aria-hidden="true">
            {!! file_get_contents(resource_path('images/public/sprout-logo.svg')) !!}
        </div>
        <script>
            document.getElementById('boot-splash')?.addEventListener('animationend', function(event) {
                if (event.animationName === 'ss-boot-fade') this.remove();
            });
        </script>
    @endunless

    @inertia
</body>

</html>
