<?php

namespace Database\Seeders;

use App\Models\UiBlock;
use Illuminate\Database\Seeder;

class UiBlockSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing
        UiBlock::truncate();

        $blocks = [
            [
                'title'  => 'Welcome Banner',
                'type'   => 'banner',
                'status' => 'active',
                'order'  => 1,
                'content' => UiBlock::defaultContent('banner'),
            ],
            [
                'title'  => 'Food Categories',
                'type'   => 'card',
                'status' => 'active',
                'order'  => 2,
                'content' => UiBlock::defaultContent('card'),
            ],
            [
                'title'  => 'Menu Highlights',
                'type'   => 'list',
                'status' => 'active',
                'order'  => 3,
                'content' => UiBlock::defaultContent('list'),
            ],
            [
                'title'  => 'Our Numbers',
                'type'   => 'stats',
                'status' => 'active',
                'order'  => 4,
                'content' => UiBlock::defaultContent('stats'),
            ],
        ];

        foreach ($blocks as $block) {
            UiBlock::create($block);
        }
    }
}
