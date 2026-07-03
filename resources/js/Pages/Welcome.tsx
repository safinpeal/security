import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, 
    ShieldCheck, 
    Phone, 
    MessageSquare, 
    Check, 
    Plus, 
    Minus, 
    ShoppingCart, 
    ChevronRight, 
    X, 
    Lock, 
    User, 
    Star, 
    Clock, 
    MapPin, 
    Mail, 
    Smartphone, 
    Send, 
    Building, 
    Award, 
    ChevronDown, 
    Grid,
    Calendar,
    Briefcase
} from 'lucide-react';

interface Service {
    id: number;
    name: string;
    slug: string;
    description: string;
    key_responsibilities: string[];
    benefits: string[];
    industries_served: string[];
    image_path: string | null;
}

interface Testimonial {
    id: number;
    client_name: string;
    designation: string;
    company: string;
    feedback: string;
    rating: number;
    image_path: string | null;
}

interface GalleryItem {
    id: number;
    title: string;
    category: string;
    image_path: string;
}

interface Blog {
    id: number;
    title: string;
    slug: string;
    content: string;
    author: string;
    image_path: string | null;
}

interface WelcomeProps {
    auth: {
        user: any;
    };
    services: Service[];
    settings: Record<string, string>;
    testimonials: Testimonial[];
    gallery: GalleryItem[];
    blogs: Blog[];
}

