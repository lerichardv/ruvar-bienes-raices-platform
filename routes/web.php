<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Users Management
    Route::resource('usuarios', UserController::class)
        ->names('users')
        ->parameters(['usuarios' => 'user'])
        ->except(['create', 'show', 'edit']);

    // Roles & Permissions Management
    Route::resource('roles', RoleController::class)
        ->names('roles')
        ->except(['create', 'show', 'edit']);
});

require __DIR__.'/settings.php';
