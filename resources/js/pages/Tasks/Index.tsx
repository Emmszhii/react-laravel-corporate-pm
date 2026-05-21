import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

// Type definitions for task data
interface Task {
    id: number;
    title: string;
    project: { id: number; title: string };
    assignee: { id: number; first_name: string; last_name: string };
    status: string;
    priority: string;
    due_date: string | null;
}

interface Props {
    tasks: Task[];
    filters: { status?: string; priority?: string };
}

export default function Index({ tasks, filters }: Props) {
    const [status, setStatus] = useState(filters.status || '');
    const [priority, setPriority] = useState(filters.priority || '');

    // Apply filters by reloading the page with query parameters
    function applyFilters() {
        router.get('/tasks', { status, priority }, { preserveState: true });
    }

    // Map status values to display badge colors
    function statusBadge(status: string) {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            in_progress: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    // Map priority values to display badge colors
    function priorityBadge(priority: string) {
        const colors: Record<string, string> = {
            low: 'bg-gray-100 text-gray-800',
            medium: 'bg-orange-100 text-orange-800',
            high: 'bg-red-100 text-red-800',
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    }

    return (
        <>
            <Head title="Tasks" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Tasks</h1>
                    <Link href="/tasks/create" className="btn-primary">
                        Create Task
                    </Link>
                </div>

                {/* Filter controls for status and priority */}
                <div className="mb-4 flex gap-4">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded border px-3 py-2"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="rounded border px-3 py-2"
                    >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <button onClick={applyFilters} className="btn-secondary">
                        Filter
                    </button>
                </div>

                {/* Task table with columns for all key fields */}
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2 text-left">Title</th>
                            <th className="p-2 text-left">Project</th>
                            <th className="p-2 text-left">Assignee</th>
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-left">Priority</th>
                            <th className="p-2 text-left">Due Date</th>
                            <th className="p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id} className="border-b">
                                <td className="p-2">{task.title}</td>
                                <td className="p-2">{task.project?.title}</td>
                                <td className="p-2">
                                    {task.assignee?.first_name}{' '}
                                    {task.assignee?.last_name}
                                </td>
                                <td className="p-2">
                                    <span
                                        className={`rounded px-2 py-1 text-sm ${statusBadge(task.status)}`}
                                    >
                                        {task.status}
                                    </span>
                                </td>
                                <td className="p-2">
                                    <span
                                        className={`rounded px-2 py-1 text-sm ${priorityBadge(task.priority)}`}
                                    >
                                        {task.priority}
                                    </span>
                                </td>
                                <td className="p-2">{task.due_date || '—'}</td>
                                <td className="flex gap-2 p-2">
                                    <Link
                                        href={`/tasks/${task.id}/edit`}
                                        className="text-blue-600"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={`/tasks/${task.id}`}
                                        method="delete"
                                        as="button"
                                        className="text-red-600"
                                    >
                                        Delete
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
