<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QuoteRequest;
use App\Models\ContactMessage;

class ContactController extends Controller
{
    public function storeQuote(Request $request)
    {
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
    }

    public function storeMessage(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
        ]);

        ContactMessage::create(array_merge($validated, ['status' => 'unread']));

        return back()->with('success', 'Your message has been sent successfully!');
    }
}
