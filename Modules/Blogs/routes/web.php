<?php

use Illuminate\Support\Facades\Route;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;
use Modules\Blogs\Http\Controllers\BlogsController;
use Modules\Blogs\Http\Controllers\DashboardBlogsController;

Route::group([
  "prefix" => "/" . LaravelLocalization::setLocale(),
  "middleware" => ["localeSessionRedirect", "localizationRedirect"]
], function () {
  Route::get('/blogs', [BlogsController::class, 'index'])->name('blogs.index');
  Route::get('/blogs/{id}', [BlogsController::class, 'show'])->name('blogs.show');
});

Route::group([
  "prefix" => "/" . LaravelLocalization::setLocale(),
  "middleware" => ["localeSessionRedirect", "localizationRedirect", "auth"]
], function () {
  Route::prefix('/dashboard/blogs')->name('dashboard.blogs.')->group(function () {
    Route::get('/', [DashboardBlogsController::class, 'index'])->name('index');
    Route::get('/create', [DashboardBlogsController::class, 'create'])->name('create');
    Route::post('/', [DashboardBlogsController::class, 'store'])->name('store');
    Route::get('/{id}/edit', [DashboardBlogsController::class, 'edit'])->name('edit');
    Route::put('/{id}', [DashboardBlogsController::class, 'update'])->name('update');
    Route::delete('/{id}', [DashboardBlogsController::class, 'destroy'])->name('destroy');
  });
});
