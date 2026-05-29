import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

// Type definitions for form props
interface Role {
    id: number;
    name: string;
}

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
}

interface Props {
    roles: Role[];
    availableEmployees: Employee[];
}

export default function Create({ roles, availableEmployees }: Props) {
    // Inertia form helper manages form state and submission
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: '',
        employee_id: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post(`/users`);
    }

    return (
        <>
            <Head title="Create User Account" />
            <div className="max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold">Create User Account</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name field */}
                    <div>
                        <label className="mb-1 block font-medium">Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded border p-2"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email field */}
                    <div>
                        <label className="mb-1 block font-medium">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded border p-2"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password field */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="w-full rounded border p-2"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-600">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Role selection */}
                    <div>
                        <label className="mb-1 block font-medium">Role</label>
                        <select
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="w-full rounded border p-2"
                        >
                            <option value="">Select a role</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <p className="text-sm text-red-600">
                                {errors.role}
                            </p>
                        )}
                    </div>

                    {/* Optional employee linking */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Link to Employee (optional)
                        </label>
                        <select
                            value={data.employee_id}
                            onChange={(e) =>
                                setData('employee_id', e.target.value)
                            }
                            className="w-full rounded border p-2"
                        >
                            <option value="">No employee link</option>
                            {availableEmployees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.first_name} {emp.last_name}
                                </option>
                            ))}
                        </select>
                        {errors.employee_id && (
                            <p className="text-sm text-red-600">
                                {errors.employee_id}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </>
    );
}
