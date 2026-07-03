<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Settings
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // 2. Services
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->json('key_responsibilities')->nullable();
            $table->json('benefits')->nullable();
            $table->json('industries_served')->nullable();
            $table->string('image_path')->nullable();
            $table->timestamps();
        });

        // 3. Clients
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('company_name');
            $table->string('contact_person');
            $table->string('phone');
            $table->string('email');
            $table->string('location');
            $table->string('industry');
            $table->timestamps();
        });

        // 4. Security Guards
        Schema::create('security_guards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('full_name');
            $table->string('phone');
            $table->string('email');
            $table->string('national_id');
            $table->text('address');
            $table->integer('experience')->default(0);
            $table->string('status')->default('available'); // available, on_duty, leave
            $table->string('resume_path')->nullable();
            $table->string('certificate_path')->nullable();
            $table->timestamps();
        });

        // 5. Contract Types
        Schema::create('contract_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 6. Contracts
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->foreignId('contract_type_id')->constrained('contract_types')->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('monthly_rate', 10, 2);
            $table->decimal('total_amount', 12, 2);
            $table->string('status')->default('pending'); // pending, active, expired, terminated
            $table->timestamps();
        });

        // 7. Quote Requests
        Schema::create('quote_requests', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('contact_person');
            $table->string('phone');
            $table->string('email');
            $table->string('location');
            $table->string('industry');
            $table->integer('guards_needed')->default(1);
            $table->string('contract_type'); // monthly, annual
            $table->date('start_date');
            $table->text('additional_requirements')->nullable();
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->timestamps();
        });

        // 8. Job Applications
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('phone');
            $table->string('email');
            $table->string('national_id');
            $table->text('address');
            $table->integer('experience')->default(0);
            $table->string('resume_path')->nullable();
            $table->string('certificate_path')->nullable();
            $table->string('status')->default('pending'); // pending, interviewing, hired, rejected
            $table->timestamps();
        });

        // 9. Invoices
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained('contracts')->cascadeOnDelete();
            $table->string('invoice_number')->unique();
            $table->decimal('amount', 10, 2);
            $table->date('issue_date');
            $table->date('due_date');
            $table->string('status')->default('unpaid'); // paid, unpaid, overdue
            $table->string('invoice_pdf_path')->nullable();
            $table->timestamps();
        });

        // 10. Payments
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained('invoices')->cascadeOnDelete();
            $table->date('payment_date');
            $table->decimal('amount', 10, 2);
            $table->string('payment_method'); // bank_transfer, credit_card, cash, SSLCommerz
            $table->string('transaction_id')->nullable();
            $table->string('status')->default('completed'); // completed, failed, pending
            $table->timestamps();
        });

        // 11. Testimonials
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('client_name');
            $table->string('designation');
            $table->string('company');
            $table->text('feedback');
            $table->integer('rating')->default(5);
            $table->string('image_path')->nullable();
            $table->timestamps();
        });

        // 12. Gallery
        Schema::create('gallery', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category'); // training, patrol, event, bank, office, etc.
            $table->string('image_path');
            $table->timestamps();
        });

        // 13. Blogs
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content');
            $table->string('author');
            $table->string('image_path')->nullable();
            $table->string('status')->default('draft'); // draft, published
            $table->timestamps();
        });

        // 14. FAQs
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->string('category')->default('general'); // general, services, contract, support
            $table->timestamps();
        });

        // 15. Contact Messages
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->text('message');
            $table->string('status')->default('unread'); // unread, read, replied
            $table->timestamps();
        });

        // 16. Notifications
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->string('type'); // expiry_reminder, new_quote, new_job_application, system
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('blogs');
        Schema::dropIfExists('gallery');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('job_applications');
        Schema::dropIfExists('quote_requests');
        Schema::dropIfExists('contracts');
        Schema::dropIfExists('contract_types');
        Schema::dropIfExists('security_guards');
        Schema::dropIfExists('clients');
        Schema::dropIfExists('services');
        Schema::dropIfExists('settings');
    }
};
