<?php

use Illuminate\Support\Facades\Route;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Testimonial;
use App\Models\Gallery;
use App\Models\Blog;
use App\Models\Faq;
use App\Http\Controllers\ContactController;

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'app' => 'GS Securities API']);
});

// Full homepage data in a single call for high performance
Route::get('/home', function () {
    return response()->json([
        'services' => Service::all(),
        'settings' => Setting::pluck('value', 'key'),
        'testimonials' => Testimonial::all(),
        'gallery' => Gallery::orderBy('created_at', 'desc')->get(),
        'blogs' => Blog::where('status', 'published')->get(),
        'faqs' => Faq::all(),
    ]);
});

// Individual resource endpoints
Route::get('/services', function () {
    return response()->json(Service::all());
});

Route::get('/gallery', function () {
    return response()->json(Gallery::orderBy('created_at', 'desc')->get());
});

Route::get('/testimonials', function () {
    return response()->json(Testimonial::all());
});

Route::get('/faqs', function () {
    return response()->json(Faq::all());
});

Route::get('/blogs', function () {
    return response()->json(Blog::where('status', 'published')->get());
});

Route::get('/settings', function () {
    return response()->json(Setting::pluck('value', 'key'));
});

// Form submissions
Route::post('/quote-requests', [ContactController::class, 'storeQuote']);
Route::post('/contact-messages', [ContactController::class, 'storeMessage']);
