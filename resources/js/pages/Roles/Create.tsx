import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';

// Define permission and props interfaces
interface Permission {
    id: number;
    name: string;
}

interface Props {
    groupedPermissions: Record<string, Permission[]>;
}

export default function Create({ groupedPermissions }: Props) {
    // Initialize form with empty name and permissions array
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as string[],
    });

    // Toggle a permission in the selected array
    const togglePermission = (permissionName: string) => {
        const updated = data.permissions.includes(permissionName)
            ? data.permissions.filter((p) => p !== permissionName)
            : [...data.permissions, permissionName];
        setData('permissions', updated);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('roles/store');
    };

    return (
        <>
            <Head title="Create Role" />
            <div className="max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold">Create Role</h1>

                <form onSubmit={submit}>
                    {/* Role name input */}
                    <div className="mb-4">
                        <label className="mb-1 block font-medium">
                            Role Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded border p-2"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Permission checkboxes grouped by module */}
                    <div className="mb-6">
                        <h2 className="mb-3 font-medium">Permissions</h2>
                        {Object.entries(groupedPermissions).map(
                            ([module, permissions]) => (
                                <div key={module} className="mb-4">
                                    <h3 className="mb-2 font-semibold text-gray-700">
                                        {module}
                                    </h3>
                                    <div className="ml-4 grid grid-cols-2 gap-2">
                                        {permissions.map((permission) => (
                                            <label
                                                key={permission.id}
                                                className="flex items-center gap-2"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.permissions.includes(
                                                        permission.name,
                                                    )}
                                                    onChange={() =>
                                                        togglePermission(
                                                            permission.name,
                                                        )
                                                    }
                                                />
                                                {permission.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ),
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                            Create Role
                        </button>
                        <Link
                            href={'/roles'}
                            className="px-4 py-2 text-gray-600 hover:underline"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
