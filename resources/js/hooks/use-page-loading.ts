import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

/**
 * Hook to track Inertia page navigation loading state
 * @returns {boolean} true when page is loading, false when complete
 */
export function usePageLoading(): boolean {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleFinish = () => setIsLoading(false);
        const handleError = () => setIsLoading(false);

        // router.on returns an unsubscribe function
        const unsubscribeStart = router.on('start', handleStart);
        const unsubscribeFinish = router.on('finish', handleFinish);
        const unsubscribeError = router.on('error', handleError);

        return () => {
            unsubscribeStart();
            unsubscribeFinish();
            unsubscribeError();
        };
    }, []);

    return isLoading;
}
