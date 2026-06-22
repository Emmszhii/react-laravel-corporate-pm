/**
 * boneyard/Skeleton.tsx
 *
 * Renders a captured ShapeNode tree as animated placeholder boxes, or a
 * generic shimmering fallback when no shape has been captured yet (e.g. the
 * very first visit to a given page in this session).
 */

import type { CSSProperties } from 'react';
import type { ShapeNode } from './shapeCache';

const SHIMMER_STYLE_ID = 'boneyard-shimmer-styles';

function ensureShimmerStylesInjected() {
    if (typeof document === 'undefined') return;
    if (document.getElementById(SHIMMER_STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = SHIMMER_STYLE_ID;
    style.textContent = `
        @keyframes boneyard-shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        .boneyard-skel {
            background: linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.06) 25%,
                rgba(0, 0, 0, 0.12) 37%,
                rgba(0, 0, 0, 0.06) 63%
            );
            background-size: 200% 100%;
            animation: boneyard-shimmer 1.4s ease-in-out infinite;
        }
        @media (prefers-color-scheme: dark) {
            .boneyard-skel {
                background: linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0.06) 25%,
                    rgba(255, 255, 255, 0.14) 37%,
                    rgba(255, 255, 255, 0.06) 63%
                );
                background-size: 200% 100%;
            }
        }
        @media (prefers-reduced-motion: reduce) {
            .boneyard-skel { animation: none; }
        }
    `;
    document.head.appendChild(style);
}

function ShapeBox({ node }: { node: ShapeNode }) {
    const isLeaf = node.children.length === 0;

    const containerStyle: CSSProperties = {
        width: node.width,
        height: isLeaf ? node.height : undefined,
        minHeight: isLeaf ? undefined : node.height,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flexShrink: 0,
    };

    if (isLeaf) {
        return (
            <div
                className="boneyard-skel"
                style={{
                    width: node.width,
                    height: node.isTextish ? Math.min(node.height, 16) : node.height,
                    borderRadius: node.borderRadius || (node.isTextish ? 4 : 6),
                    flexShrink: 0,
                }}
            />
        );
    }

    return (
        <div style={containerStyle}>
            {node.children.map((child, i) => (
                <ShapeBox key={i} node={child} />
            ))}
        </div>
    );
}

/** Generic fallback shown the very first time a page has no captured shape yet. */
export function GenericSkeleton() {
    ensureShimmerStylesInjected();
    return (
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 960, margin: '0 auto' }}>
            <div className="boneyard-skel" style={{ width: '40%', height: 28, borderRadius: 6 }} />
            <div className="boneyard-skel" style={{ width: '100%', height: 160, borderRadius: 10 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="boneyard-skel" style={{ width: '90%', height: 14, borderRadius: 4 }} />
                <div className="boneyard-skel" style={{ width: '75%', height: 14, borderRadius: 4 }} />
                <div className="boneyard-skel" style={{ width: '60%', height: 14, borderRadius: 4 }} />
            </div>
        </div>
    );
}

/** Renders a captured shape tree, or the generic fallback if shape is null. */
export function ShapeSkeleton({ shape }: { shape: ShapeNode | null }) {
    ensureShimmerStylesInjected();

    if (!shape) {
        return <GenericSkeleton />;
    }

    return (
        <div aria-hidden="true" style={{ width: shape.width || '100%' }}>
            <ShapeBox node={shape} />
        </div>
    );
}
