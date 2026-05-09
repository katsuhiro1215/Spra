<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Address>
 */
class AddressFactory extends Factory
{
    protected $model = Address::class;

    private static array $prefectures = [
        '北海道',
        '青森県',
        '岩手県',
        '宮城県',
        '秋田県',
        '山形県',
        '福島県',
        '茨城県',
        '栃木県',
        '群馬県',
        '埼玉県',
        '千葉県',
        '東京都',
        '神奈川県',
        '新潟県',
        '富山県',
        '石川県',
        '福井県',
        '山梨県',
        '長野県',
        '岐阜県',
        '静岡県',
        '愛知県',
        '三重県',
        '滋賀県',
        '京都府',
        '大阪府',
        '兵庫県',
        '奈良県',
        '和歌山県',
        '鳥取県',
        '島根県',
        '岡山県',
        '広島県',
        '山口県',
        '徳島県',
        '香川県',
        '愛媛県',
        '高知県',
        '福岡県',
        '佐賀県',
        '長崎県',
        '熊本県',
        '大分県',
        '宮崎県',
        '鹿児島県',
        '沖縄県',
    ];

    private static array $cityMap = [
        '東京都'  => ['新宿区', '渋谷区', '港区', '千代田区', '中央区', '品川区', '目黒区', '世田谷区', '練馬区', '杉並区'],
        '大阪府'  => ['大阪市', '堺市', '豊中市', '高槻市', '枚方市', '茨木市', '吹田市'],
        '愛知県'  => ['名古屋市', '豊田市', '一宮市', '春日井市', '安城市', '岡崎市'],
        '神奈川県' => ['横浜市', '川崎市', '相模原市', '藤沢市', '茅ヶ崎市', '鎌倉市'],
        '埼玉県'  => ['さいたま市', '川越市', '熊谷市', '川口市', '所沢市', '越谷市'],
        '千葉県'  => ['千葉市', '船橋市', '市川市', '松戸市', '柏市', '浦安市'],
        '兵庫県'  => ['神戸市', '姫路市', '尼崎市', '明石市', '西宮市', '芦屋市'],
        '福岡県'  => ['福岡市', '北九州市', '久留米市', '飯塚市', '春日市'],
        '京都府'  => ['京都市', '宇治市', '亀岡市', '城陽市', '長岡京市'],
    ];

    private static array $typeLabels = [
        'home'     => ['自宅', '居住地'],
        'office'   => ['本社', '事務所', 'オフィス', '勤務先'],
        'billing'  => ['請求先', '経理部'],
        'shipping' => ['配送先', '納品先'],
        'branch'   => ['支店', '営業所', '出張所'],
        'other'    => ['その他'],
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type       = fake()->randomElement(['home', 'office', 'billing', 'shipping', 'other']);
        $prefecture = fake()->randomElement(self::$prefectures);
        $city       = isset(self::$cityMap[$prefecture])
            ? fake()->randomElement(self::$cityMap[$prefecture])
            : fake()->city();

        return [
            'type'          => $type,
            'label'         => fake()->optional(0.7)->randomElement(self::$typeLabels[$type] ?? ['その他']),
            'postal_code'   => fake()->postcode(),
            'prefecture'    => $prefecture,
            'city'          => $city,
            'district'      => fake()->optional(0.7)->streetAddress(),
            'address_other' => fake()->optional(0.8)->secondaryAddress(),
            'phone'         => fake()->optional(0.5)->numerify('0#-####-####'),
            'contact_person' => null,
            'latitude'      => null,
            'longitude'     => null,
            'is_default'    => false,
            'is_active'     => true,
            'verified_at'   => fake()->optional(0.5)->dateTimeBetween('-1 year', 'now'),
            'notes'         => null,
        ];
    }

    // -------------------------
    // Morphable target states
    // -------------------------

    public function forUser(User $user): static
    {
        return $this->state(fn(array $attributes) => [
            'addressable_type' => User::class,
            'addressable_id'   => $user->id,
        ]);
    }

    public function forCompany(Company $company): static
    {
        return $this->state(fn(array $attributes) => [
            'addressable_type' => Company::class,
            'addressable_id'   => $company->id,
        ]);
    }

    // -------------------------
    // Type states
    // -------------------------

    public function home(): static
    {
        return $this->state(fn(array $attributes) => [
            'type'  => 'home',
            'label' => fake()->randomElement(['自宅', '居住地']),
        ]);
    }

    public function office(): static
    {
        return $this->state(fn(array $attributes) => [
            'type'  => 'office',
            'label' => fake()->randomElement(['本社', '事務所', 'オフィス']),
        ]);
    }

    public function branch(): static
    {
        return $this->state(fn(array $attributes) => [
            'type'  => 'branch',
            'label' => fake()->randomElement(['支店', '営業所', '出張所']),
        ]);
    }

    public function billing(): static
    {
        return $this->state(fn(array $attributes) => [
            'type'  => 'billing',
            'label' => fake()->randomElement(['請求先', '経理部']),
        ]);
    }

    public function shipping(): static
    {
        return $this->state(fn(array $attributes) => [
            'type'  => 'shipping',
            'label' => fake()->randomElement(['配送先', '納品先']),
        ]);
    }

    // -------------------------
    // Status states
    // -------------------------

    public function default(): static
    {
        return $this->state(fn(array $attributes) => ['is_default' => true]);
    }

    public function inactive(): static
    {
        return $this->state(fn(array $attributes) => ['is_active' => false]);
    }
}
