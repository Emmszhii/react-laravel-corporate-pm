<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TaskController;
use App\Models\Employee;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('/dashboard', function () {
    $user = auth()->user();
    $props = ['role' => 'employee'];
    if ($user->hasRole('admin')) {
        $props = [
            'role' => 'admin',
            'stats' => [
                'totalProjects' => Project::count(),
                'totalTasks' => Task::count(),
                'totalEmployees' => Employee::count(),
                'totalUsersWithoutEmployee' => User::whereDoesntHave('employee')->count(),
            ],
        ];
    } elseif ($user->hasRole('manager')) {
        $departmentId = $user->employee?->department_id;
        $props = [
            'role' => 'manager',
            'departmentProjects' => Project::where('department_id', $departmentId)->get(['id', 'title', 'status']),
            'pendingTasks' => Task::whereHas('project', fn($q) => $q->where('department_id', $departmentId))->where('status', 'pending')->get(['id', 'title', 'due_date']),
        ];
    } else {
        $employeeId = $user->employee?->id;
        $props = [
            'role' => 'employee',
            'myTasks' => Task::where('assigned_to_employee_id', $employeeId)->get(['id', 'title', 'status', 'due_date']),
            'upcomingDeadlines' => Task::where('assigned_to_employee_id', $employeeId)
                ->whereNotNull('due_date')
                ->where('due_date', '=>', now())
                ->orderBy('due_date')
                ->limit(5)
                ->get(['id', 'title', 'due_date'])
        ];
    };
    return Inertia\Inertia::render('Dashboard', $props);
})->middleware(['auth', 'verified'])->name('Dashboard');
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
