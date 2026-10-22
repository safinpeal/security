<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Client;
use App\Models\Contract;
use App\Models\ContractType;
use App\Models\Faq;
use App\Models\Gallery;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Role;
use App\Models\SecurityGuard;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Roles
        $adminRole = Role::create([
            'name' => 'Administrator',
            'slug' => 'admin',
            'permissions' => ['all' => true],
        ]);

        $clientRole = Role::create([
            'name' => 'Client Representative',
            'slug' => 'client',
            'permissions' => [
                'view_contracts' => true,
                'request_guards' => true,
                'view_invoices' => true,
                'download_invoices' => true,
                'renew_contracts' => true,
                'submit_support' => true,
            ],
        ]);

        $guardRole = Role::create([
            'name' => 'Security Guard',
            'slug' => 'guard',
            'permissions' => [
                'view_schedule' => true,
                'request_leave' => true,
            ],
        ]);

        // 2. Seed Settings (Company Details)
        $settings = [
            'company_name' => 'G.S. Securities Ltd.',
            'tagline' => 'Your Security is Our Priority',
            'phone' => '+880 1901-441897',
            'hotline' => '+880 1901-441899',
            'emergency_contact' => '+880 1715-962148',
            'email' => 'info.gssecurities@gmail.com',
            'address' => '125/A New Kakrail Road, Shantinagar Plaza (3rd Floor), Shantinagar Moor, Dhaka-1000',
            'whatsapp_url' => 'https://wa.me/8801715962148',
            'google_maps_iframe' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2776856403067!2d90.41164807498772!3d23.73747378928091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b85ee8d98d2b%3A0xc3cfc319485741b0!2sShantinagar%20Plaza%2C%20Dhaka%201217!5e0!3m2!1sen!2sbd!4v1719800000000!5m2!1sen!2sbd',
            'office_hours' => 'Saturday - Thursday: 9:00 AM - 6:00 PM (Friday Closed)',
        ];

        foreach ($settings as $key => $value) {
            Setting::create(['key' => $key, 'value' => $value]);
        }

        // 3. Seed Users
        $adminUser = User::create([
            'name' => 'Md. Sazzad Hossain Bhuiyan',
            'email' => 'admin@gssecurity.com',
            'password' => Hash::make('admin123'),
            'role_id' => $adminRole->id,
        ]);

        $clientUser = User::create([
            'name' => 'David Miller',
            'email' => 'client@gssecurity.com',
            'password' => Hash::make('password'),
            'role_id' => $clientRole->id,
        ]);

        $guardUser = User::create([
            'name' => 'Rahim Uddin',
            'email' => 'guard@gssecurity.com',
            'password' => Hash::make('password'),
            'role_id' => $guardRole->id,
        ]);

        // Additional Guard Users (for status counts)
        $guardNames = ['Kamil Ahmed', 'Sujon Mia', 'Rubel Hossain', 'Arifur Rahman', 'Zahid Hasan'];
        $guardStatuses = ['available', 'on_duty', 'on_duty', 'leave', 'available'];
        $guards = [];

        foreach ($guardNames as $index => $name) {
            $email = strtolower(str_replace(' ', '.', $name)) . '@gssecurity.com';
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make('password'),
                'role_id' => $guardRole->id,
            ]);

            $guards[] = SecurityGuard::create([
                'user_id' => $user->id,
                'full_name' => $name,
                'phone' => '+880 1715-9' . rand(100000, 999999),
                'email' => $email,
                'national_id' => 'NID-' . rand(100000000, 999999999),
                'address' => 'Dhaka, Bangladesh',
                'experience' => rand(2, 10),
                'status' => $guardStatuses[$index],
            ]);
        }

        // Create profile for seeded guardUser
        SecurityGuard::create([
            'user_id' => $guardUser->id,
            'full_name' => 'Rahim Uddin',
            'phone' => '+880 1715-962100',
            'email' => 'guard@gssecurity.com',
            'national_id' => 'NID-884029472',
            'address' => 'Moghbazar, Dhaka-1217',
            'experience' => 5,
            'status' => 'available',
        ]);

        // Create profile for seeded clientUser
        $client = Client::create([
            'user_id' => $clientUser->id,
            'company_name' => 'Apex Healthcare Group',
            'contact_person' => 'David Miller',
            'phone' => '+880 1901-441000',
            'email' => 'client@gssecurity.com',
            'location' => 'Gulshan-2, Dhaka',
            'industry' => 'Healthcare',
        ]);

        // Create another Client without User account for records
        $otherClient = Client::create([
            'user_id' => User::create([
                'name' => 'Farhana Kabir',
                'email' => 'farhana@easternbank.com',
                'password' => Hash::make('password'),
                'role_id' => $clientRole->id,
            ])->id,
            'company_name' => 'Eastern Bank PLC',
            'contact_person' => 'Farhana Kabir',
            'phone' => '+880 1901-442000',
            'email' => 'farhana@easternbank.com',
            'location' => 'Motijheel C/A, Dhaka',
            'industry' => 'Banking',
        ]);

        // 4. Seed Services
        $servicesData = [
            [
                'name' => 'Bank Security',
                'description' => 'High-security personnel trained in crisis management, surveillance monitoring, and secure cash-in-transit procedures for financial institutions.',
                'key_responsibilities' => ['Access point monitoring', 'Cash-in-transit escort', 'Vault security auditing', 'ATM lobby patrols'],
                'benefits' => ['Minimizes financial risks', 'Builds customer trust', '24/7 proactive threat detection', 'Rapid response drill coordination'],
                'industries_served' => ['Commercial Banks', 'Credit Unions', 'Microfinance Offices', 'Central Vault Facilities'],
                'image_path' => '/assets/services/bank.jpg'
            ],
            [
                'name' => 'School & College Security',
                'description' => 'Specially trained, friendly, yet vigilant guards who protect educational institutions, students, teachers, and school assets.',
                'key_responsibilities' => ['Visitor screening and check-ins', 'Student dispersal control', 'Boundary patrolling', 'Anti-vandalism monitoring'],
                'benefits' => ['Safe learning environment', 'Bullying deterrence', 'Rapid medical response support', 'Prevent unauthorized entries'],
                'industries_served' => ['Primary Schools', 'High Schools', 'Universities', 'Research Institutes'],
                'image_path' => '/assets/services/school.jpg'
            ],
            [
                'name' => 'Hospital Security',
                'description' => 'Dedicated hospital security personnel prioritizing patient privacy, crowd management, and prevention of medical ward conflicts.',
                'key_responsibilities' => ['ER crowd management', 'Patient-guard coordination', 'Emergency exit checks', 'Preventing drug pilferage'],
                'benefits' => ['Ensures uninterrupted care', 'De-escalation of emotional disputes', '24/7 asset safety', 'Protected parking systems'],
                'industries_served' => ['Public Hospitals', 'Private Clinics', 'Diagnostic Labs', 'Pharmaceutical Storehouses'],
                'image_path' => '/assets/services/hospital.jpg'
            ],
            [
                'name' => 'Office Security',
                'description' => 'Corporate-suited security professionals managing lobby receptions, visitor logs, and multi-floor fire safety inspections.',
                'key_responsibilities' => ['ID card verification', 'CCTV monitoring room control', 'Fire safety patrol checks', 'Intellectual asset control'],
                'benefits' => ['Professional corporate image', 'No unauthorized intrusions', 'Immediate evacuation assistance', 'Night shifts asset protection'],
                'industries_served' => ['Multinational Offices', 'IT parks', 'Government Secretariats', 'Coworking Spaces'],
                'image_path' => '/assets/services/office.jpg'
            ],
            [
                'name' => 'Factory Security',
                'description' => 'Industrial security teams managing labor entries, truck weighing logs, and preventing raw material leakage.',
                'key_responsibilities' => ['Truck entry and cargo log registration', 'Worker frisking protocols', 'Perimeter fence patrol', 'Machinery lockup audits'],
                'benefits' => ['Prevents internal theft', 'Labor dispute containment', 'Monitored logistics flow', 'OSHA health and safety monitoring'],
                'industries_served' => ['Garment Factories', 'Steel Mills', 'Food Processing Plants', 'Chemical Labs'],
                'image_path' => '/assets/services/factory.jpg'
            ],
            [
                'name' => 'Residential Security',
                'description' => 'Guard details trained in community hospitality, gate monitoring, and patrolling neighborhoods to keep families safe.',
                'key_responsibilities' => ['Visitor verification via intercom', 'Night patrol check-ins', 'CCTV gate surveillance', 'Parking space control'],
                'benefits' => ['Peace of mind for families', 'Deterrence against break-ins', 'Assistance with deliveries', 'Emergency contact support'],
                'industries_served' => ['Apartment Complexes', 'Gated Communities', 'Condominiums', 'Diplomatic Zones'],
                'image_path' => '/assets/services/residential.jpg'
            ],
            [
                'name' => 'Event Security',
                'description' => 'Temporary security setups for grand corporate ceremonies, festivals, concerts, and public exhibitions.',
                'key_responsibilities' => ['Ticket scanning & crowd containment', 'VIP pathway protection', 'Emergency hazard checks', 'First-aid coordination'],
                'benefits' => ['Smooth incident-free execution', 'Orderly entry and exit', 'Medical emergency readiness', 'Restricted access control'],
                'industries_served' => ['Trade Shows', 'Concerts', 'Annual General Meetings', 'Political Rallies'],
                'image_path' => '/assets/services/event.jpg'
            ],
            [
                'name' => 'VIP Protection',
                'description' => 'Discreet bodyguards and close protection officers trained in threat assessment and defensive driving for high-profile individuals.',
                'key_responsibilities' => ['Route reconnaissance', 'Close proximity shielding', 'Threat assessment reports', 'Secure transit driving'],
                'benefits' => ['Personal physical safety', 'Discreet operations', 'Crowd distraction tactics', 'Flexible schedule assistance'],
                'industries_served' => ['Executives', 'Diplomats', 'Celebrities', 'High-net-worth individuals'],
                'image_path' => '/assets/services/vip.jpg'
            ]
        ];

        foreach ($servicesData as $serv) {
            Service::create([
                'name' => $serv['name'],
                'slug' => Str::slug($serv['name']),
                'description' => $serv['description'],
                'key_responsibilities' => $serv['key_responsibilities'],
                'benefits' => $serv['benefits'],
                'industries_served' => $serv['industries_served'],
                'image_path' => $serv['image_path'],
            ]);
        }

        // 5. Seed Contract Types
        $monthlyType = ContractType::create([
            'name' => 'Monthly Security Contract',
            'slug' => 'monthly',
            'description' => 'Short-term security guard contracts renewed month-to-month. Ideal for temporary events, seasonal factory operations, or initial trials.',
        ]);

        $annualType = ContractType::create([
            'name' => 'Annual Security Contract',
            'slug' => 'annual',
            'description' => 'Long-term contracts offering discounted rates and permanent guard assignments. Ideal for corporate headquarters, banks, and schools.',
        ]);

        // 6. Seed Contracts
        $contract1 = Contract::create([
            'client_id' => $client->id,
            'service_id' => Service::where('slug', 'hospital-security')->first()->id,
            'contract_type_id' => $annualType->id,
            'start_date' => date('Y-m-d', strtotime('-6 months')),
            'end_date' => date('Y-m-d', strtotime('+6 months')),
            'monthly_rate' => 120000.00,
            'total_amount' => 1440000.00,
            'status' => 'active',
        ]);

        $contract2 = Contract::create([
            'client_id' => $otherClient->id,
            'service_id' => Service::where('slug', 'bank-security')->first()->id,
            'contract_type_id' => $monthlyType->id,
            'start_date' => date('Y-m-d', strtotime('-1 month')),
            'end_date' => date('Y-m-d', strtotime('+1 month')),
            'monthly_rate' => 85000.00,
            'total_amount' => 170000.00,
            'status' => 'active',
        ]);

        // 7. Seed Invoices
        $invoice1 = Invoice::create([
            'contract_id' => $contract1->id,
            'invoice_number' => 'INV-2026-0001',
            'amount' => 120000.00,
            'issue_date' => date('Y-m-d', strtotime('-1 month')),
            'due_date' => date('Y-m-d', strtotime('-1 month + 15 days')),
            'status' => 'paid',
            'invoice_pdf_path' => 'invoices/INV-2026-0001.pdf',
        ]);

        $invoice2 = Invoice::create([
            'contract_id' => $contract1->id,
            'invoice_number' => 'INV-2026-0002',
            'amount' => 120000.00,
            'issue_date' => date('Y-m-d'),
            'due_date' => date('Y-m-d', strtotime('+15 days')),
            'status' => 'unpaid',
            'invoice_pdf_path' => null,
        ]);

        // 8. Seed Payments
        Payment::create([
            'invoice_id' => $invoice1->id,
            'payment_date' => date('Y-m-d', strtotime('-25 days')),
            'amount' => 120000.00,
            'payment_method' => 'bank_transfer',
            'transaction_id' => 'TXN-BANK-8947293847',
            'status' => 'completed',
        ]);

        // 9. Seed Testimonials
        Testimonial::create([
            'client_name' => 'Md. Farooq Ahmed',
            'designation' => 'Head of Corporate Services',
            'company' => 'Prime Bank PLC',
            'feedback' => 'G.S. Securities Ltd. has supplied highly disciplined guards at our branches. Their response to alarms is exemplary and their training standards are truly state of the art.',
            'rating' => 5,
        ]);

        Testimonial::create([
            'client_name' => 'Prof. Dr. M. A. Latif',
            'designation' => 'Registrar',
            'company' => 'National Scholars College',
            'feedback' => 'Managing student entry and boundary safety is complex. The guards assigned by G.S. Securities are extremely polite, firm, and maintain a secure environment for our staff and pupils.',
            'rating' => 5,
        ]);

        // 10. Seed Gallery
        $galleryItems = [
            ['title' => 'Guard Drill Session', 'category' => 'training', 'image_path' => '/assets/gallery/training1.jpg'],
            ['title' => 'Armed Response Unit', 'category' => 'patrol', 'image_path' => '/assets/gallery/patrol1.jpg'],
            ['title' => 'Night Shift Control', 'category' => 'office', 'image_path' => '/assets/gallery/office1.jpg'],
            ['title' => 'Event Perimeter Security', 'category' => 'event', 'image_path' => '/assets/gallery/event1.jpg'],
            ['title' => 'Bank Vault Security Guard', 'category' => 'bank', 'image_path' => '/assets/gallery/bank1.jpg'],
            ['title' => 'Tactical Defensive Training', 'category' => 'training', 'image_path' => '/assets/gallery/training2.jpg'],
        ];

        foreach ($galleryItems as $item) {
            Gallery::create($item);
        }

        // 11. Seed FAQs
        $faqs = [
            [
                'question' => 'Are your security guards professionally trained?',
                'answer' => 'Yes. All our guards undergo a rigorous 4-week physical training camp covering fire drills, emergency evacuation, de-escalation tactics, close combat defense, and basic first aid in compliance with national safety guidelines.',
                'category' => 'general',
            ],
            [
                'question' => 'How quickly can you deploy guards to a new site?',
                'answer' => 'For standard office or residential deployments, we can typically deploy background-verified guards within 48 to 72 hours. For emergency rapid response details, we can mobilize within 6 hours.',
                'category' => 'services',
            ],
            [
                'question' => 'Do you provide armed security personnel?',
                'answer' => 'Yes. We provide licensed armed guards specifically vetted and trained for high-risk profiles such as banks, cash-in-transit, and executive VIP close protection details.',
                'category' => 'services',
            ],
            [
                'question' => 'What happens if a guard is absent or sick?',
                'answer' => 'Our operations center is active 24/7/365. We maintain a reserve guard squad of 15% of our workforce. If a guard reports sick, our supervisor automatically deploys a substitute guard before the shift starts.',
                'category' => 'support',
            ],
        ];

        foreach ($faqs as $f) {
            Faq::create($f);
        }

        // 12. Seed Blogs
        Blog::create([
            'title' => 'Improving Fire Safety Protocols in Gated Communities',
            'slug' => 'improving-fire-safety-protocols',
            'content' => 'Fire safety is a critical yet often overlooked aspect of residential community safety. Our security guards are trained to inspect fire extinguishers monthly and lead emergency evacuations...',
            'author' => 'Lt. Col. (Retd.) Rafiqul Islam, Director of Operations',
            'status' => 'published',
        ]);

        Blog::create([
            'title' => 'The Role of Technology in Modern Bank Security',
            'slug' => 'role-of-technology-in-bank-security',
            'content' => 'Physical security guards remain the cornerstone of bank security, but integrating modern CCTV monitors with AI-based motion alert sensors improves efficiency tenfold. Here is how G.S. Securities merges human vigilance with technological support.',
            'author' => 'Md. Sazzad Hossain Bhuiyan, MD',
            'status' => 'published',
        ]);
    }
}
