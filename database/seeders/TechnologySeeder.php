<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Technology;
use Illuminate\Database\Seeder;

class TechnologySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = Admin::where('email', 'katsuhiro.k1215@gmail.com')->first();

        $technologies = [
            ['name' => 'React', 'color' => '#61DAFB'],
            ['name' => 'Next.js', 'color' => '#000000'],
            ['name' => 'Vue.js', 'color' => '#4FC08D'],
            ['name' => 'Laravel', 'color' => '#FF2D20'],
            ['name' => 'WordPress', 'color' => '#21759B'],
            ['name' => 'Tailwind CSS', 'color' => '#06B6D4'],
            ['name' => 'PostgreSQL', 'color' => '#336791'],
            ['name' => 'MySQL', 'color' => '#4479A1'],
            ['name' => 'AWS', 'color' => '#FF9900'],
            ['name' => 'Docker', 'color' => '#2496ED'],
            ['name' => 'React Native', 'color' => '#61DAFB'],
            ['name' => 'Flutter', 'color' => '#02569B'],
            ['name' => 'Swift', 'color' => '#F05138'],
            ['name' => 'Kotlin', 'color' => '#7F52FF'],
            ['name' => 'Firebase', 'color' => '#FFCA28'],
        ];

        foreach ($technologies as $index => $technology) {
            Technology::create([
                'name' => $technology['name'],
                'color' => $technology['color'],
                'sort_order' => $index,
                'is_active' => true,
                'created_by' => $admin?->id,
                'updated_by' => $admin?->id,
            ]);
        }
    }
}
