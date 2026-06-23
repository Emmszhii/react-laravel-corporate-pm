import { usePageLoading } from '@/hooks/use-page-loading';
import { Skeleton } from 'boneyard-js/react';
import { ReactNode } from 'react';

/**
 * Wraps page content with Boneyard skeleton loading
 * Shows auto-generated skeleton during page navigation
 */
export function PageSkeleton({
    name,
    children,
    fixture,
}: {
    name: string;
    children: ReactNode;
    fixture?: ReactNode;
}) {
    const isLoading = usePageLoading();

    return (
        <Skeleton name={name} loading={isLoading} fixture={fixture}>
            {children}
        </Skeleton>
    );
}
