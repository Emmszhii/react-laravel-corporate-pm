<?php

namespace App\Http\Controllers;

use App\Http\Responses\InertiaPageResponse;
use App\Models\Employee;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // List tasks scoped by the current user's role
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Task::with(['project', 'assignee']);

        // Admins see all tasks across the company
        if ($user->hasRole('admin')) {
            // No scoping needed
        } elseif ($user->hasRole('manager')) {
            // Managers see tasks within their department's projects
            $departmentId = $user->employee?->department_id;
            $query->whereHas('project', function ($q) use ($departmentId) {
                $q->where('department_id', $departmentId);
            });
        } else {
            // Regular users see only their own assigned tasks
            $query->where('assigned_to_employee_id', $user->employee?->id);
        }

        // Apply optional filters for status and priority
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        $tasks = $query->latest()->get();

        return InertiaPageResponse::csr('Tasks/Index', [
            'tasks' => $tasks,
            'filters' => $request->only(['status', 'priority']),
        ]);
    }

    // Show the create task form with dropdown data
    public function create()
    {
        return InertiaPageResponse::csr('Tasks/Create', [
            'projects' => Project::all(['id', 'title']),
            'employees' => Employee::all(['id', 'first_name', 'last_name']),
        ]);
    }

    // Validate and store a new task
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'assigned_to_employee_id' => 'required|exists:employees,id',
            'status' => 'required|in:todo,in_progress,review,completed',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        Task::create($validated);

        return redirect()->route('tasks.index')
            ->with('success', 'Task created successfully.');
    }

    // Show the edit form pre-populated with task data
    public function edit(Task $task)
    {
        return InertiaPageResponse::csr('Tasks/Edit', [
            'task' => $task->load(['project', 'assignee']),
            'projects' => Project::all(['id', 'title']),
            'employees' => Employee::all(['id', 'first_name', 'last_name']),
        ]);
    }

    // Validate and update an existing task
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'assigned_to_employee_id' => 'required|exists:employees,id',
            'status' => 'required|in:todo,in_progress,review,completed',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);

        return redirect()->route('tasks.index')
            ->with('success', 'Task updated successfully.');
    }

    // Delete a task (protected by permission middleware in routes)
    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()->route('tasks.index')
            ->with('success', 'Task deleted successfully.');
    }
}