# Skeleton Loading System

A global skeleton loading screen system that displays a page-wide overlay with animated placeholder content during page navigation on all CSR pages.

## Features

- ✅ **Global Integration** - Automatically shows on all CSR pages during navigation
- ✅ **Dark Mode Support** - Adapts to light and dark themes
- ✅ **No Per-Page Setup** - Works globally via app.tsx
- ✅ **Reusable Components** - Import skeleton components for custom loading states
- ✅ **Mobile Responsive** - Works on all screen sizes

## How It Works

The skeleton loader is integrated in [resources/js/app.tsx](resources/js/app.tsx) and automatically:
1. Listens for Inertia `router.on('start')` events (navigation begins)
2. Shows an animated skeleton overlay
3. Hides on `router.on('finish')` event (page loaded)

## Files

### Core Components

**[resources/js/components/skeleton-loader.tsx](resources/js/components/skeleton-loader.tsx)**
- Main page-wide skeleton overlay
- Shows during navigation
- Auto-hides when page loads

**[resources/js/components/skeleton.tsx](resources/js/components/skeleton.tsx)**
- Reusable skeleton building blocks:
  - `SkeletonText` - Text lines
  - `SkeletonCircle` - Avatar placeholders
  - `SkeletonCard` - Card skeletons
  - `SkeletonTable` - Table skeletons
  - `SkeletonList` - List item skeletons

### Hooks

**[resources/js/hooks/use-page-loading.ts](resources/js/hooks/use-page-loading.ts)**
- `usePageLoading()` - Returns loading state boolean
- Use when you need custom loading behavior

## Usage Examples

### 1. Default Global Skeleton (Already Enabled)

Just navigate between pages - the skeleton shows automatically!

```tsx
// In any component:
import { Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <Link href={route('employees.index')}>
            View Employees
        </Link>
    );
}
// Skeleton appears during navigation → disappears when loaded
```

### 2. Custom Loading State (Optional)

Use the hook if you need custom loading behavior:

```tsx
import { usePageLoading } from '@/hooks/use-page-loading';
import { SkeletonCard } from '@/components/skeleton';

export default function MyComponent() {
    const isLoading = usePageLoading();

    if (isLoading) {
        return <SkeletonCard />;
    }

    return <div>My content</div>;
}
```

### 3. Custom Skeleton Variants

```tsx
import {
    SkeletonText,
    SkeletonCircle,
    SkeletonCard,
    SkeletonTable,
    SkeletonList,
} from '@/components/skeleton';

// Text skeleton
<SkeletonText width="w-48" height="h-6" />

// Multiple lines
<SkeletonText width="w-full" height="h-4" count={3} />

// Avatar skeleton
<SkeletonCircle size="w-12 h-12" />

// Card skeleton (with custom children)
<SkeletonCard>
    <SkeletonText width="w-2/3" height="h-8" />
</SkeletonCard>

// Table skeleton
<SkeletonTable />

// List skeleton
<SkeletonList count={10} />
```

### 4. Combine Skeletons

```tsx
import {
    SkeletonText,
    SkeletonCircle,
    SkeletonCard,
} from '@/components/skeleton';

export function UserCardSkeleton() {
    return (
        <SkeletonCard>
            <div className="flex gap-4">
                <SkeletonCircle size="w-16 h-16" />
                <div className="flex-1 space-y-2">
                    <SkeletonText width="w-3/4" height="h-4" />
                    <SkeletonText width="w-1/2" height="h-3" />
                </div>
            </div>
        </SkeletonCard>
    );
}
```

## Styling

All skeleton components use Tailwind CSS classes:
- Background: `bg-slate-200 dark:bg-slate-800`
- Animation: `animate-pulse`
- Rounded corners: `rounded`

### Customize Colors

Edit [resources/js/components/skeleton.tsx](resources/js/components/skeleton.tsx) and replace color classes:

```tsx
// Change from slate to gray
- bg-slate-200 dark:bg-slate-800
+ bg-gray-200 dark:bg-gray-800
```

Or pass custom className:

```tsx
<SkeletonText className="bg-blue-200" />
```

## PageLoader Overlay Customization

Edit [resources/js/components/skeleton-loader.tsx](resources/js/components/skeleton-loader.tsx):

```tsx
// Change overlay opacity
- bg-white/80 dark:bg-slate-950/80
+ bg-white/50 dark:bg-slate-950/50

// Remove blur effect
- backdrop-blur-sm
+ (delete this)

// Change z-index if needed
- z-50
+ z-40
```

## Performance Notes

- ✅ Skeleton loader only renders when `isLoading` is true
- ✅ No performance impact when not loading
- ✅ Minimal CSS (uses Tailwind)
- ✅ No external dependencies beyond React

## Disabling Skeleton Loader

If you want to disable the global skeleton loader:

**In [resources/js/app.tsx](resources/js/app.tsx):**

```tsx
setup({ el, App, props }) {
    createRoot(el).render(
        <TooltipProvider delayDuration={0}>
            {/* Remove this line: */}
            {/* <SkeletonLoader /> */}
            <App {...props} />
            <Toaster />
        </TooltipProvider>,
    );
},
```

## Browser Support

Works on all modern browsers that support:
- React 18+
- CSS Grid
- CSS Animations
