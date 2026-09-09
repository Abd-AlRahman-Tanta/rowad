<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('blogs', function (Blueprint $table) {
      $table->id();
      $table->string('image');
      $table->string('heroImage')->nullable();
      $table->json('title');       // spatie translatable
      $table->json('summary');     // spatie translatable
      $table->json('content');     // spatie translatable (rich text)
      $table->string('category')->nullable();
      $table->string('readTime')->nullable();
      $table->boolean('published')->default(true);
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('blogs');
  }
};
