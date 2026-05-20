import { Head, Link, router } from '@inertiajs/react';

// TypeScript interfaces for the employee data
interface Department {
    id: number;
    name: string;
}

interface User {
    id: number;
    email: string;
}

interface Employee {
    id: number;
    employee_id: string;
    first_name: string;
    last_name: string;
    email: string;
    position: string;
    status: string;
    department: Department | null;
    user: User | null;
}

interface PaginatedEmployees {
    data: Employee[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    employees: PaginatedEmployees;
}

export default function Index({ employees }: Props) {
    // Handle employee deletion with confirmation
    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this employee?')) {
            router.delete(`/employees/${id}`);
        }
    }

    return (
        <>
            <Head title="Employees" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Employees</h1>
                    <Link
                        href="/employees/create"
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Add Employee
                    </Link>
                </div>

                {/* Employee table */}
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 text-left">
                                Employee ID
                            </th>
                            <th className="border p-2 text-left">Name</th>
                            <th className="border p-2 text-left">Department</th>
                            <th className="border p-2 text-left">Position</th>
                            <th className="border p-2 text-left">Status</th>
                            <th className="border p-2 text-left">
                                Has Account
                            </th>
                            <th className="border p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.data.map((employee) => (
                            <tr key={employee.id}>
                                <td className="border p-2">
                                    {employee.employee_id}
                                </td>
                                <td className="border p-2">
                                    {employee.first_name} {employee.last_name}
                                </td>
                                <td className="border p-2">
                                    {employee.department?.name ?? 'N/A'}
                                </td>
                                <td className="border p-2">
                                    {employee.position}
                                </td>
                                <td className="border p-2">
                                    <span
                                        className={`rounded px-2 py-1 text-sm ${
                                            employee.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {employee.status}
                                    </span>
                                </td>
                                <td className="border p-2">
                                    {/* Boolean badge showing linked account */}
                                    {employee.user ? (
                                        <span className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-800">
                                            Yes
                                        </span>
                                    ) : (
                                        <span className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-600">
                                            No
                                        </span>
                                    )}
                                </td>
                                <td className="space-x-2 border p-2">
                                    <Link
                                        href={`/employees/${employee.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        href={`/employees/${employee.id}/edit`}
                                        className="text-yellow-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleDelete(employee.id)
                                        }
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination links */}
                <div className="mt-4 flex gap-2">
                    {employees.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url ?? '#'}
                            className={`rounded border px-3 py-1 ${
                                link.active
                                    ? 'bg-blue-600 text-white'
                                    : 'hover:bg-gray-100'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
