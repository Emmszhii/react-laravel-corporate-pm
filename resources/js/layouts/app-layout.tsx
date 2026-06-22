import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { ShapeCaptureProbe } from '@/lib/boneyard/ShapeCaptureProbe';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            <ShapeCaptureProbe>{children}</ShapeCaptureProbe>
        </AppLayoutTemplate>
    );
}
