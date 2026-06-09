import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Dashboard } from '@/routes';
import departments from '@/routes/departments';
import employees from '@/routes/employees';
import projects from '@/routes/projects';
import roles from '@/routes/roles';
import tasks from '@/routes/tasks';
import users from '@/routes/users';
import type { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    ChartNoAxesGantt,
    FolderGit2,
    KeyRound,
    LayoutGrid,
    Users,
} from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: Dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Employees',
        href: employees.index(),
        icon: Users,
        permission: 'view employees',
    },
    {
        title: 'Projects',
        href: projects.index(),
        icon: ChartNoAxesGantt,
        permission: 'view projects',
    },
    {
        title: 'Tasks',
        href: tasks.index(),
        icon: ChartNoAxesGantt,
        permission: 'view tasks',
    },
    {
        title: 'Departments',
        href: departments.index(),
        icon: KeyRound,
        permission: 'manage departments',
    },
    {
        title: 'Users',
        href: users.index(),
        icon: KeyRound,
        permission: 'manage users',
    },
    {
        title: 'Roles',
        href: roles.index(),
        icon: KeyRound,
        permission: 'manage roles',
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={Dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
