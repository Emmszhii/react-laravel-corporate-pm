<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth','verified'])->group(function(){
    Route::inertia('dashboard','dashboard')->name('dashboard');
}); 
// Employee CRUD routes - all require auth
Route::resource('employees', EmployeeController::class)->middleware('auth');
// Role management routes - restricted to users with manage roles permissions
Route::middleware(['auth','permission:manage roles'])->group(function(){
    Route::resource('roles', RoleController::class)->except(['show']);
});

require __DIR__ . '/settings.php';