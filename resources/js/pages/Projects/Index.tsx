import { Head, Link } from '@inertiajs/react';

// Type definitions for project list data
interface Project {
    id: number;
    title: string;
    status: string;
    deadline: string | null;
    department: { id: number; name: string } | null;
}

interface Props {
    projects: Project[];
}

// Map status values to badge colors
function statusBadge(status: string) {
    const colors: Record<string, string> = {
        planning: 'bg-yellow-100 text-yellow-800',
        active: 'bg-green-100 text-green-800',
        completed: 'bg-blue-100 text-blue-800',
        on_hold: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

export default function Index({ projects }: Props) {
    return (
        <>
            <Head title="Projects" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <Link href="/projects/create" className="btn-primary">
                        Create Project
                    </Link>
                </div>

                {/* Project list with status badges and deadlines */}
                <div className="space-y-4">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="flex items-center justify-between rounded border p-4"
                        >
                            <div>
                                <Link
                                    href={`/projects/${project.id}`}
                                    className="text-lg font-medium text-blue-600"
                                >
                                    {project.title}
                                </Link>
                                <p className="text-sm text-gray-500">
                                    {project.department?.name ||
                                        'No department'}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span
                                    className={`rounded px-2 py-1 text-sm ${statusBadge(project.status)}`}
                                >
                                    {project.status}
                                </span>
                                {project.deadline && (
                                    <span className="text-sm text-gray-600">
                                        Due:{' '}
                                        {new Date(
                                            project.deadline,
                                        ).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
