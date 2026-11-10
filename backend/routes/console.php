<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('app:info', function () {
    $this->comment('ERP Backend Laravel 13 scaffold is ready.');
})->purpose('Show backend scaffold status');
