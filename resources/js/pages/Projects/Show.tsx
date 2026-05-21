import { Head, Link } from '@inertiajs/react';

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
}

interface Task {
    id: number;
    title: string;
    status: string;
    priority: string;
    due_date: string | null;
    assignee: Employee | null;
}

interface Project {
    id: number;
    title: string;
    description: string | null;
    status: string;
    deadline: string | null;
    department: { id: number; name: string } | null;
    employees: Employee[];
    tasks: Task[];
}

interface Props {
    project: Project;
}

export default function Show({ project }: Props) {
    return (
        <>
            <Head title={project.title} />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{project.title}</h1>
                    <Link
                        href={`/projects/${project.id}/edit`}
                        className="btn-primary"
                    >
                        Edit Project
                    </Link>
                </div>

                {/* Project details section */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        {project.description || 'No description'}
                    </p>
                    <div className="mt-2 flex gap-4 text-sm">
                        <span>Status: {project.status}</span>
                        <span>Department: {project.department?.name}</span>
                        {project.deadline && (
                            <span>
                                Deadline:{' '}
                                {new Date(
                                    project.deadline,
                                ).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Assigned members list */}
                <div className="mb-6">
                    <h2 className="mb-2 text-lg font-semibold">
                        Assigned Members
                    </h2>
                    <ul className="list-disc pl-5">
                        {project.employees.map((emp) => (
                            <li key={emp.id}>
                                {emp.first_name} {emp.last_name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tasks list for this project */}
                <div>
                    <h2 className="mb-2 text-lg font-semibold">Tasks</h2>
                    {project.tasks.length === 0 ? (
                        <p className="text-gray-500">No tasks yet.</p>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border p-2 text-left">
                                        Title
                                    </th>
                                    <th className="border p-2 text-left">
                                        Assignee
                                    </th>
                                    <th className="border p-2 text-left">
                                        Status
                                    </th>
                                    <th className="border p-2 text-left">
                                        Priority
                                    </th>
                                    <th className="border p-2 text-left">
                                        Due Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {project.tasks.map((task) => (
                                    <tr key={task.id}>
                                        <td className="border p-2">
                                            {task.title}
                                        </td>
                                        <td className="border p-2">
                                            {task.assignee
                                                ? `${task.assignee.first_name} ${task.assignee.last_name}`
                                                : 'Unassigned'}
                                        </td>
                                        <td className="border p-2">
                                            {task.status}
                                        </td>
                                        <td className="border p-2">
                                            {task.priority}
                                        </td>
                                        <td className="border p-2">
                                            {task.due_date
                                                ? new Date(
                                                      task.due_date,
                                                  ).toLocaleDateString()
                                                : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}
