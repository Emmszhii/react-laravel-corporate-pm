import { Head, Link } from '@inertiajs/react';

interface Department {
    id: number;
    name: string;
}

interface User {
    id: number;
    email: string;
}

interface Employee {
    id: number;
    employee_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    position: string;
    status: string;
    hire_date: string;
    salary: number;
    department: Department | null;
    user: User | null;
}

interface Props {
    employee: Employee;
    canViewSalary: boolean;
}

export default function Show({ employee, canViewSalary }: Props) {
    return (
        <>
            <Head title={`${employee.first_name} ${employee.last_name}`} />
            <div className="max-w-2xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        {employee.first_name} {employee.last_name}
                    </h1>
                    <Link
                        href={`/employees/${employee.id}/edit`}
                        className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                    >
                        Edit
                    </Link>
                </div>

                {/* Employee detail fields */}
                <dl className="grid grid-cols-2 gap-4">
                    <div>
                        <dt className="font-semibold text-gray-600">
                            Employee ID
                        </dt>
                        <dd>{employee.employee_id}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold text-gray-600">Email</dt>
                        <dd>{employee.email}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold text-gray-600">Phone</dt>
                        <dd>{employee.phone ?? 'Not provided'}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold text-gray-600">
                            Position
                        </dt>
                        <dd>{employee.position}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold text-gray-600">
                            Department
                        </dt>
                        <dd>{employee.department?.name ?? 'Unassigned'}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold text-gray-600">
                            Hire Date
                        </dt>
                        <dd>{employee.hire_date}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold text-gray-600">Status</dt>
                        <dd>
                            <span
                                className={`rounded px-2 py-1 text-sm ${
                                    employee.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}
                            >
                                {employee.status}
                            </span>
                        </dd>
                    </div>

                    {/* Salary only visible to admins */}
                    {canViewSalary && (
                        <div>
                            <dt className="font-semibold text-gray-600">
                                Salary
                            </dt>
                            <dd>${employee.salary.toLocaleString()}</dd>
                        </div>
                    )}

                    <div>
                        <dt className="font-semibold text-gray-600">
                            Linked Account
                        </dt>
                        <dd>
                            {employee.user
                                ? employee.user.email
                                : 'No linked user account'}
                        </dd>
                    </div>
                </dl>

                <div className="mt-6">
                    <Link
                        href="/employees"
                        className="text-blue-600 hover:underline"
                    >
                        Back to Employees
                    </Link>
                </div>
            </div>
        </>
    );
}
