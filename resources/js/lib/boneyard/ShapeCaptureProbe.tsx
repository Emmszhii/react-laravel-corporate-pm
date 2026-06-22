/**
 * boneyard/ShapeCaptureProbe.tsx
 *
 * The usePage()-dependent half of the boneyard system. Must be rendered
 * *inside* the Inertia component tree - i.e. from within the `layout`
 * option passed to createInertiaApp, or from within a layout component
 * itself - never from withApp (see BoneyardBoundary.tsx for why).
 *
 * Wrap your existing layout's children with this once, in the central
 * `layout:` resolver in app.tsx. Since every page already flows through
 * that one function, this still requires zero changes per page.
 *
 * Usage in app.tsx:
 *   layout: (name) => {
 *     const Inner = pickLayoutFor(name); // your existing switch
 *     return (props) => (
 *       <ShapeCaptureProbe>
 *         <Inner {...props} />
 *       </ShapeCaptureProbe>
 *     );
 *   }
 *
 * Or, more simply, wrap inside each layout component's own render (AppLayout,
 * AuthLayout, SettingsLayout) around {children} - also zero per-page code,
 * since those are the layouts already applied centrally.
 */

import { usePage } from '@inertiajs/react';
import { useLayoutEffect, useRef } from 'react';
import { pathKeyFromString } from './pathKey';
import { captureShape, saveShape } from './shapeCache';

interface ShapeCaptureProbeProps {
    children: React.ReactNode;
}

export function ShapeCaptureProbe({ children }: ShapeCaptureProbeProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { url } = usePage();
    const key = pathKeyFromString(url);

    useLayoutEffect(() => {
        if (!ref.current) return;

        // Defer one frame so layout (fonts, images with intrinsic size,
        // CSS) has settled before measuring. Avoids capturing a shape from
        // an unstyled flash-of-content moment.
        const raf = requestAnimationFrame(() => {
            if (!ref.current) return;
            const shape = captureShape(ref.current);
            saveShape(key, shape);
        });

        return () => cancelAnimationFrame(raf);
    }, [key]);

    // A plain wrapping div. If you'd rather not add an extra DOM node, you
    // can instead pass a ref down via cloneElement - but for most apps an
    // extra div here has no visible/layout effect worth worrying about.
    return <div ref={ref}>{children}</div>;
}
