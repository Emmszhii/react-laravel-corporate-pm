import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';

// Define the shape of a role with counts
interface Role {
    id: number;
    name: string;
    permissions_count: number;
    users_count: number;
}

interface Props {
    roles: Role[];
}

export default function Index({ roles }: Props) {
    // Handle role deletion with confirmation
    const deleteRole = (id: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(`roles/${id}`);
        }
    };

    return (
        <>
            <Head title="Roles" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Roles</h1>
                    <Link
                        href={'roles/create'}
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                        Create Role
                    </Link>
                </div>

                {/* Roles table with name, permissions count, and user count */}
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-3 text-left">Role Name</th>
                            <th className="border p-3 text-left">
                                Permissions
                            </th>
                            <th className="border p-3 text-left">Users</th>
                            <th className="border p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => (
                            <tr key={role.id}>
                                <td className="border p-3 font-medium">
                                    {role.name}
                                </td>
                                <td className="border p-3">
                                    {role.permissions_count}
                                </td>
                                <td className="border p-3">
                                    {role.users_count}
                                </td>
                                <td className="space-x-2 border p-3">
                                    <Link
                                        href={`roles/${role.id}/edit`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => deleteRole(role.id)}
                                        className="text-red-500 hover:underline"
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
