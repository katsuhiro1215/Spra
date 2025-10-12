<?php

return [

    /*
    |--------------------------------------------------------------------------
    | バリデーション言語行
    |--------------------------------------------------------------------------
    |
    | 以下の言語行はバリデータークラスによって使用されるデフォルトのエラー
    | メッセージを含んでいます。サイズルールのように、これらのルールの中には
    | 複数のバージョンを持つものがあります。ここでそれぞれのメッセージを
    | 自由に調整してください。
    |
    */

    'accepted' => ':attributeを承認してください。',
    'accepted_if' => ':otherが:valueの場合、:attributeを承認してください。',
    'active_url' => ':attributeは有効なURLではありません。',
    'after' => ':attributeは:dateより後の日付にしてください。',
    'after_or_equal' => ':attributeは:date以降の日付にしてください。',
    'alpha' => ':attributeには英字のみ使用してください。',
    'alpha_dash' => ':attributeには英数字とダッシュ(-)、アンダースコア(_)のみ使用してください。',
    'alpha_num' => ':attributeには英数字のみ使用してください。',
    'array' => ':attributeは配列でなければなりません。',
    'ascii' => ':attributeには半角英数字と記号のみ使用してください。',
    'before' => ':attributeは:dateより前の日付にしてください。',
    'before_or_equal' => ':attributeは:date以前の日付にしてください。',
    'between' => [
        'array' => ':attributeは:min個から:max個までの項目を指定してください。',
        'file' => ':attributeは:minキロバイトから:maxキロバイトまでのファイルを選択してください。',
        'numeric' => ':attributeは:minから:maxまでの数値を指定してください。',
        'string' => ':attributeは:min文字から:max文字までの文字列を入力してください。',
    ],
    'boolean' => ':attributeはtrueまたはfalseを指定してください。',
    'can' => ':attributeには許可されていない値が含まれています。',
    'confirmed' => ':attributeと確認用の値が一致しません。',
    'current_password' => 'パスワードが正しくありません。',
    'date' => ':attributeは有効な日付ではありません。',
    'date_equals' => ':attributeは:dateと同じ日付にしてください。',
    'date_format' => ':attributeは:format形式で入力してください。',
    'decimal' => ':attributeは:decimal桁の小数を指定してください。',
    'declined' => ':attributeを拒否してください。',
    'declined_if' => ':otherが:valueの場合、:attributeを拒否してください。',
    'different' => ':attributeと:otherは異なる値を指定してください。',
    'digits' => ':attributeは:digits桁の数字を入力してください。',
    'digits_between' => ':attributeは:min桁から:max桁までの数字を入力してください。',
    'dimensions' => ':attributeの画像サイズが無効です。',
    'distinct' => ':attributeに重複した値があります。',
    'doesnt_end_with' => ':attributeは次の値で終わってはいけません: :values',
    'doesnt_start_with' => ':attributeは次の値で始まってはいけません: :values',
    'email' => ':attributeには有効なメールアドレスを入力してください。',
    'ends_with' => ':attributeは次の値のいずれかで終わる必要があります: :values',
    'enum' => '選択された:attributeは無効です。',
    'exists' => '選択された:attributeは無効です。',
    'extensions' => ':attributeには次の拡張子のファイルを選択してください: :values',
    'file' => ':attributeはファイルを選択してください。',
    'filled' => ':attributeには値を入力してください。',
    'gt' => [
        'array' => ':attributeは:value個より多い項目を指定してください。',
        'file' => ':attributeは:valueキロバイトより大きいファイルを選択してください。',
        'numeric' => ':attributeは:valueより大きい数値を指定してください。',
        'string' => ':attributeは:value文字より多く入力してください。',
    ],
    'gte' => [
        'array' => ':attributeは:value個以上の項目を指定してください。',
        'file' => ':attributeは:valueキロバイト以上のファイルを選択してください。',
        'numeric' => ':attributeは:value以上の数値を指定してください。',
        'string' => ':attributeは:value文字以上入力してください。',
    ],
    'hex_color' => ':attributeは有効な16進数カラーコードを入力してください。',
    'image' => ':attributeには画像ファイルを選択してください。',
    'in' => '選択された:attributeは無効です。',
    'in_array' => ':attributeは:otherに含まれていません。',
    'integer' => ':attributeは整数を入力してください。',
    'ip' => ':attributeには有効なIPアドレスを入力してください。',
    'ipv4' => ':attributeには有効なIPv4アドレスを入力してください。',
    'ipv6' => ':attributeには有効なIPv6アドレスを入力してください。',
    'json' => ':attributeには有効なJSON文字列を入力してください。',
    'lowercase' => ':attributeは小文字で入力してください。',
    'lt' => [
        'array' => ':attributeは:value個未満の項目を指定してください。',
        'file' => ':attributeは:valueキロバイト未満のファイルを選択してください。',
        'numeric' => ':attributeは:value未満の数値を指定してください。',
        'string' => ':attributeは:value文字未満で入力してください。',
    ],
    'lte' => [
        'array' => ':attributeは:value個以下の項目を指定してください。',
        'file' => ':attributeは:valueキロバイト以下のファイルを選択してください。',
        'numeric' => ':attributeは:value以下の数値を指定してください。',
        'string' => ':attributeは:value文字以下で入力してください。',
    ],
    'mac_address' => ':attributeには有効なMACアドレスを入力してください。',
    'max' => [
        'array' => ':attributeは:max個以下の項目を指定してください。',
        'file' => ':attributeは:maxキロバイト以下のファイルを選択してください。',
        'numeric' => ':attributeは:max以下の数値を指定してください。',
        'string' => ':attributeは:max文字以下で入力してください。',
    ],
    'max_digits' => ':attributeは:max桁以下の数字を入力してください。',
    'mimes' => ':attributeには:valuesタイプのファイルを選択してください。',
    'mimetypes' => ':attributeには:valuesタイプのファイルを選択してください。',
    'min' => [
        'array' => ':attributeは:min個以上の項目を指定してください。',
        'file' => ':attributeは:minキロバイト以上のファイルを選択してください。',
        'numeric' => ':attributeは:min以上の数値を指定してください。',
        'string' => ':attributeは:min文字以上で入力してください。',
    ],
    'min_digits' => ':attributeは:min桁以上の数字を入力してください。',
    'missing' => ':attributeは含まれていてはいけません。',
    'missing_if' => ':otherが:valueの場合、:attributeは含まれていてはいけません。',
    'missing_unless' => ':otherが:valueでない場合、:attributeは含まれていてはいけません。',
    'missing_with' => ':valuesが存在する場合、:attributeは含まれていてはいけません。',
    'missing_with_all' => ':valuesがすべて存在する場合、:attributeは含まれていてはいけません。',
    'multiple_of' => ':attributeは:valueの倍数である必要があります。',
    'not_in' => '選択された:attributeは無効です。',
    'not_regex' => ':attributeの形式が無効です。',
    'numeric' => ':attributeには数値を入力してください。',
    'password' => [
        'letters' => ':attributeには最低1つの文字を含めてください。',
        'mixed' => ':attributeには大文字と小文字を含めてください。',
        'numbers' => ':attributeには最低1つの数字を含めてください。',
        'symbols' => ':attributeには最低1つの記号を含めてください。',
        'uncompromised' => '指定された:attributeはデータ漏洩に含まれています。別の:attributeを選択してください。',
    ],
    'present' => ':attributeが存在している必要があります。',
    'present_if' => ':otherが:valueの場合、:attributeが存在している必要があります。',
    'present_unless' => ':otherが:valueでない場合、:attributeが存在している必要があります。',
    'present_with' => ':valuesが存在する場合、:attributeが存在している必要があります。',
    'present_with_all' => ':valuesがすべて存在する場合、:attributeが存在している必要があります。',
    'prohibited' => ':attributeは禁止されています。',
    'prohibited_if' => ':otherが:valueの場合、:attributeは禁止されています。',
    'prohibited_unless' => ':otherが:valuesに含まれていない場合、:attributeは禁止されています。',
    'prohibits' => ':attributeは:otherの存在を禁止しています。',
    'regex' => ':attributeの形式が無効です。',
    'required' => ':attributeは必須です。',
    'required_array_keys' => ':attributeには:valuesのエントリを含める必要があります。',
    'required_if' => ':otherが:valueの場合、:attributeは必須です。',
    'required_if_accepted' => ':otherが承認された場合、:attributeは必須です。',
    'required_if_declined' => ':otherが拒否された場合、:attributeは必須です。',
    'required_unless' => ':otherが:valuesに含まれていない場合、:attributeは必須です。',
    'required_with' => ':valuesのいずれかが存在する場合、:attributeは必須です。',
    'required_with_all' => ':valuesがすべて存在する場合、:attributeは必須です。',
    'required_without' => ':valuesのいずれかが存在しない場合、:attributeは必須です。',
    'required_without_all' => ':valuesがすべて存在しない場合、:attributeは必須です。',
    'same' => ':attributeと:otherは一致している必要があります。',
    'size' => [
        'array' => ':attributeは:size個の項目を含める必要があります。',
        'file' => ':attributeは:sizeキロバイトである必要があります。',
        'numeric' => ':attributeは:sizeである必要があります。',
        'string' => ':attributeは:size文字である必要があります。',
    ],
    'starts_with' => ':attributeは次の値のいずれかで始まる必要があります: :values',
    'string' => ':attributeは文字列である必要があります。',
    'timezone' => ':attributeは有効なタイムゾーンである必要があります。',
    'unique' => ':attributeは既に使用されています。',
    'uploaded' => ':attributeのアップロードに失敗しました。',
    'uppercase' => ':attributeは大文字で入力してください。',
    'url' => ':attributeは有効なURLである必要があります。',
    'ulid' => ':attributeは有効なULIDである必要があります。',
    'uuid' => ':attributeは有効なUUIDである必要があります。',

    /*
    |--------------------------------------------------------------------------
    | カスタムバリデーション言語行
    |--------------------------------------------------------------------------
    |
    | ここでは"attribute.rule"の規約を使用してバリデーションメッセージを
    | カスタマイズできます。これにより特定の属性ルールに対してカスタムの
    | 言語行を素早く指定できます。
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | カスタムバリデーション属性
    |--------------------------------------------------------------------------
    |
    | 以下の言語行は、"email"の代わりに"メールアドレス"のような読みやすい
    | ものに属性プレースホルダーを置き換えるために使用されます。これにより
    | メッセージをより表現豊かにできます。
    |
    */

    'attributes' => [
        'name' => '名前',
        'email' => 'メールアドレス',
        'password' => 'パスワード',
        'password_confirmation' => 'パスワード確認',
        'phone' => '電話番号',
        'mobile' => '携帯電話',
        'age' => '年齢',
        'sex' => '性別',
        'gender' => '性別',
        'year' => '年',
        'month' => '月',
        'day' => '日',
        'hour' => '時',
        'minute' => '分',
        'second' => '秒',
        'title' => 'タイトル',
        'content' => '内容',
        'description' => '説明',
        'excerpt' => '抜粋',
        'date' => '日付',
        'time' => '時間',
        'available' => '利用可能',
        'size' => 'サイズ',
        'file' => 'ファイル',
        'image' => '画像',
        'photo' => '写真',
        'avatar' => 'アバター',
        'first_name' => '名',
        'last_name' => '姓',
        'username' => 'ユーザー名',
        'address' => '住所',
        'country' => '国',
        'city' => '市区町村',
        'state' => '都道府県',
        'zip' => '郵便番号',
        'postal_code' => '郵便番号',
        'category' => 'カテゴリ',
        'message' => 'メッセージ',
        'slug' => 'スラッグ',
        'status' => 'ステータス',
        'type' => 'タイプ',
        'price' => '価格',
        'amount' => '金額',
        'quantity' => '数量',
        'weight' => '重量',
        'height' => '高さ',
        'width' => '幅',
        'length' => '長さ',
        'url' => 'URL',
        'website' => 'ウェブサイト',
        'company' => '会社',
        'department' => '部署',
        'position' => '役職',
        'note' => '備考',
        'comment' => 'コメント',
        'terms' => '利用規約',
        'privacy' => 'プライバシーポリシー',

        // サービスタイプ関連
        'service_category_id' => 'サービスカテゴリ',
        'base_price' => '基本価格',
        'detailed_description' => '詳細説明',
        'pricing_model' => '料金体系',
        'price_unit' => '価格単位',
    ],

];
