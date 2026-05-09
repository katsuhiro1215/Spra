<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserProfile>
 */
class UserProfileFactory extends Factory
{
    protected $model = UserProfile::class;

    private static array $lastNames = [
        '田中',
        '鈴木',
        '佐藤',
        '山本',
        '伊藤',
        '渡辺',
        '中村',
        '小林',
        '加藤',
        '吉田',
        '山田',
        '松本',
        '井上',
        '木村',
        '林',
        '清水',
        '山崎',
        '阿部',
        '森',
        '池田',
        '橋本',
        '山口',
        '石川',
        '松田',
        '中島',
        '前田',
        '藤田',
        '小川',
        '後藤',
        '長谷川',
    ];

    private static array $firstNamesMale = [
        '太郎',
        '一郎',
        '健太',
        '翔',
        '大輝',
        '拓也',
        '浩二',
        '直樹',
        '雄太',
        '和也',
        '勇',
        '剛',
        '誠',
        '修',
        '達也',
        '博',
        '隆',
        '浩',
        '光',
        '清',
    ];

    private static array $firstNamesFemale = [
        '花子',
        '美咲',
        '愛',
        'さくら',
        '美穂',
        '恵',
        '奈々',
        '真由美',
        '麻衣',
        '優子',
        '由美',
        '幸恵',
        '明美',
        '美香',
        '亜衣',
        '裕子',
        '洋子',
        '智子',
        '純子',
        '幸子',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = fake()->randomElement(['male', 'female', 'other', 'prefer_not_to_say']);

        $lastName = fake()->randomElement(self::$lastNames);
        $firstName = match ($gender) {
            'male'   => fake()->randomElement(self::$firstNamesMale),
            'female' => fake()->randomElement(self::$firstNamesFemale),
            default  => fake()->randomElement(array_merge(self::$firstNamesMale, self::$firstNamesFemale)),
        };

        return [
            'user_id'                  => User::factory(),
            'last_name'                => $lastName,
            'first_name'               => $firstName,
            'last_name_kana'           => null,
            'first_name_kana'          => null,
            'display_name'             => $lastName . ' ' . $firstName,
            'birth_date'               => fake()->optional(0.7)->dateTimeBetween('-60 years', '-18 years')?->format('Y-m-d'),
            'gender'                   => $gender,
            'phone'                    => fake()->optional(0.6)->numerify('0#-####-####'),
            'mobile'                   => fake()->optional(0.8)->numerify('0#0-####-####'),
            'avatar'                   => null,
            'bio'                      => fake()->optional(0.4)->realText(80),
            'occupation'               => fake()->optional(0.6)->jobTitle(),
            'job_title'                => fake()->optional(0.5)->jobTitle(),
            'preferred_language'       => fake()->randomElement(['ja', 'ja', 'ja', 'en']),
            'timezone'                 => 'Asia/Tokyo',
            'notification_preferences' => null,
        ];
    }

    /**
     * 特定のユーザーに紐付けるステート
     */
    public function forUser(User $user): static
    {
        return $this->state(fn(array $attributes) => ['user_id' => $user->id]);
    }
}
