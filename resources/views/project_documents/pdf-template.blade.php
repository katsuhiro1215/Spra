<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <title>{{ $document->display_title }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        body {
            font-size: 12px;
            line-height: 1.6;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }

        h1 {
            font-size: 18px;
            margin: 10px 0;
        }

        .meta {
            font-size: 11px;
            color: #666;
        }

        h2 {
            font-size: 14px;
            margin: 18px 0 8px 0;
            padding: 5px;
            background-color: #f0f0f0;
            border-bottom: 1px solid #000;
        }

        .body-text {
            white-space: pre-wrap;
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        th, td {
            border: 1px solid #999;
            padding: 4px 6px;
            font-size: 11px;
            text-align: left;
            vertical-align: top;
        }

        th {
            background-color: #eee;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>{{ $document->display_title }}</h1>
        <div class="meta">
            v{{ $version->version }}
            @if ($version->status === 'released')
                （確定版・{{ optional($version->released_at)->format('Y年m月d日') }}）
            @else
                （下書き）
            @endif
            ／出力日: {{ $generatedAt }}
        </div>
    </div>

    @foreach ($version->sections as $section)
        <h2>{{ $section->title }}</h2>

        @if ($section->section_type === 'text')
            <div class="body-text">{{ $section->body }}</div>
        @elseif ($section->section_type === 'db_table')
            <table>
                <thead>
                    <tr>
                        <th>カラム名</th>
                        <th>型</th>
                        <th>NULL</th>
                        <th>デフォルト</th>
                        <th>PK</th>
                        <th>参照先</th>
                        <th>コメント</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($section->columns as $column)
                        <tr>
                            <td>{{ $column->name }}</td>
                            <td>{{ $column->data_type }}{{ $column->length ? "({$column->length})" : '' }}</td>
                            <td>{{ $column->nullable ? '○' : '-' }}</td>
                            <td>{{ $column->default_value }}</td>
                            <td>{{ $column->is_primary_key ? 'PK' : '' }}{{ $column->is_unique ? ' UNIQUE' : '' }}</td>
                            <td>{{ $column->references_table ? "{$column->references_table}.{$column->references_column}" : '' }}</td>
                            <td>{{ $column->comment }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @elseif ($section->section_type === 'api_group')
            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Path</th>
                        <th>概要</th>
                        <th>ステータス</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($section->endpoints as $endpoint)
                        <tr>
                            <td>{{ $endpoint->http_method }}</td>
                            <td>{{ $endpoint->path }}</td>
                            <td>{{ $endpoint->summary }}</td>
                            <td>{{ $endpoint->status_codes }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @elseif ($section->section_type === 'feature_list')
            <table>
                <thead>
                    <tr>
                        <th>機能名</th>
                        <th>説明</th>
                        <th>関連画面</th>
                        <th>優先度</th>
                        <th>状態</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($section->features as $feature)
                        <tr>
                            <td>{{ $feature->name }}</td>
                            <td>{{ $feature->description }}</td>
                            <td>{{ $feature->related_screen }}</td>
                            <td>{{ \App\Models\ProjectDocumentSectionFeature::PRIORITIES[$feature->priority] ?? $feature->priority }}</td>
                            <td>{{ \App\Models\ProjectDocumentSectionFeature::STATUSES[$feature->status] ?? $feature->status }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @elseif ($section->section_type === 'screen_list')
            <table>
                <thead>
                    <tr>
                        <th>画面名</th>
                        <th>パス</th>
                        <th>説明</th>
                        <th>関連機能</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($section->screens as $screen)
                        <tr>
                            <td>{{ $screen->screen_name }}</td>
                            <td>{{ $screen->path }}</td>
                            <td>{{ $screen->description }}</td>
                            <td>{{ $screen->related_features }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @elseif ($section->section_type === 'permission_list')
            <table>
                <thead>
                    <tr>
                        <th>ロール</th>
                        <th>権限</th>
                        <th>説明</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($section->permissions as $permission)
                        <tr>
                            <td>{{ $permission->role_name }}</td>
                            <td>{{ $permission->permission }}</td>
                            <td>{{ $permission->description }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    @endforeach
</body>

</html>
