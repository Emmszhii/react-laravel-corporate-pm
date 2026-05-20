<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create three departments
        $engineering = Department::create([
            'name' => 'Engineering',
            'description' => 'Software development and technical operations',
        ]);

        $marketing = Department::create([
            'name' => 'Marketing',
            'description' => 'Brand management and growth initiatives',
        ]);

        $hr = Department::create([
            'name' => 'HR',
            'description' => 'Human resources and talent management',
        ]);

        // Admin user with NO employee record (demonstrates user-without-employee)
        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);
        $adminUser->assignRole('admin');

        // Manager user linked to an employee record in Engineering
        $managerUser = User::create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
        ]);
        $managerUser->assignRole('manager');

        $managerEmployee = Employee::create([
            'employee_id' => 'EMP-001',
            'first_name' => 'Manager',
            'last_name' => 'User',
            'email' => 'manager@example.com',
            'position' => 'Engineering Lead',
            'department_id' => $engineering->id,
            'user_id' => $managerUser->id,
            'hire_date' => '2023-01-15',
            'salary' => 95000,
            'status' => 'active',
        ]);

        // Employee user linked to an employee record
        $employeeUser = User::create([
            'name' => 'Employee User',
            'email' => 'employee@example.com',
            'password' => Hash::make('password'),
        ]);
        $employeeUser->assignRole('employee');

        Employee::create([
            'employee_id' => 'EMP-002',
            'first_name' => 'Employee',
            'last_name' => 'User',
            'email' => 'employee@example.com',
            'position' => 'Software Developer',
            'department_id' => $engineering->id,
            'user_id' => $employeeUser->id,
            'hire_date' => '2023-06-01',
            'salary' => 75000,
            'status' => 'active',
        ]);

        // Employee record with NO user account (demonstrates employee-without-login)
        Employee::create([
            'employee_id' => 'EMP-003',
            'first_name' => 'New',
            'last_name' => 'Hire',
            'email' => 'newhire@example.com',
            'position' => 'Marketing Specialist',
            'department_id' => $marketing->id,
            'user_id' => null,
            'hire_date' => '2024-01-10',
            'salary' => 65000,
            'status' => 'active',
        ]);

        // Set the department head for Engineering
        $engineering->update(['head_employee_id' => $managerEmployee->id]);
    }
}
