<?php

namespace App\Services;

use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorTotpService
{
    private Google2FA $engine;

    public function __construct()
    {
        $this->engine = new Google2FA();
    }

    public function generateSecretKey(): string
    {
        return $this->engine->generateSecretKey();
    }

    /**
     * 認証アプリ（Google Authenticator等）で読み取るQRコードをSVGで生成する
     */
    public function getQrCodeSvg(string $issuer, string $email, string $secret): string
    {
        $otpauthUrl = $this->engine->getQRCodeUrl($issuer, $email, $secret);

        $renderer = new ImageRenderer(new RendererStyle(200), new SvgImageBackEnd());
        $writer = new Writer($renderer);

        return $writer->writeString($otpauthUrl);
    }

    /**
     * 入力コードをシークレットに対して検証する（前後1ステップ=30秒のズレを許容）
     */
    public function verify(string $secret, string $code): bool
    {
        return $this->engine->verifyKey($secret, $code, 1);
    }
}
