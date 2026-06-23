/**
 * boneyard/pathKey.ts
 *
 * Normalizes a URL-like value down to a pathname string, used as the shape
 * cache key everywhere. Two different Inertia APIs hand us two different
 * shapes for "the current/target URL":
 *   - usePage().url is a plain string (it comes straight off the JSON page
 *     payload from the server).
 *   - router.on('start') event.detail.visit.url is a real URL object (the
 *     router converts any href to a URL via its internal hrefToUrl() before
 *     firing the event).
 * Both funnel through here so capture and lookup always agree on the key.
 */

export function pathKeyFromString(url: string | null | undefined): string {
    if (!url) return window.location.pathname;
    try {
        return new URL(url, window.location.origin).pathname;
    } catch {
        return url;
    }
}

export function pathKeyFromUrl(url: URL | null | undefined): string {
    return url ? url.pathname : window.location.pathname;
}
