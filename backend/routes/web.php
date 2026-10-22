<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;

// Public routes (Home and Form actions)
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::post('/quote-requests', [ContactController::class, 'storeQuote'])->name('quote-requests.store');
Route::post('/contact-messages', [ContactController::class, 'storeMessage'])->name('contact-messages.store');

// Dashboard (Protected by auth)
Route::get('/dashboard', [HomeController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

// Auth Group
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Gallery Management (Protected by 'admin' middleware alias)
    Route::middleware('admin')->group(function () {
        Route::get('/admin/gallery', [GalleryController::class, 'index'])->name('admin.gallery.index');
        Route::post('/admin/gallery', [GalleryController::class, 'store'])->name('admin.gallery.store');
        Route::delete('/admin/gallery/{gallery}', [GalleryController::class, 'destroy'])->name('admin.gallery.destroy');
    });
});

require __DIR__.'/auth.php';
