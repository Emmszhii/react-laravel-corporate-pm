# Boneyard Integration Guide

**Boneyard** is a pixel-perfect skeleton loading framework that automatically generates skeleton screens from your real UI. No manual measurement needed!

## ✅ What's Been Set Up

- ✅ `boneyard-js` package installed
- ✅ Vite plugin configured in `vite.config.ts`
- ✅ `boneyard.config.json` created with your project settings
- ✅ Global page loader using Boneyard
- ✅ Bone registry auto-setup

## 🎯 How It Works

1. **During Development**: Boneyard automatically captures bones from your components when you run `npm run dev`
2. **Page Navigation**: Skeletons automatically show during Inertia page navigation
3. **Pixel-Perfect**: Skeletons match your exact UI layout - no manual configuration!

## 🚀 Getting Started

### Step 1: Start Development Server

```bash
npm run dev
```

When the dev server starts, Boneyard automatically:
- Scans your app for `<Skeleton name="...">` components
- Captures the bone data (element positions, sizes)
- Generates `.bones.json` files

### Step 2: Wrap Your Page Components (Optional)

For more granular skeleton loading on specific pages, wrap component trees:

```tsx
import { PageSkeleton } from '@/components/page-skeleton';
import EmployeeCard from './employee-card';

export default function EmployeesPage() {
    return (
        <PageSkeleton name="employees-page">
            <div className="grid gap-4">
                <EmployeeCard {...employee1} />
                <EmployeeCard {...employee2} />
                <EmployeeCard {...employee3} />
            </div>
        </PageSkeleton>
    );
}
```

### Step 3: Use in Data Loading (Optional)

For async data within pages:

```tsx
import { Skeleton } from 'boneyard-js/react';
import { useEffect, useState } from 'react';

export default function EmployeeList() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/employees').then((res) => {
            setData(res.json());
            setLoading(false);
        });
    }, []);

    return (
        <Skeleton name="employee-list" loading={loading}>
            {data && (
                <div className="grid gap-4">
                    {data.map((employee) => (
                        <EmployeeCard key={employee.id} {...employee} />
                    ))}
                </div>
            )}
        </Skeleton>
    );
}
```

## 📝 Configuration

Edit `boneyard.config.json`:

```json
{
  "breakpoints": [375, 768, 1280],        // Responsive breakpoints
  "out": "./resources/js/bones",          // Output directory
  "wait": 800,                             // Wait time for page load (ms)
  "color": "#e5e5e5",                     // Light mode skeleton color
  "darkColor": "rgba(255,255,255,0.06)",  // Dark mode skeleton color
  "animate": "shimmer",                   // Animation: pulse, shimmer, solid
  "shimmerColor": "rgba(255,255,255,0.1)",
  "shimmerAngle": 45
}
```

## 🎨 Styling Props

Use props on `<Skeleton>` components to customize individual skeletons:

```tsx
<Skeleton 
  name="my-card" 
  loading={isLoading}
  color="#f0f0f0"           // Custom color
  animate="pulse"           // pulse | shimmer | solid
  stagger={80}              // Stagger animation between bones (ms)
  transition={300}          // Fade transition duration (ms)
  boneClass="rounded-xl"    // Custom CSS class per bone
>
  <Card />
</Skeleton>
```

## 📂 File Structure

```
resources/js/
├── bones/
│   ├── registry.ts                          # Auto-generated registry
│   ├── page-loading.bones.json              # Auto-generated bones
│   ├── employees-page.bones.json            # Auto-generated bones
│   └── ...
├── components/
│   ├── boneyard-page-loader.tsx             # Global page loader
│   └── page-skeleton.tsx                    # Wrapper component
├── hooks/
│   └── use-page-loading.ts                  # Loading state hook
└── app.tsx                                  # Imports bone registry
```

## 🔄 Re-capturing Bones

Bones are auto-captured on HMR changes during development. To manually re-capture:

```bash
# Watch mode - re-captures on file changes
npx boneyard-js build --watch

# Force re-capture
npx boneyard-js build --force

# Specific breakpoints
npx boneyard-js build --breakpoints 375,768,1280
```

## 🌍 Global Page Navigation

The global page loader automatically shows during Inertia navigation:

```tsx
// Just navigate normally - skeleton appears automatically!
import { Link } from '@inertiajs/react';

<Link href={route('employees.index')}>
  View Employees
</Link>
// Skeleton shows during nav → disappears when loaded ✨
```

## 🎬 Features

| Feature | Description |
|---------|-------------|
| **Auto-capture** | Bones generated from real UI, not manually coded |
| **Responsive** | Captures at multiple breakpoints (mobile, tablet, desktop) |
| **Dark Mode** | Auto-detects dark mode and applies correct colors |
| **Pixel-perfect** | Exact match to your component layout |
| **Zero Overhead** | No performance impact when not loading |
| **Framework Agnostic** | Works with React, Vue, Svelte, Angular, Preact |
| **Dev-only** | Bone registry auto-generated, negligible bundle size |

## 🚀 Performance Tips

1. **Let Boneyard auto-capture** - Don't manually create skeletons
2. **Use page-level skeletons** - Better UX than component-level for page nav
3. **Customize animations** - `shimmer` is more eye-catching than `pulse`
4. **Adjust wait time** - Increase `wait` if your app takes longer to load

## 📚 More Resources

- [Boneyard Docs](https://boneyard.vercel.app/overview)
- [GitHub](https://github.com/0xGF/boneyard)
- [Example Project](https://boneyard.vercel.app/)

## 💡 Common Patterns

### Full Page Skeleton

```tsx
<PageSkeleton name="dashboard">
  <Dashboard />
</PageSkeleton>
```

### Async Data Skeleton

```tsx
<Skeleton name="user-cards" loading={loading}>
  <UserCards users={users} />
</Skeleton>
```

### Suspense Integration (React 18+)

```tsx
<Skeleton name="my-component" loading={pending}>
  <AsyncComponent />
</Skeleton>
```

## ❓ Troubleshooting

**"Bones not being captured?"**
- Make sure dev server is running: `npm run dev`
- Check that `<Skeleton name="...">` has a unique name
- View Network tab → look for `.bones.json` files
- Check `resources/js/bones/` directory

**"Bones showing but layout is wrong?"**
- Make sure component is fully rendered during capture
- Increase `wait` time in `boneyard.config.json`
- Manually re-capture: `npx boneyard-js build --force`

**"Skeletons not showing during navigation?"**
- Check that `BoneyardPageLoader` is in `app.tsx`
- Verify `@/bones/registry` is imported
- Check browser console for errors
