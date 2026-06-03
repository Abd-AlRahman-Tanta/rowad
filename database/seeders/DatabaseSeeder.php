<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Modules\Projects\Database\Seeders\ProjectsDatabaseSeeder;
use Modules\Shared\Database\Seeders\SharedDatabaseSeeder;

class DatabaseSeeder extends Seeder
{
  public function run(): void
  {
    $this->call([
      SharedDatabaseSeeder::class,
      ProjectsDatabaseSeeder::class
    ]);
  }
}
