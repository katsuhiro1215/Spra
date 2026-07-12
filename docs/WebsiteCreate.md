        Schema::create('page_types', function (Blueprint $table) {
            $table->ulid('id')->primary()->comment('ページID(ULID)');
            $table->string('key', 50)->unique()->comment('ページタイプキー');
            $table->string('name', 100)->unique()->comment('ページタイプ名');
            $table->string('slug', 100)->unique()->comment('PageType識別子 (static, post_list, post_detail, product_list, product_detail)');
            $table->text('description')->nullable()->comment('ページタイプ説明');
            $table->boolean('is_system')->default(false)->comment('システム定義フラグ');

            // 動的ページ設定
            $table->boolean('is_dynamic')->default(false)->comment('動的ページフラグ (false: 固定ページ, true: 動的一覧/詳細)');
            $table->boolean('has_detail')->default(false)->comment('詳細ページの有無 (true: 一覧ページ, false: 詳細ページまたは固定ページ)');

            // コンポーネント制限
            $table->json('allowed_component_types')->nullable()->comment('使用可能なComponentType.keyの配列 (例: ["hero", "post_list", "pagination"])');
            $table->json('default_layout')->nullable()->comment('デフォルトレイアウト定義 (新規ページ作成時の初期コンポーネント配置)');

            // 監査用カラム
            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
            $table->timestamps();
        });
        Schema::create('pages', function (Blueprint $table) {
            $table->ulid('id')->primary()->comment('ページID(ULID)');
            $table->foreignId('page_type_id')->constrained('page_types')->cascadeOnDelete()->comment('ページタイプID');
            $table->string('title', 200)->comment('ページタイトル');
            $table->string('slug', 150)->comment('URLスラッグ');
            $table->string('template', 100)->default('default')->comment('使用テンプレート');
            $table->json('content')->nullable()->comment('ページコンテンツ (ブロックエディタ)');
            $table->string('meta_title', 200)->nullable()->comment('メタタイトル');
            $table->text('meta_description')->nullable()->comment('メタディスクリプション');
            $table->boolean('is_published')->default(false)->comment('公開状態');
            $table->timestamp('published_at')->nullable()->comment('公開日時');
            $table->integer('sort_order')->default(0)->comment('表示順');
            // 監査用カラム
            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
            $table->foreignUuid('deleted_by')->nullable()->constrained('admins')->nullOnDelete()->comment('削除者');
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('sections', function (Blueprint $table) {
            $table->ulid('id')->primary()->comment('ページID(ULID)');
            $table->foreignUlid('page_id')->nullable()->constrained('pages')->cascadeOnDelete();
            $table->string('name');
            $table->string('role')->default('main')->comment('header/footer/main/sidebar等');
            $table->unsignedInteger('sort_order')->default(0);
            // 監査用カラム
            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('post_categories', function (Blueprint $table) {
            $table->ulid('id')->primary()->comment('投稿カテゴリーID(ULID)');
            $table->foreignUlid('parent_id')->nullable()->constrained('post_categories')->nullOnDelete()->comment('親カテゴリーID(ULID)');
            $table->string('name', 200)->comment('カテゴリー名');
            $table->string('slug', 200)->comment('URLスラッグ');
            $table->text('description')->nullable()->comment('カテゴリー説明');
            $table->boolean('is_active')->default(true)->comment('有効/無効');
            $table->integer('sort_order')->default(0)->comment('表示順');
            // 監査用カラム
            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
            $table->foreignUuid('deleted_by')->nullable()->constrained('admins')->nullOnDelete()->comment('削除者');
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('posts', function (Blueprint $table) {
            $table->ulid('id')->primary()->comment('投稿ID(ULID)');
            $table->foreignUlid('post_category_id')->constrained('post_categories')->cascadeOnDelete()->comment('投稿カテゴリーID');
            $table->string('name', 200)->comment('投稿名');
            $table->string('slug', 200)->comment('URLスラッグ');
            $table->string('title', 200)->comment('投稿タイトル');
            $table->longText('content')->comment('投稿内容');
            $table->boolean('is_published')->default(false)->comment('公開状態');
            $table->timestamp('published_at')->nullable()->comment('公開日時');
            // 監査用カラム
            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
            $table->foreignUuid('deleted_by')->nullable()->constrained('admins')->nullOnDelete()->comment('削除者');
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('menus', function (Blueprint $table) {
            $table->ulid('id')->primary()->comment('メニューID(ULID)');
            $table->string('name', 200)->comment('メニュー名');
            $table->string('slug', 200)->comment('URLスラッグ');
            $table->text('description')->nullable()->comment('メニュー説明');
            $table->string('location', 50)->nullable()->comment('メニュー表示位置');
            // 監査用カラム
            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
            $table->timestamps();
        });
        Schema::create('menu_items', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('menu_id')->constrained('menus')->cascadeOnDelete()->comment('メニューID(ULID)');
            $table->foreignUlid('parent_id')->nullable()->constrained('menu_items')->nullOnDelete()->comment('親メニューアイテムID(ULID)');
            $table->string('label', 200)->comment('メニューアイテムラベル');
            $table->string('url', 200)->comment('メニューアイテムURL');
            $table->foreignUlid('page_id')->nullable()->constrained('pages')->nullOnDelete()->comment('ページID(ULID)');
            $table->string('target', 20)->default('_self')->comment('リンクターゲット');
            $table->boolean('is_active')->default(true)->comment('有効/無効');
            $table->integer('sort_order')->default(0)->comment('表示順');
            // 監査用カラム
            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
            $table->foreignUuid('deleted_by')->nullable()->constrained('admins')->nullOnDelete()->comment('削除者');
            $table->timestamps();
            $table->softDeletes();
        });
