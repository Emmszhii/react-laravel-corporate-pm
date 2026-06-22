/**
 * boneyard/BoneyardBoundary.tsx
 *
 * Drop this once around {app} inside createInertiaApp's withApp callback.
 * No per-page code required anywhere else.
 *
 * IMPORTANT: this component must NOT call usePage() (or anything that
 * depends on it). withApp's {app} is the *unmounted* Inertia <App> element -
 * PageContext.Provider only exists once React actually renders into that
 * element's subtree. A parent wrapping {app} from outside runs before that
 * provider exists, so usePage() throws "must be used within the Inertia
 * component" if called here. See ShapeCaptureProbe.tsx for the piece that
 * needs usePage() - it's designed to be used from inside the `layout`
 * option instead, which IS already inside the provider.
 *
 * How it works:
 *  - Listens to Inertia's router 'start' / 'finish' / 'httpException' /
 *    'networkError' events to know when a full page navigation is in flight.
 *    (v3 renamed 'invalid' -> 'httpException' and 'exception' -> 'networkError';
 *    the old names compile but silently never fire, so don't use them.)
 *  - The 'start' event exposes event.detail.visit.url (the target URL) -
 *    that's all Inertia's client knows before the server responds, since
 *    routing is server-driven. We key the shape cache by URL pathname.
 *  - While in flight, overlays a skeleton (shaped like that target page, if
 *    captured before; generic shimmer otherwise) on top of current content -
 *    the same visual job a Suspense fallback does, since Inertia's own page
 *    swap does not actually trigger React Suspense.
 *  - Partial reloads / prop-only visits (event.detail.visit.only/except
 *    non-empty) are ignored - those shouldn't blank the whole page.
 */

import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { pathKeyFromUrl } from './pathKey';
// import { getShape, type ShapeNode } from './shapeCache';
import { ShapeSkeleton } from './Skeleton';
import { getShape, type ShapeNode } from './shapeCache';

interface BoneyardBoundaryProps {
    children: React.ReactNode;
    /** Minimum ms the overlay stays visible once shown, to avoid a flash on fast/cached nav. */
    minVisibleMs?: number;
    /** Delay before showing the overlay at all, to avoid flicker on very fast navigations. */
    showDelayMs?: number;
}

// Derive the listener's parameter type from router.on itself, rather than
// hand-rolling a CustomEvent<...> shape. Inertia's PendingVisit.url is a
// real URL object (not a string) - the router converts any href to a URL
// internally before firing 'start' - so this also avoids re-parsing it.
//
// If this inference doesn't resolve against your installed @inertiajs/core
// version (overload resolution can vary by version), replace the two type
// aliases below with a manual shape, e.g.:
//   type StartEvent = { detail: { visit: { url: URL; only?: string[]; except?: string[] } } };
type StartListener = Parameters<typeof router.on<'start'>>[1];
type StartEvent = Parameters<StartListener>[0];

function isPartialReload(event: StartEvent): boolean {
    const visit = event.detail.visit;
    return (visit.only?.length ?? 0) > 0 || (visit.except?.length ?? 0) > 0;
}

function targetPathFrom(event: StartEvent): string {
    return pathKeyFromUrl(event.detail.visit.url);
}

export function BoneyardBoundary({
    children,
    minVisibleMs = 150,
    showDelayMs = 60,
}: BoneyardBoundaryProps) {
    const [overlayShape, setOverlayShape] = useState<ShapeNode | null>(null);
    const [overlayVisible, setOverlayVisible] = useState(false);

    const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const shownAt = useRef<number>(0);
    const overlayVisibleRef = useRef(false);

    useEffect(() => {
        const clearOverlay = () => {
            if (showTimer.current) {
                clearTimeout(showTimer.current);
                showTimer.current = null;
            }

            const elapsed = Date.now() - shownAt.current;
            const remaining = Math.max(0, minVisibleMs - elapsed);

            hideTimer.current = setTimeout(
                () => {
                    setOverlayVisible(false);
                    overlayVisibleRef.current = false;
                },
                overlayVisibleRef.current ? remaining : 0,
            );
        };

        const offStart = router.on('start', (event) => {
            if (isPartialReload(event)) return;

            const shape = getShape(targetPathFrom(event));

            if (showTimer.current) clearTimeout(showTimer.current);
            if (hideTimer.current) clearTimeout(hideTimer.current);

            showTimer.current = setTimeout(() => {
                setOverlayShape(shape);
                setOverlayVisible(true);
                overlayVisibleRef.current = true;
                shownAt.current = Date.now();
            }, showDelayMs);
        });

        const offFinish = router.on('finish', clearOverlay);
        // Belt-and-suspenders: make sure a failed/invalid visit never leaves
        // the overlay stuck on screen even if 'finish' doesn't fire for it.
        // Note: v3 renamed 'invalid' -> 'httpException' and 'exception' ->
        // 'networkError'. The old names compile and silently never fire.
        const offHttpException = router.on('httpException', clearOverlay);
        const offNetworkError = router.on('networkError', clearOverlay);

        return () => {
            offStart();
            offFinish();
            offHttpException();
            offNetworkError();
            if (showTimer.current) clearTimeout(showTimer.current);
            if (hideTimer.current) clearTimeout(hideTimer.current);
        };
    }, [minVisibleMs, showDelayMs]);

    return (
        <div style={{ position: 'relative' }}>
            <div
                style={{
                    opacity: overlayVisible ? 0.35 : 1,
                    transition: 'opacity 150ms ease',
                    pointerEvents: overlayVisible ? 'none' : undefined,
                }}
            >
                {children}
            </div>

            {overlayVisible && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: 24,
                        overflow: 'hidden',
                    }}
                >
                    <ShapeSkeleton shape={overlayShape} />
                </div>
            )}
        </div>
    );
}
