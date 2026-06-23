<?php

namespace App\Providers;

use App\Helpers\InertiaPageType;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class InertiaServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Register a macro for CSR-only responses
        if (!InertiaResponse::hasMacro('asCsr')) {
            InertiaResponse::macro('asCsr', function () {
                $this->view = 'app-csr';

                return $this;
            });
        }

        // Register a macro for SSR responses
        if (!InertiaResponse::hasMacro('asSsr')) {
            InertiaResponse::macro('asSsr', function () {
                $this->view = 'app-ssr';

                return $this;
            });
        }
    }
}
