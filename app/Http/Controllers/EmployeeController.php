<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Models\Employee;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

// class EmployeeController extends Controller implements HasMiddleware
// {
//     public static function middleware(): array
//     {
//         return [
//             new Middleware('permission:manage employees', only: ['create', 'store', 'edit', 'update', 'destroy']),
//         ];
//     }

//     // ... rest of your existing methods stay the same
// }

class EmployeeController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:manage employees', only: ['index', 'create', 'store', 'edit', 'update', 'destroy']),
        ];
    }
    // Display a paginated list of all employees
    public function index(): Response
    {
        $employees = Employee::with(['department', 'user'])
            ->paginate(15);

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
        ]);
    }

    // Show the form for creating a new employee
    public function create(): Response
    {
        // Get departments for the dropdown
        $departments = Department::all();

        // Get users that are not yet linked to any employee
        $availableUsers = User::whereDoesntHave('employee')->get();

        return Inertia::render('Employees/Create', [
            'departments' => $departments,
            'availableUsers' => $availableUsers,
        ]);
    }

    // Store a newly created employee in the database
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|string|unique:employees',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'position' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'hire_date' => 'required|date',
            'salary' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive,terminated',
            'user_id' => 'nullable|exists:users,id',
        ]);

        Employee::create($validated);

        return redirect()->route('employees.index')
            ->with('success', 'Employee created successfully.');
    }

    // Display a single employee's details
    public function show(Employee $employee): Response
    {
        $employee->load(['department', 'user']);
        return Inertia::render('Employees/Show', [
            'employee' => $employee,
            // Pass whether current user can see salary
            'canViewSalary' => auth()->user()->hasRole('admin'),
        ]);
    }

    // Show the form for editing an existing employee
    public function edit(Employee $employee): Response
    {
        $departments = Department::all();

        // Get users not linked to any employee, plus the currently linked user
        $availableUsers = User::where(function ($query) use ($employee) {
            $query->whereDoesntHave('employee')
                ->orWhere('id', $employee->user_id);
        })->get();

        return Inertia::render('Employees/Edit', [
            'employee' => $employee,
            'departments' => $departments,
            'availableUsers' => $availableUsers,
        ]);
    }

    // Update an existing employee record
    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'employee_id' => 'required|string|unique:employees,employee_id,' . $employee->id,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'position' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'hire_date' => 'required|date',
            'salary' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive,terminated',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $employee->update($validated);

        return redirect()->route('employees.index')
            ->with('success', 'Employee updated successfully.');
    }

    // Delete an employee record (does not delete linked user)
    public function destroy(Employee $employee)
    {
        $employee->delete();

        return redirect()->route('employees.index')
            ->with('success', 'Employee deleted successfully.');
    }
}
