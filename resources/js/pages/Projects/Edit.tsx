import { Head, Link, useForm } from '@inertiajs/react';

interface Department {
    id: number;
    name: string;
}

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
}

interface Project {
    id: number;
    title: string;
    description: string | null;
    department_id: number;
    status: string;
    deadline: string | null;
    employees: Employee[];
}

interface Props {
    project: Project;
    departments: Department[];
    employees: Employee[];
}

export default function Edit({ project, departments, employees }: Props) {
    // Pre-populate form with existing project data including assigned employee IDs
    const { data, setData, put, processing, errors } = useForm({
        title: project.title,
        description: project.description || '',
        department_id: project.department_id.toString(),
        status: project.status,
        deadline: project.deadline || '',
        employee_ids: project.employees.map((emp) => emp.id),
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/projects/${project.id}`);
    }

    function toggleEmployee(employeeId: number) {
        const current = data.employee_ids;
        if (current.includes(employeeId)) {
            setData(
                'employee_ids',
                current.filter((id) => id !== employeeId),
            );
        } else {
            setData('employee_ids', [...current, employeeId]);
        }
    }

    return (
        <>
            <Head title="Edit Project" />
            <div className="max-w-lg p-6">
                <h1 className="mb-6 text-2xl font-bold">Edit Project</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block font-medium">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded border p-2"
                        />
                        {errors.title && (
                            <div className="text-sm text-red-600">
                                {errors.title}
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

                    <div>
                        <label className="block font-medium">Department</label>
                        <select
                            value={data.department_id}
                            onChange={(e) =>
                                setData('department_id', e.target.value)
                            }
                            className="w-full rounded border p-2"
                        >
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium">Status</label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full rounded border p-2"
                        >
                            <option value="planning">Planning</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="on_hold">On Hold</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium">Deadline</label>
                        <input
                            type="date"
                            value={data.deadline}
                            onChange={(e) =>
                                setData('deadline', e.target.value)
                            }
                            className="w-full rounded border p-2"
                        />
                    </div>

                    {/* Pre-checked employee assignment checkboxes */}
                    <div>
                        <label className="mb-2 block font-medium">
                            Assign Employees
                        </label>
                        <div className="max-h-48 overflow-y-auto rounded border p-2">
                            {employees.map((emp) => (
                                <label
                                    key={emp.id}
                                    className="flex items-center gap-2 p-1"
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.employee_ids.includes(
                                            emp.id,
                                        )}
                                        onChange={() => toggleEmployee(emp.id)}
                                    />
                                    {emp.first_name} {emp.last_name}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn-primary"
                        >
                            Update Project
                        </button>
                        <Link
                            href="/projects"
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
