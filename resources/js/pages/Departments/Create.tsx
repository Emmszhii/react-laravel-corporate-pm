import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';

// Type for employee dropdown options
interface Employee {
    id: number;
    first_name: string;
    last_name: string;
}

interface Props {
    employees: Employee[];
}

export default function Create({ employees }: Props) {
    // Initialize form with empty department fields
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        head_employee_id: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/departments');
    }

    return (
        <>
            <Head title="Create Department" />
            <div className="max-w-lg p-6">
                <h1 className="mb-6 text-2xl font-bold">Create Department</h1>
                <form onSubmit={submit} className="space-y-4">
                    {/* Department name field */}
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

                    {/* Optional description field */}
                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="w-full rounded border p-2"
                        />
                        {errors.description && (
                            <div className="text-sm text-red-600">
                                {errors.description}
                            </div>
                        )}
                    </div>

                    {/* Department head dropdown populated from employees list */}
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
                        {errors.head_employee_id && (
                            <div className="text-sm text-red-600">
                                {errors.head_employee_id}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Create Department
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
