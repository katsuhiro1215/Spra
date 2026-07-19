<?php

return [

    /*
     * 認証済みの管理者であれば role/権限に関係なく常にアクセスできるルート（admin.プレフィックスを除いたルート名）。
     * ここに列挙したものは permissions テーブルへの登録対象外。
     */
    'whitelist' => [
        'dashboard',
        'profile.edit',
        'profile.update',
        'profile.destroy',
        'security.edit',
        'security.update',
        'security.totp.setup',
        'security.totp.confirm',
        'security.recovery-codes.regenerate',
        'notifications.read',
        'notifications.read-all',
        'content.index',
        // 出退勤の打刻・自分の勤怠状況閲覧はロール・権限に関係なく全管理者が行える
        'attendance.index',
        'attendance.clock-in',
        'attendance.clock-out',
        // 権限管理画面自体は isSuperAdmin() チェックで別途保護するため権限カタログの対象外にする
        'permissions.index',
        'permissions.update',
        'permissionOverrides.update',
    ],

    /*
     * ルート名の末尾セグメント（アクション名）→ 表示ラベルの変換辞書。
     * 辞書に無いアクション名はそのまま表示する。
     */
    'action_labels' => [
        'index' => '一覧表示',
        'create' => '新規作成フォーム',
        'store' => '作成',
        'show' => '詳細表示',
        'edit' => '編集フォーム',
        'update' => '更新',
        'destroy' => '削除',
        'restore' => '復元',
    ],

    /*
     * ロールのデフォルト権限セットを決めるヒューリスティック。
     * admin ロールから除外するアクション名（末尾セグメントの完全一致。bulk-destroy等は対象外）。
     * editor ロールは index/show のみ許可。
     */
    'admin_role_excluded_actions' => [
        'destroy',
    ],
    'editor_role_allowed_actions' => [
        'index',
        'show',
    ],
];
