<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UiBlock extends Model
{
    protected $fillable = [
        'title',
        'type',
        'status',
        'order',
        'content',
    ];

    protected $casts = [
        'content' => 'array',
        'order'   => 'integer',
    ];

    // Default content templates per type
    public static function defaultContent(string $type): array
    {
        return match ($type) {
            'banner' => [
                'heading'         => 'Welcome!',
                'subheading'      => 'Discover something amazing',
                'backgroundColor' => '#FF6B35',
            ],
            'card' => [
                'heading' => 'Categories',
                'items'   => [
                    ['label' => 'Starters',     'icon' => '🥗', 'description' => 'Fresh and light appetizers'],
                    ['label' => 'Main Course',  'icon' => '🍛', 'description' => 'Hearty and flavourful mains'],
                    ['label' => 'Desserts',     'icon' => '🍮', 'description' => 'Sweet endings to your meal'],
                    ['label' => 'Beverages',    'icon' => '🥤', 'description' => 'Refreshing drinks for all'],
                ],
            ],
            'list' => [
                'heading' => 'Menu Highlights',
                'items'   => [
                    ['name' => 'Butter Chicken',      'price' => '₹349', 'tag' => 'Best Seller'],
                    ['name' => 'Paneer Tikka',         'price' => '₹279', 'tag' => 'Veg'],
                    ['name' => 'Hyderabad Biryani',    'price' => '₹399', 'tag' => 'Popular'],
                    ['name' => 'Dal Makhani',          'price' => '₹229', 'tag' => 'Comfort'],
                    ['name' => 'Gulab Jamun',          'price' => '₹99',  'tag' => 'Sweet'],
                ],
            ],
            'stats' => [
                'heading' => 'Our Numbers',
                'stats'   => [
                    ['label' => 'Happy Customers', 'value' => '10,000+', 'icon' => '😊'],
                    ['label' => 'Menu Items',       'value' => '120+',    'icon' => '🍽️'],
                    ['label' => 'Cities Served',    'value' => '25+',     'icon' => '📍'],
                    ['label' => 'Years of Taste',   'value' => '8+',      'icon' => '⭐'],
                ],
            ],
            default => [],
        };
    }
}
