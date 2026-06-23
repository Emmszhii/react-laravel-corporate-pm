<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Models\Employee;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// User account management routes (admin only)
Route::middleware(['auth', 'permission:manage users'])->group(function () {
    Route::get('/users', [\App\Http\Controllers\UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [\App\Http\Controllers\UserController::class, 'create'])->name('users.create');
    Route::post('/users', [\App\Http\Controllers\UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [\App\Http\Controllers\UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [\App\Http\Controllers\UserController::class, 'update'])->name('users.update');
});
// Role management routes - restricted to users with manage roles permissions
Route::middleware(['auth', 'permission:manage roles'])->group(function () {
    Route::resource('roles', RoleController::class)->except(['show']);
});
// Employee CRUD routes - all require auth
Route::resource('employees', EmployeeController::class)->middleware(['auth']);
// Department routes 
Route::resource('departments', DepartmentController::class)->middleware(['auth']);
// Route::resource('departments', DepartmentController::class)->except(['index', 'show'])->middleware(['auth', 'permission:manage departments']);
Route::resource('projects', ProjectController::class)->middleware('auth');
Route::resource('tasks', TaskController::class)->only(['index'])->middleware(['auth']);
Route::resource('tasks', TaskController::class)
    ->middleware(['auth', 'verified'])
    ->middlewareFor('destroy', 'permission:delete tasks');

require __DIR__ . '/settings.php';
