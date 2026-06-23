import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { ShapeCaptureProbe } from '@/lib/boneyard/ShapeCaptureProbe';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <AuthLayoutTemplate title={title} description={description}>
            <ShapeCaptureProbe>{children}</ShapeCaptureProbe>
        </AuthLayoutTemplate>
    );
}
