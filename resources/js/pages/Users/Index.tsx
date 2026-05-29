import { Head, Link } from '@inertiajs/react';

// Type definitions for user data
interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
    employee: { id: number; first_name: string; last_name: string } | null;
    status: string;
}

interface Props {
    users: User[];
}

export default function Index({ users }: Props) {
    return (
        <>
            <Head title="User Accounts" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">User Accounts</h1>
                    <Link
                        href={'/users/create'}
                        className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-700"
                    >
                        Create User Account
                    </Link>
                </div>

                {/* User accounts table */}
                <table className="w-full border-collapse rounded shadow">
                    <thead>
                        <tr className="text-left">
                            <th className="p-3">Email</th>
                            <th className="p-3">Roles</th>
                            <th className="p-3">Linked Employee</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t">
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">
                                    {/* Display roles as badges */}
                                    {user.roles.map((role) => (
                                        <span
                                            key={role}
                                            className="mr-1 rounded bg-purple-100 px-2 py-1 text-xs text-purple-800"
                                        >
                                            {role}
                                        </span>
                                    ))}
                                </td>
                                <td className="p-3">
                                    {/* Show linked employee name or placeholder */}
                                    {user.employee
                                        ? `${user.employee.first_name} ${user.employee.last_name}`
                                        : 'No employee record'}
                                </td>
                                <td className="p-3">
                                    <span
                                        className={`rounded px-2 py-1 text-xs ${
                                            user.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <Link
                                        href={`/users/${user.id}/edit`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
