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

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
