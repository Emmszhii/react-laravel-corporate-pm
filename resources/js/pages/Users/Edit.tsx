import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

// Type definitions for edit form props
interface Role {
    id: number;
    name: string;
}

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    roles: string[];
    employee: Employee | null;
    status: string;
}

interface Props {
    user: UserData;
    roles: Role[];
    availableEmployees: Employee[];
}

export default function Edit({ user, roles, availableEmployees }: Props) {
    // Pre-populate form with existing user data
    const { data, setData, put, processing, errors } = useForm({
        role: user.roles[0] || '',
        status: user.status,
        employee_id: user.employee?.id?.toString() || '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put(`/users/${user.id}`);
    }

    return (
        <>
            <Head title={`Edit User: ${user.email}`} />
            <div className="max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold">
                    Edit User: {user.email}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Role assignment */}
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

                    {/* Account status toggle */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Account Status
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full rounded border p-2"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        {errors.status && (
                            <p className="text-sm text-red-600">
                                {errors.status}
                            </p>
                        )}
                    </div>

                    {/* Employee link management */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Link to Employee
                        </label>
                        <select
                            value={data.employee_id}
                            onChange={(e) =>
                                setData('employee_id', e.target.value)
                            }
                            className="w-full rounded border p-2"
                        >
                            <option value="">No employee link (unlink)</option>
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
                        Update Account
                    </button>
                </form>
            </div>
        </>
    );
}
