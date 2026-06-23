<?php

namespace App\Http\Controllers;

use App\Http\Responses\InertiaPageResponse;
use App\Models\Department;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class DepartmentController extends Controller implements HasMiddleware
{
    // IMPLEMENT ROLED BASED ACCESS CONTROL
    public static function middleware(): array
    {
        return [new Middleware('permission:manage departments', only: ['index', 'create', 'store', 'edit', 'update', 'destroy'])];
    }

    // List all departments with employee count and head employee name
    public function index()
    {
        $departments = Department::withCount('employees')
            ->with('headEmployee:id,first_name,last_name')
            ->get();

        return InertiaPageResponse::csr('Departments/Index', [
            'departments' => $departments,
        ]);
    }

    // Show the create form with employees list for head selection
    public function create()
    {
        $employees = Employee::select('id', 'first_name', 'last_name')->get();

        return InertiaPageResponse::csr('Departments/Create', [
            'employees' => $employees,
        ]);
    }

    // Store a new department
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'head_employee_id' => 'nullable|exists:employees,id',
        ]);

        Department::create($validated);

        return redirect()->route('departments.index')
            ->with('success', 'Department created successfully.');
    }

    // Show the edit form with current data and employees list
    public function edit(Department $department)
    {
        $employees = Employee::select('id', 'first_name', 'last_name')->get();

        return InertiaPageResponse::csr('Departments/Edit', [
            'department' => $department,
            'employees' => $employees,
        ]);
    }

    // Update an existing department
    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'head_employee_id' => 'nullable|exists:employees,id',
        ]);

        $department->update($validated);

        return redirect()->route('departments.index')
            ->with('success', 'Department updated successfully.');
    }

    // Delete a department
    public function destroy(Department $department)
    {
        $department->delete();

        return redirect()->route('departments.index')
            ->with('success', 'Department deleted successfully.');
    }
}
