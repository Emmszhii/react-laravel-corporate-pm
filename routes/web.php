<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TaskController;
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
// Department routes - viewable by all, but create/edit/edit/delete restricted to admins
Route::resource('departments',DepartmentController::class)->only(['index'])->middleware(['auth']);
Route::resource('departments',DepartmentController::class)->except(['index','show'])->middleware(['auth','permission:manage departments']);
// project routes - viewable by all authenticated, create/edit/delete for managers and admins
Route::resource('projects', ProjectController::class)->only(['index'])->middleware(['auth']);
Route::resource('projects', ProjectController::class)->except(['index','show'])->middleware(['auth','permission:manage projects']);
// Task routes with auth middleware and permission-protected delete
Route::resource('tasks', TaskController::class)->only(['index'])->middleware(['auth']);
Route::resource('tasks', TaskController::class)
    ->middleware(['auth', 'verified'])
    ->middlewareFor('destroy', 'permission:delete tasks');

require __DIR__ . '/settings.php';