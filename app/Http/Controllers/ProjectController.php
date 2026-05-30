<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Department;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    // List projects scoped by user role
    public function index(Request $request)
    {
        $user = $request->user();

        // Admin sees all projects
        if ($user->hasRole('admin')) {
            $projects = Project::with('department:id,name')->get();
        }
        // Manager sees projects in their department
        elseif ($user->hasRole('manager')) {
            $departmentId = $user->employee?->department_id;
            $projects = Project::with('department:id,name')
                ->where('department_id', $departmentId)
                ->get();
        }
        // Regular user sees only assigned projects
        else {
            $employeeId = $user->employee?->id;
            $projects = Project::with('department:id,name')
                ->whereHas('employees', function ($query) use ($employeeId) {
                    $query->where('project_employee.employee_id', $employeeId);
                })
                ->get();
        }

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    // Show the create form with departments and employees for assignment
    public function create()
    {
        $departments = Department::select('id', 'name')->get();
        $employees = Employee::select('id', 'first_name', 'last_name')->get();

        return Inertia::render('Projects/Create', [
            'departments' => $departments,
            'employees' => $employees,
        ]);
    }

    // Store a new project and sync assigned employees
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'department_id' => 'required|exists:departments,id',
            'status' => 'required|in:planning,active,completed,on_hold',
            'deadline' => 'nullable|date',
            'employee_ids' => 'array',
            'employee_ids.*' => 'exists:employees,id',
        ]);

        $project = Project::create($validated);

        // Sync the many-to-many employee assignment
        if (isset($validated['employee_ids'])) {
            $project->employees()->sync($validated['employee_ids']);
        }

        return redirect()->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    // Show project detail with tasks and assigned members
    public function show(Project $project)
    {
        $project->load(['department', 'employees', 'tasks.assignee']);

        return Inertia::render('Projects/Show', [
            'project' => $project,
        ]);
    }

    // Show the edit form pre-populated with project data
    public function edit(Project $project)
    {
        $project->load('employees');
        $departments = Department::select('id', 'name')->get();
        $employees = Employee::select('id', 'first_name', 'last_name')->get();

        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'departments' => $departments,
            'employees' => $employees,
        ]);
    }

    // Update project and re-sync employee assignments
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'department_id' => 'required|exists:departments,id',
            'status' => 'required|in:planning,active,completed,on_hold',
            'deadline' => 'nullable|date',
            'employee_ids' => 'array',
            'employee_ids.*' => 'exists:employees,id',
        ]);

        $project->update($validated);

        // Re-sync pivot table with new assignments
        if (isset($validated['employee_ids'])) {
            $project->employees()->sync($validated['employee_ids']);
        }

        return redirect()->route('projects.index')
            ->with('success', 'Project updated successfully.');
    }

    // Delete a project
    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}