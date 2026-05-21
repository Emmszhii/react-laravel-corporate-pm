<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

// Employee CRUD routes - view open to all auth users, manage restricted
Route::resource('employees', EmployeeController::class)
    ->middleware('auth')
    ->middlewareFor(['create', 'store', 'edit', 'update', 'destroy'], 'permission:manage employees');

require __DIR__ . '/settings.php';