export default function Welcome({
    auth,
    services = [],
    settings = {},
    testimonials = [],
    gallery = [],
    blogs = []
}: WelcomeProps) {
    // -------------------------------------------------------------
    // Image Fallbacks (Unsplash) for beautiful Visual Presentation
    // -------------------------------------------------------------
    const getServiceImage = (name: string) => {
        const fallbacks: Record<string, string> = {
            'Bank Security': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
            'School & College Security': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
            'Hospital Security': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
            'Office Security': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
            'Factory Security': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
            'Residential Security': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
            'Event Security': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
            'VIP Protection': 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80',
        };
        return fallbacks[name] || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80';
    };

    const getGalleryImage = (category: string, id: number) => {
        const fallbacks: Record<string, string[]> = {
            'training': [
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
            ],
            'patrol': [
                'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
            ],
            'office': [
                'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
            ],
            'event': [
                'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80',
            ],
            'bank': [
                'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80',
            ]
        };
        const list = fallbacks[category] || ['https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80'];
        return list[id % list.length];
    };

    const displayGalleryImage = (item: GalleryItem) => {
        if (item.image_path && item.image_path.startsWith('/storage/')) {
            return item.image_path;
        }
        return getGalleryImage(item.category, item.id);
    };

    // -------------------------------------------------------------
    // Settings Defaults
    // -------------------------------------------------------------
    const companyName = settings.company_name || 'G.S. Securities Ltd.';
    const hotline = settings.hotline || '+880 1901-441899';
    const phoneNum = settings.phone || '+880 1901-441897';
    const whatsappUrl = settings.whatsapp_url || 'https://wa.me/8801715962148';
    const emailAddr = settings.email || 'info.gssecurities@gmail.com';
    const address = settings.address || '125/A New Kakrail Road, Shantinagar, Dhaka';
    const officeHours = settings.office_hours || 'Sat - Thu: 9:00 AM - 6:00 PM';

    // -------------------------------------------------------------
    // Cart Logic (Persistent local selection)
    // -------------------------------------------------------------
    const [cart, setCart] = useState<Service[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('gs_services_cart');
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        } catch (e) {
            console.error('Failed to load cart', e);
        }
    }, []);

    const toggleCartItem = (service: Service) => {
        let updated: Service[];
        if (cart.some(item => item.id === service.id)) {
            updated = cart.filter(item => item.id !== service.id);
        } else {
            updated = [...cart, service];
        }
        setCart(updated);
        localStorage.setItem('gs_services_cart', JSON.stringify(updated));
    };

    const isAdded = (serviceId: number) => cart.some(item => item.id === serviceId);

    // Build custom WhatsApp Inquiry Text
    const getWhatsAppLink = () => {
        if (cart.length === 0) {
            return whatsappUrl;
        }
        const serviceNames = cart.map(item => `*${item.name}*`).join(', ');
        const message = `Hello ${companyName}, I visited your website and I am interested in inquiring about the following security services:\n\n${serviceNames}\n\nPlease share the quote rates and guard availability details. Thanks!`;
        const phoneParam = whatsappUrl.split('wa.me/')[1]?.split('?')[0] || '8801715962148';
        return `https://wa.me/${phoneParam}?text=${encodeURIComponent(message)}`;
    };

    // -------------------------------------------------------------
    // Gallery Category Filtering
    // -------------------------------------------------------------
    const [galleryFilter, setGalleryFilter] = useState('all');
    const filteredGallery = galleryFilter === 'all' 
        ? gallery 
        : gallery.filter(item => item.category === galleryFilter);

    // -------------------------------------------------------------
    // Quick Quote Request Form State
    // -------------------------------------------------------------
    const [quoteForm, setQuoteForm] = useState({
        company_name: '',
        contact_person: '',
        phone: '',
        email: '',
        location: '',
        industry: '',
        guards_needed: 1,
        contract_type: 'Annual Security Contract',
        start_date: '',
        additional_requirements: ''
    });
    const [quoteLoading, setQuoteLoading] = useState(false);
    const [quoteSuccess, setQuoteSuccess] = useState<string | null>(null);
    const [quoteError, setQuoteError] = useState<string | null>(null);

    const handleQuoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setQuoteLoading(true);
        setQuoteSuccess(null);
        setQuoteError(null);

        // Map cart items if selected to additional requirements
        const finalRequirements = cart.length > 0
            ? `[Selected Features in Cart: ${cart.map(c => c.name).join(', ')}]\n\n${quoteForm.additional_requirements}`
            : quoteForm.additional_requirements;

        router.post('/quote-requests', {
            ...quoteForm,
            additional_requirements: finalRequirements
        }, {
            onSuccess: () => {
                setQuoteLoading(false);
                setQuoteSuccess('Your quote request has been submitted successfully! Our representative will call you shortly.');
                setQuoteForm({
                    company_name: '',
                    contact_person: '',
                    phone: '',
                    email: '',
                    location: '',
                    industry: '',
                    guards_needed: 1,
                    contract_type: 'Annual Security Contract',
                    start_date: '',
                    additional_requirements: ''
                });
                setCart([]); // Clear cart on success
                localStorage.removeItem('gs_services_cart');
            },
            onError: (errors) => {
                setQuoteLoading(false);
                setQuoteError(Object.values(errors)[0] || 'An error occurred. Please double check your details.');
            }
        });
    };

    // -------------------------------------------------------------
    // Contact Message Form State
    // -------------------------------------------------------------
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [contactLoading, setContactLoading] = useState(false);
    const [contactSuccess, setContactSuccess] = useState<string | null>(null);

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setContactLoading(true);
        setContactSuccess(null);

        router.post('/contact-messages', contactForm, {
            onSuccess: () => {
                setContactLoading(false);
                setContactSuccess('Your message has been sent successfully! We will email or call you back soon.');
                setContactForm({ name: '', email: '', phone: '', message: '' });
            },
            onError: () => {
                setContactLoading(false);
            }
        });
    };

    // FAQ list open states
    const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);
    const faqs = [
        {
            q: 'Are your security guards professionally trained?',
            a: 'Yes. All our guards undergo a rigorous 4-week physical training camp covering fire drills, emergency evacuation, de-escalation tactics, close combat defense, and basic first aid in compliance with national safety guidelines.'
        },
        {
            q: 'How quickly can you deploy guards to a new site?',
            a: 'For standard office or residential deployments, we can typically deploy background-verified guards within 48 to 72 hours. For emergency rapid response details, we can mobilize within 6 hours.'
        },
        {
            q: 'Do you provide armed security personnel?',
            a: 'Yes. We provide licensed armed guards specifically vetted and trained for high-risk profiles such as banks, cash-in-transit, and executive VIP close protection details.'
        },
        {
            q: 'What happens if a guard is absent or sick?',
            a: 'Our operations center is active 24/7/365. We maintain a reserve guard squad of 15% of our workforce. If a guard reports sick, our supervisor automatically deploys a substitute guard before the shift starts.'
        }
    ];

    return (
        <>
            <Head title={`${companyName} - Elite Guard & Tactical Protection Services`} />
            <div className="min-h-screen bg-[#050814] text-slate-100 font-sans antialiased selection:bg-amber-400 selection:text-black overflow-x-hidden">

            {/* Glowing Accent Orbs in Background */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />
            <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[130px] pointer-events-none -z-10" />

            {/* HEADER / NAVIGATION */}
            <header className="sticky top-0 z-40 bg-[#050814]/80 backdrop-blur-md border-b border-slate-800/60 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-300">
                            <Shield className="w-5.5 h-5.5 text-[#050814] stroke-[2.5]" />
                        </div>
                        <div>
                            <span className="text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors duration-300 block">
                                G.S. SECURITIES
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold block -mt-1">
                                Elite Protection Agency
                            </span>
                        </div>
                    </Link>

                    {/* Nav Items */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                        <a href="#services" className="hover:text-amber-400 transition-colors">Services</a>
                        <a href="#gallery" className="hover:text-amber-400 transition-colors">Gallery</a>
                        <a href="#testimonials" className="hover:text-amber-400 transition-colors">Testimonials</a>
                        <a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a>
                        <a href="#quote" className="hover:text-amber-400 transition-colors">Get Quote</a>
                    </nav>

                    {/* Quick CTAs / Login */}
                    <div className="flex items-center gap-3">
                        {/* Cart Button */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex items-center justify-center p-2.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:text-amber-400 transition-all duration-300 group"
                            title="Selected Features"
                        >
                            <ShoppingCart className="w-5 h-5 text-slate-300 group-hover:scale-110 transition-transform" />
                            {cart.length > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 text-[#050814] text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20"
                                >
                                    {cart.length}
                                </motion.span>
                            )}
                        </button>

                        {/* Call CTA */}
                        <a
                            href={`tel:${phoneNum}`}
                            className="hidden lg:flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-300 hover:text-white transition-all duration-300"
                        >
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{phoneNum}</span>
                        </a>

                        {/* Portal Access */}
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all duration-300"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 hover:text-white transition-all duration-300 flex items-center gap-1.5"
                            >
                                <Lock className="w-3 h-3" />
                                <span>Agent Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    {/* Hero Text */}
                    <div className="lg:col-span-7 text-left space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            Premium Command Security Details
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                            Elite Protection for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-emerald-400">
                                Your Vital Assets
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
                            Deploy background-verified, physically trained tactical guards. Tailored protection models built specifically for banking vaults, corporate office lobbies, schools, hospital ER complexes, and VIP logistics.
                        </p>

                        {/* Interactive CTAs */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            <a
                                href="#services"
                                className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all duration-300"
                            >
                                Browse Services
                            </a>
                            <a
                                href="#quote"
                                className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white transition-all duration-300"
                            >
                                Request Custom Quote
                            </a>
                            <a
                                href={getWhatsAppLink()}
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 text-[#25D366] transition-all duration-300 flex items-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4 fill-current" />
                                <span>WhatsApp Us</span>
                            </a>
                        </div>

                        {/* Key Trust Badges */}
                        <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-800/80 max-w-lg">
                            <div>
                                <span className="text-2xl sm:text-3xl font-extrabold text-white block">100%</span>
                                <span className="text-xs text-slate-400 uppercase tracking-wider">Vetted Guards</span>
                            </div>
                            <div>
                                <span className="text-2xl sm:text-3xl font-extrabold text-white block">24/7</span>
                                <span className="text-xs text-slate-400 uppercase tracking-wider">Active Command</span>
                            </div>
                            <div>
                                <span className="text-2xl sm:text-3xl font-extrabold text-white block">6 Hr</span>
                                <span className="text-xs text-slate-400 uppercase tracking-wider">Rapid Deployment</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual Card */}
                    <div className="lg:col-span-5 relative flex justify-center">
                        <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm group p-3">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-transparent to-transparent z-10" />
                            <img
                                src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80"
                                alt="Security Officer"
                                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Floating Widget Inside Hero Visual */}
                            <div className="absolute bottom-6 left-6 right-6 z-20 p-5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                        <Award className="w-5.5 h-5.5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">ISO 9001 Vetted</h4>
                                        <p className="text-xs text-slate-400">Tactical readiness & discipline standards</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION */}
            <section id="services" className="py-24 border-t border-slate-900 bg-gradient-to-b from-[#050814] to-[#070c1e] px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-xs uppercase tracking-widest text-amber-400 font-bold">Public Service Roster</h2>
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                            Choose Your Required Security Features
                        </h3>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Add services directly to your Selection Cart to inquire, get pricing quotes, or discuss details instantly via WhatsApp or Phone call.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <motion.div
                                layoutId={`service-card-${service.id}`}
                                key={service.id}
                                className="flex flex-col h-full rounded-2xl bg-[#0a1023] border border-slate-800/80 overflow-hidden hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-slate-950/30 group"
                            >
                                {/* Service Image */}
                                <div className="h-48 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
                                    <img
                                        src={getServiceImage(service.name)}
                                        alt={service.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                                                {service.name}
                                            </h4>
                                            <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold tracking-wider">
                                                Active
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                                            {service.description}
                                        </p>

                                        {/* Responsibilities list preview */}
                                        <div className="space-y-1.5">
                                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Key Duties</span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {service.key_responsibilities?.slice(0, 3).map((res, i) => (
                                                    <span key={i} className="text-[10px] bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                                                        {res}
                                                    </span>
                                                ))}
                                                {service.key_responsibilities?.length > 3 && (
                                                    <span className="text-[10px] text-slate-500 px-1 py-0.5">+{service.key_responsibilities.length - 3} more</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-6 mt-6 border-t border-slate-900 flex items-center justify-between gap-3">
                                        <button
                                            onClick={() => toggleCartItem(service)}
                                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                                                isAdded(service.id)
                                                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-lg shadow-amber-500/10'
                                                    : 'bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                                            }`}
                                        >
                                            {isAdded(service.id) ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                    <span>Added to Roster</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-3.5 h-3.5" />
                                                    <span>Add to Selection</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* INTERACTIVE GALLERY */}
            <section id="gallery" className="py-24 bg-[#050814] px-4 sm:px-6 lg:px-8 border-t border-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                        <div className="space-y-3">
                            <h2 className="text-xs uppercase tracking-widest text-amber-400 font-bold">Visual Portfolio</h2>
                            <h3 className="text-3xl font-extrabold text-white">Operations & Guard Readiness</h3>
                            <p className="text-slate-400 max-w-xl">
                                Real snapshots of training camps, bank vault guard checks, cash-in-transit convoys, and emergency drills.
                            </p>
                        </div>

                        {/* Category filter buttons */}
                        <div className="flex flex-wrap gap-2">
                            {['all', 'training', 'patrol', 'office', 'bank', 'event'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setGalleryFilter(cat)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                                        galleryFilter === cat
                                            ? 'bg-amber-400 text-slate-950 border-amber-400'
                                            : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:bg-slate-850 hover:text-white'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filtered Grid */}
                    <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredGallery.map((item, idx) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    key={item.id}
                                    className="relative aspect-square md:aspect-[4/3] rounded-2xl border border-slate-800 overflow-hidden bg-slate-900 group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300 z-10" />
                                    <img
                                        src={displayGalleryImage(item)}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = getGalleryImage(item.category, item.id);
                                        }}
                                    />
                                    <div className="absolute bottom-4 left-4 z-20">
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                                            {item.category}
                                        </span>
                                        <span className="text-sm font-bold text-white block mt-0.5">
                                            {item.title}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section id="testimonials" className="py-24 bg-gradient-to-b from-[#070c1e] to-[#050814] px-4 sm:px-6 lg:px-8 border-t border-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-xs uppercase tracking-widest text-amber-400 font-bold">Trusted Partnerships</h2>
                        <h3 className="text-3xl font-extrabold text-white">Feedback from Corporate Clients</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {testimonials.map((test) => (
                            <div
                                key={test.id}
                                className="p-8 rounded-2xl bg-[#0a1023] border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-colors group"
                            >
                                <div className="space-y-4">
                                    {/* Star Rating */}
                                    <div className="flex gap-1">
                                        {[...Array(test.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed italic">
                                        "{test.feedback}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 pt-6 mt-6 border-t border-slate-900/60">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold border border-slate-700">
                                        {test.client_name[0]}
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-white block">
                                            {test.client_name}
                                        </span>
                                        <span className="text-xs text-slate-400 block mt-0.5">
                                            {test.designation}, <span className="text-emerald-400 font-medium">{test.company}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Accordion FAQ & Blogs Section */}
            <section id="faq" className="py-24 bg-[#050814] px-4 sm:px-6 lg:px-8 border-t border-slate-900">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* FAQ */}
                    <div className="lg:col-span-6 space-y-8">
                        <div className="space-y-3">
                            <h2 className="text-xs uppercase tracking-widest text-amber-400 font-bold">Client Support</h2>
                            <h3 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h3>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-slate-800/80 bg-slate-900/30 overflow-hidden transition-all duration-300"
                                >
                                    <button
                                        onClick={() => setFaqOpenIndex(faqOpenIndex === index ? null : index)}
                                        className="w-full flex items-center justify-between p-5 text-left font-semibold text-white hover:text-amber-400 transition-colors"
                                    >
                                        <span className="text-sm">{faq.q}</span>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform duration-300 ${faqOpenIndex === index ? 'rotate-185 text-amber-400' : ''}`} />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {faqOpenIndex === index && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto' }}
                                                exit={{ height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="border-t border-slate-900"
                                            >
                                                <p className="p-5 text-xs text-slate-400 leading-relaxed bg-[#0a1023]/20">
                                                    {faq.a}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BLOGS/RESOURCES */}
                    <div className="lg:col-span-6 space-y-8">
                        <div className="space-y-3">
                            <h2 className="text-xs uppercase tracking-widest text-amber-400 font-bold">Safety Guides</h2>
                            <h3 className="text-3xl font-extrabold text-white">Latest Security Articles</h3>
                        </div>

                        <div className="space-y-6">
                            {blogs.slice(0, 2).map((blog) => (
                                <article
                                    key={blog.id}
                                    className="p-6 rounded-2xl bg-[#0a1023] border border-slate-800/80 hover:border-slate-700 transition-colors space-y-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                            Resource
                                        </span>
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            5 min read
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-bold text-white hover:text-amber-400 transition-colors">
                                        {blog.title}
                                    </h4>
                                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                        {blog.content}
                                    </p>
                                    <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between text-xs">
                                        <span className="text-slate-500">
                                            By: <span className="text-slate-300 font-semibold">{blog.author}</span>
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* QUOTE FORM SECTION */}
            <section id="quote" className="py-24 bg-gradient-to-b from-[#050814] to-[#080d21] px-4 sm:px-6 lg:px-8 border-t border-slate-900">
                <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-[#0a1023]/60 border border-slate-800/80 backdrop-blur-md relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="text-center space-y-3 mb-10">
                        <Shield className="w-12 h-12 text-amber-400 mx-auto" />
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Request a Consultation Quote</h3>
                        <p className="text-xs text-slate-400 max-w-lg mx-auto">
                            Fill out your requirements, and we will formulate a deployment guard schedule and monthly pricing rate structure.
                        </p>
                    </div>

                    {quoteSuccess && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                            {quoteSuccess}
                        </div>
                    )}
                    {quoteError && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                            {quoteError}
                        </div>
                    )}

                    <form onSubmit={handleQuoteSubmit} className="space-y-6">
                        {cart.length > 0 && (
                            <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/20 flex items-center justify-between gap-4">
                                <div>
                                    <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">Cart Attachment Included</span>
                                    <span className="text-[11px] text-slate-300 block mt-0.5">
                                        Your request will automatically link: {cart.map(c => c.name).join(', ')}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCart([]);
                                        localStorage.removeItem('gs_services_cart');
                                    }}
                                    className="text-xs text-slate-400 hover:text-white underline shrink-0"
                                >
                                    Clear Attachment
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Company Name (Optional)</label>
                                <input
                                    type="text"
                                    value={quoteForm.company_name}
                                    onChange={(e) => setQuoteForm({...quoteForm, company_name: e.target.value})}
                                    placeholder="e.g. Apex Health Group"
                                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Contact Person *</label>
                                <input
                                    type="text"
                                    required
                                    value={quoteForm.contact_person}
                                    onChange={(e) => setQuoteForm({...quoteForm, contact_person: e.target.value})}
                                    placeholder="e.g. David Miller"
                                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Contact Phone *</label>
                                <input
                                    type="tel"
                                    required
                                    value={quoteForm.phone}
                                    onChange={(e) => setQuoteForm({...quoteForm, phone: e.target.value})}
                                    placeholder="e.g. +880 1901-xxxxxx"
                                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Contact Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={quoteForm.email}
                                    onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                                    placeholder="e.g. support@domain.com"
                                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Deployment Location *</label>
                                <input
                                    type="text"
                                    required
                                    value={quoteForm.location}
                                    onChange={(e) => setQuoteForm({...quoteForm, location: e.target.value})}
                                    placeholder="e.g. Gulshan-2, Dhaka"
                                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Industry Sector</label>
                                <input
                                    type="text"
                                    value={quoteForm.industry}
                                    onChange={(e) => setQuoteForm({...quoteForm, industry: e.target.value})}
                                    placeholder="e.g. Banking / Gated Housing"
                                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Guards Needed *</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={quoteForm.guards_needed}
                                    onChange={(e) => setQuoteForm({...quoteForm, guards_needed: parseInt(e.target.value) || 1})}
                                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Contract Term Type</label>
                                <select
                                    value={quoteForm.contract_type}
                                    onChange={(e) => setQuoteForm({...quoteForm, contract_type: e.target.value})}
                                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                                >
                                    <option value="Annual Security Contract">Annual Security Contract (Best Rates)</option>
                                    <option value="Monthly Security Contract">Monthly Security Contract</option>
                                    <option value="Event/Short Term Detail">Temporary / Event Detail</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Deployment Start Date *</label>
                            <input
                                type="date"
                                required
                                value={quoteForm.start_date}
                                onChange={(e) => setQuoteForm({...quoteForm, start_date: e.target.value})}
                                className="w-full bg-[#050814] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Additional Guard Tasks & Requirements</label>
                            <textarea
                                value={quoteForm.additional_requirements}
                                onChange={(e) => setQuoteForm({...quoteForm, additional_requirements: e.target.value})}
                                placeholder="Specify any specific tasks like vault supervision, CCTV center shifts, night shifts, emergency drill coordinator, etc."
                                rows={4}
                                className="w-full bg-[#050814] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={quoteLoading}
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
                        >
                            {quoteLoading ? 'Submitting Quote...' : 'Submit Quote Request'}
                        </button>
                    </form>
                </div>
            </section>

            {/* SELECTION CART DRAWER */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-black z-50 cursor-pointer"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed top-0 right-0 bottom-0 w-full sm:max-w-md bg-[#070c1e] border-l border-slate-800 shadow-2xl z-50 flex flex-col p-6 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-amber-400" />
                                    <h4 className="text-base font-bold text-white">Your Service Cart</h4>
                                </div>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {cart.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-900/50 border border-slate-850 flex items-center justify-center">
                                        <ShoppingCart className="w-6 h-6 text-slate-650" />
                                    </div>
                                    <h5 className="text-sm font-semibold text-slate-350">Cart is Empty</h5>
                                    <p className="text-xs text-slate-500 max-w-[240px]">
                                        Add security guard service cards from the homepage list to build your custom roster request.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            You have selected the following services. Call or WhatsApp us to get instant pricing plans or finalize.
                                        </p>
                                        <div className="space-y-3">
                                            {cart.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 flex justify-between gap-4 items-start"
                                                >
                                                    <div>
                                                        <h5 className="text-xs font-bold text-white">{item.name}</h5>
                                                        <p className="text-[10px] text-slate-550 line-clamp-1 mt-1">{item.description}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleCartItem(item)}
                                                        className="text-slate-550 hover:text-red-400"
                                                        title="Remove"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-6 border-t border-slate-850/80 mt-6 space-y-4">
                                        <a
                                            href={getWhatsAppLink()}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-widest text-center block shadow-lg shadow-emerald-950/20"
                                        >
                                            Inquire on WhatsApp
                                        </a>
                                        <a
                                            href={`tel:${phoneNum}`}
                                            className="w-full py-3.5 bg-slate-900 border border-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-widest text-center block hover:bg-slate-800"
                                        >
                                            Call Hotline ({phoneNum})
                                        </a>
                                        <a
                                            href="#quote"
                                            onClick={() => setIsCartOpen(false)}
                                            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-widest text-center block hover:from-amber-400 hover:to-amber-500"
                                        >
                                            Request Formal Quote
                                        </a>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* FLOATING ACTION BUTTONS */}
            <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
                {/* Floating WhatsApp Bubble */}
                <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/10 hover:scale-105 hover:shadow-emerald-500/40 transition-all duration-300"
                    title="Send WhatsApp Inquiry"
                >
                    <MessageSquare className="w-6 h-6 text-slate-950 fill-current" />
                </a>

                {/* Floating Phone Call Bubble */}
                <a
                    href={`tel:${phoneNum}`}
                    className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/25 border border-amber-300/10 hover:scale-105 hover:shadow-amber-500/40 transition-all duration-300"
                    title="Call Hotline"
                >
                    <Phone className="w-6 h-6 text-slate-950" />
                </a>
            </div>

            {/* FOOTER */}
            <footer className="bg-[#03050d] border-t border-slate-900/60 pt-20 pb-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-slate-900/80">
                    {/* Column 1: Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center">
                                <Shield className="w-4 h-4 text-[#050814]" />
                            </div>
                            <span className="text-sm font-bold text-white tracking-wider">{companyName}</span>
                        </div>
                        <p className="text-slate-500 leading-relaxed">
                            Elite physical command security. 24/7 active surveillance, verified recruitment, and rapid response units across Bangladesh.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-4">
                        <span className="text-xs uppercase font-bold text-slate-300 block tracking-wider">Quick Links</span>
                        <ul className="space-y-2">
                            <li><a href="#services" className="hover:text-amber-400 transition-colors">Public Services</a></li>
                            <li><a href="#gallery" className="hover:text-amber-400 transition-colors">Readiness Gallery</a></li>
                            <li><a href="#testimonials" className="hover:text-amber-400 transition-colors">Client Testimonials</a></li>
                            <li><a href="#quote" className="hover:text-amber-400 transition-colors">Request Quote</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Contacts */}
                    <div className="space-y-4">
                        <span className="text-xs uppercase font-bold text-slate-300 block tracking-wider">Contact Info</span>
                        <ul className="space-y-2.5 text-slate-400">
                            <li className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <span>{address}</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                                <span>Hotline: {hotline}</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
                                <span>Emergency: +880 1715-962148</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                                <span>{emailAddr}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div className="space-y-4">
                        <span className="text-xs uppercase font-bold text-slate-300 block tracking-wider">Stay Protected</span>
                        <p className="text-slate-550">Subscribe to receive monthly security guidelines and security tips.</p>
                        {contactSuccess && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                                {contactSuccess}
                            </div>
                        )}
                        <form onSubmit={handleContactSubmit} className="flex gap-2">
                            <input
                                type="email"
                                required
                                placeholder="name@email.com"
                                value={contactForm.email}
                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                className="bg-[#050814] border border-slate-800 rounded-xl px-3 py-2.5 text-[11px] text-white placeholder-slate-650 flex-1 focus:outline-none focus:border-amber-400"
                            />
                            <button
                                type="submit"
                                disabled={contactLoading}
                                className="px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-550">
                    <p>© {new Date().getFullYear()} {companyName}. All Rights Reserved.</p>
                    <p className="text-[10px]">Licensed by Ministry of Home Affairs, Government of Bangladesh</p>
                </div>
            </footer>
        </div>
        </>
    );
}
