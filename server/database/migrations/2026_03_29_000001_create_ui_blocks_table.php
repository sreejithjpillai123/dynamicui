<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ui_blocks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['banner', 'card', 'list', 'stats'])->default('banner');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->unsignedInteger('order')->default(0);
            $table->json('content')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ui_blocks');
    }
};
