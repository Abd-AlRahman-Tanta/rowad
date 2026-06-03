<?php

use Illuminate\Support\Facades\Route;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;
use Modules\Projects\Http\Controllers\ProjectsController;
use Modules\Shared\Http\Controllers\AuthPagesController;
use Modules\Shared\Http\Controllers\SharedController;

Route::group([
  "prefix" => "/" . LaravelLocalization::setLocale(),
  "middleware" => ["localeSessionRedirect", "localizationRedirect"]
], function () {
  // Route::middleware("auth")->group(function () {
  Route::post("/cms-update", [SharedController::class, "update"]);
  Route::post("/cms-update-array", [SharedController::class, "addElement"]);
  Route::post("/cms-delete-item", [SharedController::class, "deleteElement"]);
  Route::get("/logout", [AuthPagesController::class, 'logout']);
  // });
  Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthPagesController::class, 'login'])
      ->name('login');
    Route::post('/login', [AuthPagesController::class, 'loginAdmin'])
      ->name('login');
  });
});






Route::post('/upload-file', [SharedController::class, 'uploadFile']);
