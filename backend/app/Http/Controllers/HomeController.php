<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Application;
use Inertia\Inertia;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Testimonial;
use App\Models\Gallery;
use App\Models\Blog;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Welcome', [
            'canLogin' => \Route::has('login'),
            'canRegister' => \Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'services' => Service::all(),
            'settings' => Setting::pluck('value', 'key'),
            'testimonials' => Testimonial::all(),
            'gallery' => Gallery::all(),
            'blogs' => Blog::where('status', 'published')->get(),
        ]);
    }

    public function dashboard()
    {
        return Inertia::render('Dashboard');
    }
}
