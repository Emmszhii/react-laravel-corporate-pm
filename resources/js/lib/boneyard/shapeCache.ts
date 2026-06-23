/**
 * boneyard/shapeCache.ts
 *
 * In-memory store of captured DOM "shapes" keyed by URL pathname (Inertia's
 * client only knows the target *url* before a navigation resolves, not the
 * component name - see useShapeCapture.ts for why). A shape is a lightweight
 * serialized tree (tag, box size, radius, text-ish flag, children) captured
 * from a real rendered page the first time it successfully mounts. Later,
 * when that same page is loading again, the cached shape is replayed as a
 * skeleton instead of a generic spinner.
 *
 * Intentionally in-memory only (a plain Map): resets on full page reload, which
 * matches the chosen tradeoff of simplicity over persistence.
 */

export interface ShapeNode {
    tag: string;
    width: number;
    height: number;
    borderRadius: number;
    isTextish: boolean;
    children: ShapeNode[];
}

const MAX_DEPTH = 6;
const MAX_CHILDREN_PER_NODE = 24;
const MAX_NODES_TOTAL = 400;

// Tags we never want to render a literal skeleton box for, but still want to
// descend into (their children carry the real layout signal).
const TRANSPARENT_TAGS = new Set(['svg', 'path', 'use', 'defs', 'symbol', 'script', 'style']);

let nodeBudget = 0;

function isTextish(el: Element): boolean {
    if (el.children.length > 0) return false;
    const text = el.textContent?.trim() ?? '';
    return text.length > 0;
}

// Note: this walks el.children (elements only), not el.childNodes. A node
// like <div>Hello <span>world</span></div> has loose text ("Hello ") that
// isn't its own element, so that text doesn't get its own skeleton line -
// only the <span> does. This is an accepted approximation: the skeleton is
// meant to convey overall layout rhythm, not reproduce exact text runs.

function serializeNode(el: Element, depth: number): ShapeNode | null {
    if (nodeBudget <= 0) return null;
    if (depth > MAX_DEPTH) return null;

    const tag = el.tagName.toLowerCase();
    if (TRANSPARENT_TAGS.has(tag)) return null;

    const rect = el.getBoundingClientRect();
    // Skip invisible / zero-size nodes (display:none, collapsed, off-screen helpers)
    if (rect.width <= 0 || rect.height <= 0) return null;

    nodeBudget -= 1;

    let borderRadius = 0;
    try {
        const style = window.getComputedStyle(el);
        const raw = parseFloat(style.borderTopLeftRadius || '0');
        borderRadius = Number.isFinite(raw) ? raw : 0;
    } catch {
        // computed style can throw in detached/edge cases; default to 0
    }

    const textish = isTextish(el);

    const children: ShapeNode[] = [];
    if (!textish) {
        let count = 0;
        for (const child of Array.from(el.children)) {
            if (count >= MAX_CHILDREN_PER_NODE) break;
            const childShape = serializeNode(child, depth + 1);
            if (childShape) {
                children.push(childShape);
                count += 1;
            }
        }
    }

    return {
        tag,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        borderRadius: Math.round(borderRadius),
        isTextish: textish,
        children,
    };
}

/** Walk a mounted root element and produce a serialized shape tree. */
export function captureShape(root: Element): ShapeNode | null {
    nodeBudget = MAX_NODES_TOTAL;
    return serializeNode(root, 0);
}

const shapeStore = new Map<string, ShapeNode>();

export function saveShape(key: string, shape: ShapeNode | null): void {
    if (!shape) return;
    shapeStore.set(key, shape);
}

export function getShape(key: string | null | undefined): ShapeNode | null {
    if (!key) return null;
    return shapeStore.get(key) ?? null;
}

export function hasShape(key: string | null | undefined): boolean {
    if (!key) return false;
    return shapeStore.has(key);
}
