import { Head } from '@inertiajs/react';

interface Props {
    role: string;
    stats?: {
        totalProjects: number;
        totalTasks: number;
        totalEmployees: number;
        totalUsersWithoutEmployee: number;
    };
    departmentProjects?: { id: number; title: string; status: string }[];
    pendingTasks?: { id: number; title: string; due_date: string | null }[];
    myTasks?: {
        id: number;
        title: string;
        status: string;
        due_date: string | null;
    }[];
    upcomingDeadlines?: { id: number; title: string; due_date: string }[];
}

export default function Dashboard({
    role,
    stats,
    departmentProjects,
    pendingTasks,
    myTasks,
    upcomingDeadlines,
}: Props) {
    console.log('role', role);
    console.log('stats', stats);
    return (
        <>
            <Head title="Dashboard" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

                {/* Admin view: company-wide statistics */}
                {role === 'admin' && stats && (
                    <div className="grid grid-cols-4 gap-4">
                        <div className="flex flex-col justify-between gap-4 rounded bg-gray-400/20 p-4 shadow">
                            <p className="text-white">Total Projects</p>
                            <p className="text-3xl font-bold text-primary">
                                {stats.totalProjects}
                            </p>
                        </div>
                        <div className="flex flex-col justify-between gap-4 rounded bg-gray-400/20 p-4 shadow">
                            <p className="text-white">Total Tasks</p>
                            <p className="text-3xl font-bold text-primary">
                                {stats.totalTasks}
                            </p>
                        </div>
                        <div className="flex flex-col justify-between gap-4 rounded bg-gray-400/20 p-4 shadow">
                            <p className="text-white">Total Employees</p>
                            <p className="text-3xl font-bold text-primary">
                                {stats.totalEmployees}
                            </p>
                        </div>
                        <div className="flex flex-col justify-between gap-4 rounded bg-gray-400/20 p-4 shadow">
                            <p className="text-white">
                                Users w/o Employee Record
                            </p>
                            <p className="text-3xl font-bold text-primary">
                                {stats.totalUsersWithoutEmployee}
                            </p>
                        </div>
                    </div>
                )}

                {/* Manager view: department projects and pending tasks */}
                {role === 'manager' && (
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h2 className="mb-3 text-xl font-semibold">
                                Department Projects
                            </h2>
                            <ul className="space-y-2">
                                {departmentProjects?.map((project) => (
                                    <li
                                        key={project.id}
                                        className="rounded bg-gray-400/20 p-3 shadow"
                                    >
                                        {project.title} -{' '}
                                        <span className="text-sm text-gray-500">
                                            {project.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-3 text-xl font-semibold">
                                Pending Tasks
                            </h2>
                            <ul className="space-y-2">
                                {pendingTasks?.map((task) => (
                                    <li
                                        key={task.id}
                                        className="rounded bg-gray-400/20 p-3 shadow"
                                    >
                                        {task.title}
                                        {task.due_date && (
                                            <span className="ml-2 text-sm text-gray-500">
                                                Due: {task.due_date}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Employee view: assigned tasks and upcoming deadlines */}
                {role === 'employee' && (
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h2 className="mb-3 text-xl font-semibold">
                                My Tasks
                            </h2>
                            <ul className="space-y-2">
                                {myTasks?.map((task) => (
                                    <li
                                        key={task.id}
                                        className="rounded bg-gray-400/20 p-3 shadow"
                                    >
                                        {task.title} -{' '}
                                        <span className="text-sm text-gray-500">
                                            {task.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-3 text-xl font-semibold">
                                Upcoming Deadlines
                            </h2>
                            <ul className="space-y-2">
                                {upcomingDeadlines?.map((task) => (
                                    <li
                                        key={task.id}
                                        className="rounded bg-gray-400/20 p-3 shadow"
                                    >
                                        {task.title} -{' '}
                                        <span className="text-sm text-red-500">
                                            Due: {task.due_date}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
