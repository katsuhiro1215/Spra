<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ServiceCategory>
 */
class ServiceCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $services = [
            'Webサイト制作',
            'システム開発', 
            'モバイルアプリ開発',
            'デザイン',
            'マーケティング',
            'コンサルティング',
            'サポート・保守',
            'その他',
        ];

        $colors = [
            '#3B82F6', // Blue
            '#10B981', // Green
            '#F59E0B', // Yellow
            '#EF4444', // Red
            '#8B5CF6', // Purple
            '#06B6D4', // Cyan
            '#F97316', // Orange
            '#6B7280', // Gray
        ];

        $icons = [
            'globe-alt',
            'code-bracket',
            'device-phone-mobile',
            'paint-brush',
            'megaphone',
            'lightbulb',
            'wrench-screwdriver',
            'ellipsis-horizontal',
        ];

        $name = $this->faker->unique()->randomElement($services);
        
        return [
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name),
            'description' => $this->faker->realText(200),
            'color' => $this->faker->randomElement($colors),
            'icon' => $this->faker->randomElement($icons),
            'sort_order' => $this->faker->numberBetween(1, 100),
            'is_active' => $this->faker->boolean(90), // 90%の確率でアクティブ
        ];
    }
}
