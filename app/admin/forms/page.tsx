'use client';

export default function AdminForms() {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden animate-in fade-in duration-500">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="font-display text-lg">Contact Form Entries</h3>
      </div>
      <div className="p-12 text-center text-gray-500 font-body">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </div>
        <p>No form entries have been received yet.</p>
        <p className="text-sm mt-2">When customers use the contact form, their messages will appear here.</p>
      </div>
    </div>
  );
}
