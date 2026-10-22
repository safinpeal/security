import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useRef } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import DangerButton from '@/Components/DangerButton';
import { UploadCloud, Trash2, Tag, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface GalleryItem {
    id: number;
    title: string;
    category: string;
    image_path: string;
}

interface GalleryManagerProps {
    galleryItems: GalleryItem[];
}

export default function GalleryManager({ galleryItems = [] }: GalleryManagerProps) {
    const { data, setData, post, reset, processing, errors } = useForm({
        title: '',
        category: 'training',
        image: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setSuccessMessage(null);

        post(route('admin.gallery.store'), {
            onSuccess: () => {
                reset();
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                setSuccessMessage('Photo successfully added to the gallery!');
                setTimeout(() => setSuccessMessage(null), 5000);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this gallery item? This action will permanently delete the photo file from storage.')) {
            post(route('admin.gallery.destroy', id), {
                _method: 'delete',
                onSuccess: () => {
                    setSuccessMessage('Photo deleted successfully.');
                    setTimeout(() => setSuccessMessage(null), 4000);
                }
            } as any); // Inertia route helper delete syntax via post
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Gallery Portfolio Manager
                </h2>
            }
        >
            <Head title="Manage Gallery" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Status Alerts */}
                    {successMessage && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm font-medium">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Main Layout: Left Upload Form, Right Current Items */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Upload Form Card */}
                        <div className="lg:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-700 shadow-sm space-y-6">
                            <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload New Photo</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Upload background-verified guard trainings, on-duty patrol operations, or event photos.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                {/* Title */}
                                <div>
                                    <InputLabel htmlFor="title" value="Photo Title" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full"
                                        placeholder="e.g. Guard Parade Drills"
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                {/* Category */}
                                <div>
                                    <InputLabel htmlFor="category" value="Operations Category" />
                                    <select
                                        id="category"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 text-sm"
                                    >
                                        <option value="training">Training (Guard drill & physical routines)</option>
                                        <option value="patrol">Patrol (Armed details & on-duty patrol)</option>
                                        <option value="office">Office (Corporate lobby & CCTV shifts)</option>
                                        <option value="bank">Bank (Bank vault & cash transit checks)</option>
                                        <option value="event">Event (Concerts, VIP, and general festival crowd)</option>
                                    </select>
                                    <InputError message={errors.category} className="mt-2" />
                                </div>

                                {/* Image File Picker */}
                                <div>
                                    <InputLabel value="Select Photo" />
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-850/50 transition-colors"
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        
                                        {imagePreview ? (
                                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-750">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-center space-y-2">
                                                <UploadCloud className="w-10 h-10 text-gray-400 mx-auto" />
                                                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block">Click to Browse File</span>
                                                <span className="text-[10px] text-gray-550 block">Supports WEBP, PNG, JPG up to 5MB</span>
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.image} className="mt-2" />
                                </div>

                                <PrimaryButton className="w-full justify-center py-2.5" disabled={processing}>
                                    {processing ? 'Uploading...' : 'Upload & Publish'}
                                </PrimaryButton>
                            </form>
                        </div>

                        {/* Current Gallery Items Card */}
                        <div className="lg:col-span-8 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-700 shadow-sm space-y-6">
                            <div className="border-b border-gray-100 dark:border-gray-700 pb-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Gallery Cards</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        These photos are currently displayed on the public landing page portfolio filter.
                                    </p>
                                </div>
                                <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 dark:bg-gray-900 rounded-lg text-gray-600 dark:text-gray-300">
                                    Total: {galleryItems.length}
                                </span>
                            </div>

                            {galleryItems.length === 0 ? (
                                <div className="p-12 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl space-y-3">
                                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No photos in the gallery</p>
                                    <p className="text-xs text-gray-500">Upload your first photo using the left panel to populate the list.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {galleryItems.map((item) => (
                                        <div 
                                            key={item.id} 
                                            className="group rounded-xl border border-gray-150 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900/50 flex flex-col justify-between hover:shadow-md transition-shadow"
                                        >
                                            {/* Photo */}
                                            <div className="h-40 relative overflow-hidden bg-slate-900">
                                                <img 
                                                    src={item.image_path} 
                                                    alt={item.title} 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        // Handle missing files (fallbacks for seeded database items)
                                                        const target = e.target as HTMLImageElement;
                                                        const fallbacks: Record<string, string> = {
                                                            'training': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
                                                            'patrol': 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
                                                            'office': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
                                                            'event': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
                                                            'bank': 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=800&q=80',
                                                        };
                                                        target.src = fallbacks[item.category] || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80';
                                                    }}
                                                />
                                            </div>

                                            {/* Details & Action */}
                                            <div className="p-4 flex items-center justify-between gap-4">
                                                <div className="min-w-0">
                                                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                                                        <Tag className="w-2.5 h-2.5" />
                                                        {item.category}
                                                    </span>
                                                    <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate mt-1">
                                                        {item.title}
                                                    </h4>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 dark:bg-red-950/20 dark:hover:bg-red-950/50 transition-colors shrink-0"
                                                    title="Delete Photo"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
