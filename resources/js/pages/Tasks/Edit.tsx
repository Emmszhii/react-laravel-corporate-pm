import { Head, Link, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';

interface Task {
    id: number;
    title: string;
    description: string;
    project_id: number;
    assigned_to_employee_id: number;
    status: string;
    priority: string;
    due_date: string | null;
}

interface Props {
    task: Task;
    projects: { id: number; title: string }[];
    employees: { id: number; first_name: string; last_name: string }[];
}

export default function Edit({ task, projects, employees }: Props) {
    // Pre-populate form with existing task data
    const { data, setData, put, processing, errors } = useForm({
        title: task.title,
        description: task.description || '',
        project_id: String(task.project_id),
        assigned_to_employee_id: String(task.assigned_to_employee_id),
        status: task.status,
        priority: task.priority,
        due_date: task.due_date || '',
    });

    // Submit the updated form data
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/tasks/${task.id}`);
    }

    // Inline status update without a full form submission
    function updateStatus(newStatus: string) {
        router.put(
            `/tasks/${task.id}`,
            {
                ...data,
                status: newStatus,
            },
            { preserveState: true },
        );
    }

    return (
        <>
            <Head title="Edit Task" />
            <div className="max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold">Edit Task</h1>

                {/* Inline status update buttons */}
                <div className="mb-6 rounded bg-gray-50/10 p-4">
                    <label className="mb-2 block font-medium">
                        Quick Status Update
                    </label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => updateStatus('todo')}
                            className={`rounded px-3 py-1 text-black ${data.status === 'todo' ? 'bg-yellow-200' : 'bg-gray-200'}`}
                        >
                            Todo
                        </button>
                        <button
                            onClick={() => updateStatus('in_progress')}
                            className={`rounded px-3 py-1 text-black ${data.status === 'in_progress' ? 'bg-blue-200' : 'bg-gray-200'}`}
                        >
                            In Progress
                        </button>
                        <button
                            onClick={() => updateStatus('review')}
                            className={`rounded px-3 py-1 text-black ${data.status === 'review' ? 'bg-green-200' : 'bg-gray-200'}`}
                        >
                            Review
                        </button>
                        <button
                            onClick={() => updateStatus('completed')}
                            className={`rounded px-3 py-1 text-black ${data.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'}`}
                        >
                            Completed
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Task title */}
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

                    {/* Description */}
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

                    {/* Project dropdown */}
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
                            <option value="pending">Pending</option>
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

                    {/* Due date */}
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
                            Update Task
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
