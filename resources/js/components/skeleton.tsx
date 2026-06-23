import { ReactNode } from 'react';

interface SkeletonProps {
    /**
     * Width class (e.g., 'w-32', 'w-full')
     */
    width?: string;
    /**
     * Height class (e.g., 'h-4', 'h-8')
     */
    height?: string;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * Number of items to display (for repeated skeletons)
     */
    count?: number;
}

export function SkeletonText({ width = 'w-full', height = 'h-4', className = '', count = 1 }: SkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`animate-pulse rounded bg-slate-200 dark:bg-slate-800 ${width} ${height} ${className}`}
                />
            ))}
        </>
    );
}

export function SkeletonCircle({ size = 'w-10 h-10', className = '' }: { size?: string; className?: string }) {
    return <div className={`animate-pulse rounded-full bg-slate-200 dark:bg-slate-800 ${size} ${className}`} />;
}

export function SkeletonCard({ children }: { children?: ReactNode }) {
    return (
        <div className="space-y-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white p-6 dark:bg-slate-900">
            {children || (
                <>
                    <SkeletonText width="w-3/4" height="h-6" />
                    <div className="space-y-2">
                        <SkeletonText height="h-4" />
                        <SkeletonText width="w-5/6" height="h-4" />
                        <SkeletonText width="w-4/6" height="h-4" />
                    </div>
                </>
            )}
        </div>
    );
}

export function SkeletonTable() {
    return (
        <div className="space-y-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white p-6 dark:bg-slate-900">
            {/* Table header */}
            <div className="flex gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
                <SkeletonText width="w-24" height="h-4" />
                <SkeletonText width="w-32" height="h-4" />
                <SkeletonText width="w-20" height="h-4" />
            </div>

            {/* Table rows */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 py-4">
                    <SkeletonText width="w-24" height="h-4" />
                    <SkeletonText width="w-32" height="h-4" />
                    <SkeletonText width="w-20" height="h-4" />
                </div>
            ))}
        </div>
    );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="space-y-2 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <SkeletonCircle size="w-10 h-10" />
                        <SkeletonText width="w-32" height="h-4" />
                    </div>
                    <SkeletonText height="h-3" width="w-4/5" />
                </div>
            ))}
        </div>
    );
}
