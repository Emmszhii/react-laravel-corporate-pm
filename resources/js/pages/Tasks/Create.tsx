import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';

interface Props {
    projects: { id: number; title: string }[];
    employees: { id: number; first_name: string; last_name: string }[];
}

export default function Create({ projects, employees }: Props) {
    // Initialize form state with Inertia's useForm hook
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        project_id: '',
        assigned_to_employee_id: '',
        status: 'todo',
        priority: 'medium',
        due_date: '',
    });

    // Submit the form data to the store endpoint
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/tasks');
    }

    return (
        <>
            <Head title="Create Task" />
            <div className="max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold">Create Task</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Task title input */}
                    <div>
                        <label className="block font-medium">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-600">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Task description textarea */}
                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="w-full rounded border px-3 py-2"
                            rows={3}
                        />
                    </div>

                    {/* Project selection dropdown */}
                    <div>
                        <label className="block font-medium">Project</label>
                        <select
                            value={data.project_id}
                            onChange={(e) =>
                                setData('project_id', e.target.value)
                            }
                            className="w-full rounded border px-3 py-2"
                        >
                            <option value="">Select Project</option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.title}
                                </option>
                            ))}
                        </select>
                        {errors.project_id && (
                            <p className="text-sm text-red-600">
                                {errors.project_id}
                            </p>
                        )}
                    </div>

                    {/* Employee assignee dropdown */}
                    <div>
                        <label className="block font-medium">Assign To</label>
                        <select
                            value={data.assigned_to_employee_id}
                            onChange={(e) =>
                                setData(
                                    'assigned_to_employee_id',
                                    e.target.value,
                                )
                            }
                            className="w-full rounded border px-3 py-2"
                        >
                            <option value="">Select Employee</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.first_name} {emp.last_name}
                                </option>
                            ))}
                        </select>
                        {errors.assigned_to_employee_id && (
                            <p className="text-sm text-red-600">
                                {errors.assigned_to_employee_id}
                            </p>
                        )}
                    </div>

                    {/* Status dropdown */}
                    <div>
                        <label className="block font-medium">Status</label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        >
                            <option value="todo">Todo</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Priority dropdown */}
                    <div>
                        <label className="block font-medium">Priority</label>
                        <select
                            value={data.priority}
                            onChange={(e) =>
                                setData('priority', e.target.value)
                            }
                            className="w-full rounded border px-3 py-2"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    {/* Due date picker */}
                    <div>
                        <label className="block font-medium">Due Date</label>
                        <input
                            type="date"
                            value={data.due_date}
                            onChange={(e) =>
                                setData('due_date', e.target.value)
                            }
                            className="w-full rounded border px-3 py-2"
                        />
                    </div>

                    {/* Form action buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-600 px-4 py-2 text-white"
                        >
                            Create Task
                        </button>
                        <Link
                            href="/tasks"
                            className="rounded border px-4 py-2"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
