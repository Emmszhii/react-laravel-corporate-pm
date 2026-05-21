import { Head, Link, router } from '@inertiajs/react';

// Type definitions for department data
interface Department {
    id: number;
    name: string;
    description: string | null;
    employees_count: number;
    head_employee: { id: number; first_name: string; last_name: string } | null;
}

interface Props {
    departments: Department[];
}

export default function Index({ departments }: Props) {
    // Handle department deletion with confirmation
    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this department?')) {
            router.delete(`/departments/${id}`);
        }
    }

    return (
        <>
            <Head title="Departments" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Departments</h1>
                    <Link href="/departments/create" className="btn-primary">
                        Create Department
                    </Link>
                </div>

                {/* Department table with name, employee count, and head */}
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border p-2 text-left">Name</th>
                            <th className="border p-2 text-left">Employees</th>
                            <th className="border p-2 text-left">
                                Department Head
                            </th>
                            <th className="border p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((dept) => (
                            <tr key={dept.id}>
                                <td className="border p-2">{dept.name}</td>
                                <td className="border p-2">
                                    {dept.employees_count}
                                </td>
                                <td className="border p-2">
                                    {dept.head_employee
                                        ? `${dept.head_employee.first_name} ${dept.head_employee.last_name}`
                                        : 'Not assigned'}
                                </td>
                                <td className="border p-2">
                                    <Link
                                        href={`/departments/${dept.id}/edit`}
                                        className="mr-2 text-blue-600"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(dept.id)}
                                        className="text-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
