import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function SkeletonLoader() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleFinish = () => setIsLoading(false);

        router.on('start', handleStart);
        router.on('finish', handleFinish);

        return () => {
            router.off('start', handleStart);
            router.off('finish', handleFinish);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-40 bg-white/40 dark:bg-slate-950/40 pointer-events-none">
            <div className="hidden lg:fixed lg:left-64 lg:inset-y-0 lg:right-0 lg:pt-20 lg:px-8 lg:py-8 lg:block">
                {/* Page Title Skeleton */}
                <div className="mb-8">
                    <div className="mb-4 h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-96 animate-pulse rounded bg-slate-100 dark:bg-slate-800/50" />
                </div>

                {/* Dynamic Content Area - Grid Layout */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="space-y-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white p-6 dark:bg-slate-900"
                        >
                            <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                            <div className="space-y-2">
                                <div className="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800/50" />
                                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800/50" />
                                <div className="h-4 w-4/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800/50" />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <div className="h-8 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="h-8 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile skeleton - simpler layout */}
            <div className="lg:hidden p-4 pt-20">
                {/* Mobile Title */}
                <div className="mb-6">
                    <div className="mb-2 h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-32 animate-pulse rounded bg-slate-100 dark:bg-slate-800/50" />
                </div>

                {/* Mobile Cards */}
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="space-y-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white p-4 dark:bg-slate-900"
                        >
                            <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                            <div className="space-y-1">
                                <div className="h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800/50" />
                                <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100 dark:bg-slate-800/50" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
