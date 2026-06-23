# Hybrid Rendering Strategy: CSR for Authenticated Pages, SSR for Public Pages

## Overview
This setup enables:
- **CSR (Client-Side Rendering)** for authenticated pages (dashboard, admin panels) - faster interactivity
- **SSR (Server-Side Rendering)** for public pages (welcome, landing) - better SEO

## Configuration Files Created

### 1. **Helpers/InertiaPageType.php**
Defines which pages should use SSR vs CSR.

**Add more public pages here:**
```php
public const PUBLIC_PAGES = [
    'welcome',
    'about',      // Add public pages
    'services',   // to this array
];
```

### 2. **Http/Responses/InertiaPageResponse.php**
Helper class for rendering pages with specific strategies.

## Usage in Controllers

### For Authenticated Pages (CSR)
```php
use App\Http\Responses\InertiaPageResponse;

class DashboardController extends Controller
{
    public function index()
    {
        return InertiaPageResponse::csr('Dashboard', [
            'stats' => [...],
        ]);
    }
}
```

### For Public Pages (SSR)
```php
class HomeController extends Controller
{
    public function show()
    {
        return InertiaPageResponse::ssr('welcome', [
            'features' => [...],
        ]);
    }
}
```

### Automatic Strategy (based on Helpers/InertiaPageType.php)
```php
return InertiaPageResponse::auto('Dashboard', $props);
```

## Vite Configuration
✅ Updated `vite.config.ts` to support SSR entry point:
- Main entry: `resources/js/app.tsx` (CSR)
- SSR entry: `resources/js/ssr.tsx` (Server rendering)

## Build Commands
```bash
# CSR only
npm run build

# Both CSR and SSR
npm run build:ssr
```

## SEO Optimization for SSR Pages

Add these to your public page components for better SEO:

```tsx
import { Head } from '@inertiajs/react';

export default function Welcome({ features }) {
    return (
        <>
            <Head>
                <title>Welcome to Corporate PM</title>
                <meta name="description" content="Project management for your team" />
                <meta property="og:title" content="Welcome to Corporate PM" />
                <meta property="og:description" content="Project management for your team" />
            </Head>
            
            {/* Page content */}
        </>
    );
}
```

## Next Steps

1. **Update Controllers**: Replace `Inertia::render()` with `InertiaPageResponse::csr()` in authenticated pages
   - DashboardController
   - EmployeeController
   - ProjectController
   - TaskController
   - UserController
   - DepartmentController
   - RoleController

2. **Update Routes**: Register the InertiaServiceProvider in `config/app.php` providers if not auto-discovered

3. **Test**:
   ```bash
   npm run build:ssr
   npm run dev
   ```

## Benefits
- **CSR Pages**: Faster interactions, no server overhead for authenticated users
- **SSR Pages**: Optimized for search engines, better initial load metrics
- **Flexible**: Easy to switch strategies page-by-page or by user type
