<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GalleryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Testimonial;
use App\Models\Gallery;
use App\Models\Blog;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'services' => Service::all(),
        'settings' => Setting::pluck('value', 'key'),
        'testimonials' => Testimonial::all(),
        'gallery' => Gallery::all(),
        'blogs' => Blog::where('status', 'published')->get(),
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Gallery Management
    Route::group(['middleware' => [function ($request, $next) {
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Unauthorized. Only Administrators can manage the gallery.');
        }
        return $next($request);
    }]], function () {
        Route::get('/admin/gallery', [GalleryController::class, 'index'])->name('admin.gallery.index');
        Route::post('/admin/gallery', [GalleryController::class, 'store'])->name('admin.gallery.store');
        Route::delete('/admin/gallery/{gallery}', [GalleryController::class, 'destroy'])->name('admin.gallery.destroy');
    });
});

use Illuminate\Http\Request;
use App\Models\QuoteRequest;
use App\Models\ContactMessage;

Route::post('/quote-requests', function (Request $request) {
    $validated = $request->validate([
        'company_name' => 'nullable|string|max:255',
        'contact_person' => 'required|string|max:255',
        'phone' => 'required|string|max:20',
        'email' => 'required|email|max:255',
        'location' => 'required|string|max:255',
        'industry' => 'nullable|string|max:255',
        'guards_needed' => 'required|integer|min:1',
        'contract_type' => 'required|string|max:50',
        'start_date' => 'required|date',
        'additional_requirements' => 'nullable|string',
    ]);

    QuoteRequest::create(array_merge($validated, ['status' => 'pending']));

    return back()->with('success', 'Quote request submitted successfully!');
});

Route::post('/contact-messages', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|string|max:20',
        'message' => 'required|string',
    ]);

    ContactMessage::create(array_merge($validated, ['status' => 'unread']));

    return back()->with('success', 'Your message has been sent successfully!');
});

require __DIR__.'/auth.php';
