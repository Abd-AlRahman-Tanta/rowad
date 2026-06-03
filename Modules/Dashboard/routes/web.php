<?php

use Illuminate\Support\Facades\Route;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;
use Modules\Dashboard\Http\Controllers\DashboardController;
use Modules\Projects\Http\Controllers\ProjectsController;

Route::group([
  "prefix" => "/" . LaravelLocalization::setLocale(),
  'middleware' => ['localeSessionRedirect', 'localizationRedirect']
], function () {
  Route::prefix("/dashboard")->group(function () {
    Route::get("", function () {
      return redirect()->route("dashboard.projects.index");
    });
    Route::prefix("/projects")->name("dashboard.projects.")->group(function () {
      Route::get("/", [ProjectsController::class, "index"])->name("index");
      Route::get("/create", [ProjectsController::class, "create"])->name("create");
      Route::post("/", [ProjectsController::class, "store"])->name("store");
      Route::get("/{id}", [ProjectsController::class, "edit"])->name("edit");
      Route::put("/{id}", [ProjectsController::class, "update"])->name("update");
      Route::delete("/{id}", [ProjectsController::class, "destroy"])->name("destroy");
    });
  });
});
