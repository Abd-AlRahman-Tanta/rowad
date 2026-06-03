<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;
use Modules\Pages\Http\Controllers\PagesController;
use Modules\Shared\Models\Content;

Route::group([
  "prefix" => "/" . LaravelLocalization::setLocale(),
  "middleware" => ["localeSessionRedirect", "localizationRedirect"]
], function () {
  Route::get("/", [PagesController::class, "home"])->name("home");
  Route::get("/university", [PagesController::class, "universityServices"])->name("university");
  Route::get("/engineering-services", [PagesController::class, "engServices"])->name("eng");
  Route::get("/course/{id}", [PagesController::class, "ShowCourseDetailsPage"])->name("CoursePage");
});
