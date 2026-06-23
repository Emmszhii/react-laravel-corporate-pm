<?php

namespace App\Http\Controllers;

use App\Http\Responses\InertiaPageResponse;
use App\Models\Employee;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
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
        }
        // Use CSR for authenticated dashboard
        return InertiaPageResponse::csr('Dashboard', $props);
    }
}
