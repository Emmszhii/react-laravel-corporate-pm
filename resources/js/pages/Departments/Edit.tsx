import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
}

interface Department {
    id: number;
    name: string;
    description: string | null;
    head_employee_id: number | null;
}

interface Props {
    department: Department;
    employees: Employee[];
}

export default function Edit({ department, employees }: Props) {
    // Pre-populate form with existing department data
    const { data, setData, put, processing, errors } = useForm({
        name: department.name,
        description: department.description || '',
        head_employee_id: department.head_employee_id?.toString() || '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/departments/${department.id}`);
    }

    return (
        <>
            <Head title="Edit Department" />
            <div className="max-w-lg p-6">
                <h1 className="mb-6 text-2xl font-bold">Edit Department</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block font-medium">Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded border p-2"
                        />
                        {errors.name && (
                            <div className="text-sm text-red-600">
                                {errors.name}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="w-full rounded border p-2"
                        />
                    </div>

                    {/* Pre-selected department head from existing data */}
                    <div>
                        <label className="block font-medium">
                            Department Head
                        </label>
                        <select
                            value={data.head_employee_id}
                            onChange={(e) =>
                                setData('head_employee_id', e.target.value)
                            }
                            className="w-full rounded border p-2"
                        >
                            <option value="">Select a head (optional)</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.first_name} {emp.last_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Update Department
                        </button>
                        <Link
                            href="/departments"
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
