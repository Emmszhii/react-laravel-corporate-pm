<?php

namespace App\Http\Middleware;

use App\Helpers\InertiaPageType;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpFoundation\Response;

class HandleInertiaRendering
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Check if this is an Inertia response
        if ($response->headers->get('X-Inertia')) {
            // Get component name from Inertia header
            $component = $response->headers->get('X-Inertia-Component');

            // Enable SSR for public pages, disable for others
            if ($component && InertiaPageType::shouldUseSsr($component)) {
                Config::set('inertia.ssr.enabled', true);
            } else {
                Config::set('inertia.ssr.enabled', false);
            }
        }

        return $response;
    }
}
