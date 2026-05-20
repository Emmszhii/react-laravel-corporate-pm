<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    // Display all roles with permission and user counts
    public function index()
    {
        $roles = Role::withCount(['permissions', 'users'])->get();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
        ]);
    }

    // Show the create role form with grouped permissions
    public function create()
    {
        $groupedPermissions = $this->getGroupedPermissions();

        return Inertia::render('Roles/Create', [
            'groupedPermissions' => $groupedPermissions,
        ]);
    }

    // Validate and store a new role, then sync permissions
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'array',
        ]);

        $role = Role::create(['name' => $validated['name']]);
        $role->syncPermissions($validated['permissions'] ?? []);

        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully.');
    }

    // Show the edit form with existing role data and grouped permissions
    public function edit(Role $role)
    {
        $groupedPermissions = $this->getGroupedPermissions();

        return Inertia::render('Roles/Edit', [
            'role' => $role->load('permissions'),
            'groupedPermissions' => $groupedPermissions,
        ]);
    }

    // Validate and update the role name and sync permissions
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name,' . $role->id,
            'permissions' => 'array',
        ]);

        $role->update(['name' => $validated['name']]);
        $role->syncPermissions($validated['permissions'] ?? []);

        return redirect()->route('roles.index')
            ->with('success', 'Role updated successfully.');
    }

    // Delete the role
    public function destroy(Role $role)
    {
        $role->delete();

        return redirect()->route('roles.index')
            ->with('success', 'Role deleted successfully.');
    }

    // Group permissions by module category for the form display
    private function getGroupedPermissions()
    {
        $permissions = Permission::all();

        $modules = [
            'Employee Management' => ['view employees', 'manage employees'],
            'Department Management' => ['view departments', 'manage departments'],
            'Project Management' => ['view projects', 'manage projects'],
            'Task Management' => ['view tasks', 'create tasks', 'edit tasks', 'delete tasks'],
            'System Administration' => ['manage users', 'manage roles'],
        ];

        $grouped = [];
        foreach ($modules as $module => $permissionNames) {
            $grouped[$module] = $permissions->filter(function ($permission) use ($permissionNames) {
                return in_array($permission->name, $permissionNames);
            })->values();
        }

        return $grouped;
    }
}