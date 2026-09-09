<?php

use Illuminate\Support\Facades\Route;
use Modules\Blogs\Http\Controllers\BlogsController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('blogs', BlogsController::class)->names('blogs');
});
