import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Department {
    id: number;
    name: string;
}

interface User {
    id: number;
    email: string;
}

interface Props {
    departments: Department[];
    availableUsers: User[];
}

export default function Create({ departments, availableUsers }: Props) {
    // Initialize form with all employee fields
    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        position: '',
        department_id: '',
        hire_date: '',
        salary: '',
        status: 'active',
        user_id: '', // Optional link to user account
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/employees');
    }

    return (
        <>
            <Head title="Create Employee" />
            <div className="max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold">Create Employee</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Employee ID */}
                    <div>
                        <label className="block font-medium">Employee ID</label>
                        <input
                            type="text"
                            value={data.employee_id}
                            onChange={(e) =>
                                setData('employee_id', e.target.value)
                            }
                            className="w-full rounded border p-2"
                        />
                        {errors.employee_id && (
                            <p className="text-sm text-red-600">
                                {errors.employee_id}
                            </p>
                        )}
                    </div>

                    {/* First and Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium">
                                First Name
                            </label>
                            <input
                                type="text"
                                value={data.first_name}
                                onChange={(e) =>
                                    setData('first_name', e.target.value)
                                }
                                className="w-full rounded border p-2"
                            />
                            {errors.first_name && (
                                <p className="text-sm text-red-600">
                                    {errors.first_name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block font-medium">
                                Last Name
                            </label>
                            <input
                                type="text"
                                value={data.last_name}
                                onChange={(e) =>
                                    setData('last_name', e.target.value)
                                }
                                className="w-full rounded border p-2"
                            />
                            {errors.last_name && (
                                <p className="text-sm text-red-600">
                                    {errors.last_name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className="w-full rounded border p-2"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block font-medium">Phone</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                className="w-full rounded border p-2"
                            />
                        </div>
                    </div>

                    {/* Position */}
                    <div>
                        <label className="block font-medium">Position</label>
                        <input
                            type="text"
                            value={data.position}
                            onChange={(e) =>
                                setData('position', e.target.value)
                            }
                            className="w-full rounded border p-2"
                        />
                        {errors.position && (
                            <p className="text-sm text-red-600">
                                {errors.position}
                            </p>
                        )}
                    </div>

                    {/* Department dropdown */}
                    <div>
                        <label className="block font-medium">Department</label>
                        <select
                            value={data.department_id}
                            onChange={(e) =>
                                setData('department_id', e.target.value)
                            }
                            className="w-full rounded border p-2"
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                        {errors.department_id && (
                            <p className="text-sm text-red-600">
                                {errors.department_id}
                            </p>
                        )}
                    </div>

                    {/* Hire Date and Salary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium">
                                Hire Date
                            </label>
                            <input
                                type="date"
                                value={data.hire_date}
                                onChange={(e) =>
                                    setData('hire_date', e.target.value)
                                }
                                className="w-full rounded border p-2"
                            />
                            {errors.hire_date && (
                                <p className="text-sm text-red-600">
                                    {errors.hire_date}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block font-medium">Salary</label>
                            <input
                                type="number"
                                value={data.salary}
                                onChange={(e) =>
                                    setData('salary', e.target.value)
                                }
                                className="w-full rounded border p-2"
                            />
                            {errors.salary && (
                                <p className="text-sm text-red-600">
                                    {errors.salary}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block font-medium">Status</label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full rounded border p-2"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="terminated">Terminated</option>
                        </select>
                    </div>

                    {/* Optional: Link to User Account */}
                    <div>
                        <label className="block font-medium">
                            Link to User Account (Optional)
                        </label>
                        <select
                            value={data.user_id}
                            onChange={(e) => setData('user_id', e.target.value)}
                            className="w-full rounded border p-2"
                        >
                            <option value="">No linked account</option>
                            {availableUsers.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.email}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-sm text-gray-500">
                            Only users without an existing employee link are
                            shown.
                        </p>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Create Employee
                        </button>
                        <Link
                            href="/employees"
                            className="rounded border px-6 py-2 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
