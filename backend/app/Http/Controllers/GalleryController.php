<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gallery;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/GalleryManager', [
            'galleryItems' => Gallery::orderBy('created_at', 'desc')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:training,patrol,office,bank,event',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            // Save the file in storage/app/public/gallery
            $path = $request->file('image')->store('gallery', 'public');
            
            Gallery::create([
                'title' => $request->title,
                'category' => $request->category,
                'image_path' => '/storage/' . $path,
            ]);
        }

        return redirect()->back()->with('success', 'Photo uploaded and added to gallery successfully.');
    }

    public function destroy(Gallery $gallery)
    {
        // Extract relative file path from public path
        // e.g. "/storage/gallery/abc.jpg" becomes "gallery/abc.jpg"
        $filePath = str_replace('/storage/', '', $gallery->image_path);
        
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }

        $gallery->delete();

        return redirect()->back()->with('success', 'Gallery photo deleted successfully.');
    }
}
