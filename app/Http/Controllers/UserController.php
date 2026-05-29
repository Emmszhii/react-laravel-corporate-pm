<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    // Display all user accounts with their roles and linked employee
    public function index()
    {
        $users = User::with(['roles', 'employee'])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->getRoleNames(),
                    'employee' => $user->employee,
                    'status' => $user->status ?? 'active',
                ];
            });

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    // Show the form for creating a new user account
    public function create()
    {
        $roles = Role::all();
        // Get employees not yet linked to any user account
        $availableEmployees = Employee::whereNull('user_id')->get();

        return Inertia::render('Users/Create', [
            'roles' => $roles,
            'availableEmployees' => $availableEmployees,
        ]);
    }

    // Store a new user account with role and optional employee link
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string|exists:roles,name',
            'employee_id' => 'nullable|exists:employees,id',
        ]);

        // Create the user account
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Assign the selected role
        $user->assignRole($validated['role']);

        // Link to employee record if specified
        if (!empty($validated['employee_id'])) {
            Employee::where('id', $validated['employee_id'])
                ->update(['user_id' => $user->id]);
        }

        return redirect()->route('users.index')
            ->with('message', 'User account created successfully.');
    }

    // Show the form for editing a user account
    public function edit(User $user)
    {
        $roles = Role::all();
        $availableEmployees = Employee::where(function ($query) use ($user) {
            $query->whereNull('user_id')
                ->orWhere('user_id', $user->id);
        })->get();

        return Inertia::render('Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
                'employee' => $user->employee,
                'status' => $user->status ?? 'active',
            ],
            'roles' => $roles,
            'availableEmployees' => $availableEmployees,
        ]);
    }

    // Update user roles, status, and employee link
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|string|exists:roles,name',
            'status' => 'required|in:active,inactive',
            'employee_id' => 'nullable|exists:employees,id',
        ]);

        // Sync the role (remove old roles, assign new one)
        $user->syncRoles([$validated['role']]);

        // Update account status
        $user->update(['status' => $validated['status']]);

        // Handle employee linking/unlinking
        // First unlink any currently linked employee
        Employee::where('user_id', $user->id)->update(['user_id' => null]);

        // Then link the new employee if specified
        if (!empty($validated['employee_id'])) {
            Employee::where('id', $validated['employee_id'])
                ->update(['user_id' => $user->id]);
        }

        return redirect()->route('users.index')
            ->with('message', 'User account updated successfully.');
    }
}
