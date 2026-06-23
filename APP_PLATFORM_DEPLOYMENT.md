# Digital Ocean App Platform Deployment Guide

## **Updated Build & Run Commands**

### **Build Command (Optimized)**
```bash
composer install --no-dev --optimize-autoloader && \
npm ci && \
npm run build && \
php artisan migrate --force && \
php artisan config:clear && \
php artisan cache:clear && \
php artisan route:clear && \
php artisan view:clear
```

### **Run Command**
```bash
heroku-php-apache2 public/
```

## **Key Changes**

❌ **Removed:**
- `npm install` (redundant after `npm ci`)

✅ **Added:**
- `php artisan migrate --force` (runs migrations automatically)

## **Environment Variables to Set in App Platform**

```
APP_NAME=Corporate PM
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
LOG_LEVEL=error
LOG_CHANNEL=stack

DB_CONNECTION=mysql
DB_HOST=${db.HOSTNAME}
DB_PORT=${db.PORT}
DB_DATABASE=${db.DATABASE}
DB_USERNAME=${db.USERNAME}
DB_PASSWORD=${db.PASSWORD}

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=local
```

## **First-Time Setup**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add App Platform configuration"
   git push origin 2026-may5
   ```

2. **In Digital Ocean Console:**
   - Create new App
   - Connect to GitHub repo
   - Set environment variables (above)
   - Deploy

3. **After First Deploy:**
   - SSH into the app container to run seeders if needed:
   ```bash
   doctl apps exec YOUR_APP_ID --component web -- php artisan db:seed
   ```

## **Troubleshooting**

### **500 Error: "Unable to locate file in Vite manifest: resources/js/pages/welcome.tsx"**

**Cause:** The Blade template was trying to load individual page components as separate Vite entry points, but they're bundled into `app.tsx`.

**Fix (Already Applied):**
- Updated `resources/views/app.blade.php` to only load main entry points:
```blade
@vite(['resources/css/app.css', 'resources/js/app.tsx'])
```

**This was the problem:**
```blade
@vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
```

Individual pages are dynamically imported by React/Inertia, not as separate Vite entries.

### **Build Failed or Missing manifest.json**
```bash
# Check if build completed
doctl apps exec YOUR_APP_ID --component web -- test -f public/build/manifest.json && echo "OK" || echo "MISSING"

# Check build logs
doctl apps logs YOUR_APP_ID --component web | grep -i "vite\|npm\|build"
```

### **General Troubleshooting**
```bash
# Check logs
doctl apps logs YOUR_APP_ID --component web

# Run this if needed
doctl apps exec YOUR_APP_ID --component web -- php artisan key:generate

# Verify assets loaded
curl https://your-domain.com | grep -o "public/build"
```

### **Assets Not Loading**
- Verify `npm run build` completed successfully
- Check `public/build/manifest.json` exists
- Clear caches: `php artisan view:clear`

### **Database Connection Failed**
- Verify `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD` in App Platform env vars
- Ensure database is created and running
- Run: `php artisan migrate --force`

## **Deployment Checklist**

- [ ] `app.yaml` configured with build/run commands
- [ ] All environment variables set
- [ ] GitHub repo connected to App Platform
- [ ] DATABASE created in Digital Ocean
- [ ] `.env` file NOT committed to Git (use app.yaml instead)
- [ ] `public/build/` directory in `.gitignore`
- [ ] SSL certificate auto-provisioned
- [ ] Domain pointing to App Platform
