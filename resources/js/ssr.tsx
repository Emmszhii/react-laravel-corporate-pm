import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { renderToString } from 'react-dom/server';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

export default function render(page: any) {
    return createInertiaApp({
        page,
        render: renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: (name) => {
            const pages = import.meta.glob<{ default: any }>('./pages/**/*.tsx', {
                eager: true,
            });

            return pages[`./pages/${name}.tsx`];
        },
        layout: (name) => {
            switch (true) {
                case name === 'welcome':
                    return null;
                case name.startsWith('auth/'):
                    return AuthLayout;
                case name.startsWith('settings/'):
                    return [AppLayout, SettingsLayout];
                default:
                    return AppLayout;
            }
        },
        setup({ App, props }) {
            return (
                <TooltipProvider delayDuration={0}>
                    <App {...props} />
                    <Toaster />
                </TooltipProvider>
            );
        },
    });
}
