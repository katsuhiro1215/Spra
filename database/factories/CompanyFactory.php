<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $companyType = $this->faker->randomElement(['individual', 'corporate']);
        $isIndividual = $companyType === 'individual';

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

        $industries = [
            '製造業',
            'IT・ソフトウェア',
            '建設・不動産',
            '小売・卸売',
            '金融・保険',
            '運輸・物流',
            '医療・介護',
            '教育',
            '飲食・宿泊',
            'コンサルティング',
            'マーケティング・広告',
            'エネルギー',
            '農業・林業・漁業',
            '公務',
        ];

        $name = $isIndividual
            ? $this->faker->lastName . ' ' . $this->faker->firstName
            : $this->faker->company;

        return [
            'name' => $name,
            'company_type' => $companyType,
            'legal_name' => $isIndividual ? null : $name . ($this->faker->randomElement(['株式会社', '有限会社', '合同会社'])),
            'registration_number' => $isIndividual ? null : $this->faker->numerify('############'),
            'tax_number' => $isIndividual ? null : $this->faker->numerify('T############'),
            'postal_code' => $this->faker->postcode,
            'prefecture' => $this->faker->randomElement($prefectures),
            'city' => $this->faker->city,
            'district' => $this->faker->optional(0.7)->streetName,
            'address_other' => $this->faker->secondaryAddress,
            'phone' => $this->faker->phoneNumber,
            'fax' => $this->faker->optional(0.3)->phoneNumber,
            'email' => $this->faker->companyEmail,
            'website' => $this->faker->optional(0.6)->url,
            'representative_name' => $isIndividual ? $name : $this->faker->name,
            'representative_title' => $isIndividual ? null : $this->faker->randomElement(['代表取締役', '取締役社長', '社長', '代表']),
            'representative_email' => $this->faker->email,
            'representative_phone' => $this->faker->phoneNumber,
            'business_description' => $this->faker->optional(0.8)->realText(200),
            'industry' => $this->faker->randomElement($industries),
            'employee_count' => $isIndividual ? 1 : $this->faker->numberBetween(1, 1000),
            'capital' => $isIndividual ? null : $this->faker->randomFloat(2, 1000000, 100000000),
            'established_date' => $this->faker->dateTimeBetween('-20 years', 'now'),
            'status' => $this->faker->randomElement(['active', 'inactive', 'suspended']),
            'notes' => $this->faker->optional(0.3)->realText(100),
            'metadata' => $this->faker->optional(0.2)->randomElements([
                'verified' => true,
                'source' => 'api_import',
                'priority' => 'high',
            ]),
        ];
    }

    /**
     * 個人事業主の状態を示す
     */
    public function individual(): static
    {
        return $this->state(fn(array $attributes) => [
            'company_type' => 'individual',
            'legal_name' => null,
            'registration_number' => null,
            'tax_number' => null,
            'representative_title' => null,
            'employee_count' => 1,
            'capital' => null,
        ]);
    }

    /**
     * 法人の状態を示す
     */
    public function corporate(): static
    {
        return $this->state(fn(array $attributes) => [
            'company_type' => 'corporate',
            'legal_name' => $attributes['name'] . $this->faker->randomElement(['株式会社', '有限会社', '合同会社']),
            'registration_number' => $this->faker->numerify('############'),
            'tax_number' => $this->faker->numerify('T############'),
            'representative_title' => $this->faker->randomElement(['代表取締役', '取締役社長', '社長']),
            'employee_count' => $this->faker->numberBetween(2, 1000),
            'capital' => $this->faker->randomFloat(2, 1000000, 100000000),
        ]);
    }

    /**
     * アクティブな状態
     */
    public function active(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'active',
        ]);
    }
}
