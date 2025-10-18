<?php

namespace Database\Factories;

use App\Models\UserAddress;
use App\Models\User;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserAddress>
 */
class UserAddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $prefectures = [
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
            '沖縄県'
        ];

        $prefecture = $this->faker->randomElement($prefectures);
        $addressType = $this->faker->randomElement(['home', 'office', 'billing', 'shipping', 'branch', 'other']);

        return [
            'type' => $addressType,
            'label' => $this->generateLabel($addressType),
            'postal_code' => $this->faker->postcode,
            'prefecture' => $prefecture,
            'city' => $this->generateCityForPrefecture($prefecture),
            'district' => $this->faker->optional(0.8)->streetName,
            'address_other' => $this->faker->secondaryAddress,
            'phone' => $this->faker->optional(0.7)->phoneNumber,
            'contact_person' => $this->faker->optional(0.6)->name,
            'latitude' => $this->faker->optional(0.4)->latitude(24, 46),
            'longitude' => $this->faker->optional(0.4)->longitude(123, 146),
            'api_response' => $this->faker->optional(0.3)->randomElements([
                'geocoding_service' => 'google_maps',
                'confidence' => $this->faker->randomFloat(2, 0.5, 1.0),
                'formatted_address' => $this->faker->address,
            ]),
            'is_default' => false, // Will be set properly in seeder
            'is_active' => $this->faker->boolean(90),
            'verified_at' => $this->faker->optional(0.6)->dateTimeBetween('-1 year', 'now'),
            'notes' => $this->faker->optional(0.3)->realText(100),
            'metadata' => $this->faker->optional(0.2)->randomElements([
                'delivery_instructions' => $this->faker->sentence,
                'access_code' => $this->faker->numerify('####'),
                'preferred_time' => $this->faker->randomElement(['morning', 'afternoon', 'evening']),
            ]),
        ];
    }

    /**
     * Generate appropriate label for address type
     */
    private function generateLabel(string $type): ?string
    {
        $labels = [
            'home' => ['自宅', '居住地', '住所'],
            'office' => ['本社', '事務所', 'オフィス', '勤務先'],
            'billing' => ['請求先', '経理部', '会計部'],
            'shipping' => ['配送先', '納品先', '受取先'],
            'branch' => ['支店', '営業所', '出張所', '支社'],
            'other' => ['その他', '別住所', '連絡先'],
        ];

        return $this->faker->optional(0.7)->randomElement($labels[$type] ?? ['その他']);
    }

    /**
     * Generate realistic city names for prefecture
     */
    private function generateCityForPrefecture(string $prefecture): string
    {
        $cities = [
            '東京都' => ['新宿区', '渋谷区', '港区', '千代田区', '中央区', '品川区', '目黒区', '世田谷区'],
            '大阪府' => ['大阪市', '堺市', '豊中市', '高槻市', '枚方市', '茨木市'],
            '愛知県' => ['名古屋市', '豊田市', '一宮市', '春日井市', '安城市'],
            '神奈川県' => ['横浜市', '川崎市', '相模原市', '藤沢市', '茅ヶ崎市'],
            '埼玉県' => ['さいたま市', '川越市', '熊谷市', '川口市', '所沢市'],
        ];

        if (isset($cities[$prefecture])) {
            return $this->faker->randomElement($cities[$prefecture]);
        }

        return $this->faker->city;
    }

    /**
     * Set as User's address
     */
    public function forUser(User $user): static
    {
        return $this->state(fn(array $attributes) => [
            'addressable_type' => User::class,
            'addressable_id' => $user->id,
        ]);
    }

    /**
     * Set as Company's address
     */
    public function forCompany(Company $company): static
    {
        return $this->state(fn(array $attributes) => [
            'addressable_type' => Company::class,
            'addressable_id' => $company->id,
        ]);
    }

    /**
     * Set as default address
     */
    public function default(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_default' => true,
        ]);
    }

    /**
     * Set specific address type
     */
    public function home(): static
    {
        return $this->state(fn(array $attributes) => [
            'type' => 'home',
            'label' => $this->faker->randomElement(['自宅', '居住地']),
        ]);
    }

    public function office(): static
    {
        return $this->state(fn(array $attributes) => [
            'type' => 'office',
            'label' => $this->faker->randomElement(['本社', '事務所', 'オフィス']),
        ]);
    }

    public function branch(): static
    {
        return $this->state(fn(array $attributes) => [
            'type' => 'branch',
            'label' => $this->faker->randomElement(['支店', '営業所', '出張所']),
        ]);
    }

    public function billing(): static
    {
        return $this->state(fn(array $attributes) => [
            'type' => 'billing',
            'label' => $this->faker->randomElement(['請求先', '経理部']),
        ]);
    }

    public function shipping(): static
    {
        return $this->state(fn(array $attributes) => [
            'type' => 'shipping',
            'label' => $this->faker->randomElement(['配送先', '納品先']),
        ]);
    }
}
