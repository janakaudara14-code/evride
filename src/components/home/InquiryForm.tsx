'use client';

import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle2, FileText, MessageCircle, Download } from 'lucide-react';
import { submitInquiry } from '@/lib/data/store';
import { CONTACT_INFO, getWhatsAppInquiryUrl } from '@/lib/sriLanka';
import { generateInquiryPdf } from '@/lib/pdf/generateInquiryPdf';

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bike_model: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inquiryRef, setInquiryRef] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;

    setLoading(true);
    const ref = `EV-INQ-${Math.floor(100000 + Math.random() * 900000)}`;
    setInquiryRef(ref);

    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    try {
      await submitInquiry({
        ...formData,
        bike_model: formData.bike_model || 'General EV Inquiry',
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Inquiry store warning:', err);
    }

    // Auto Generate PDF
    try {
      generateInquiryPdf({
        inquiryRef: ref,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        vehicleModel: formData.bike_model || 'Yadea T5 / Converted EV',
        message: formData.message,
        dateStr,
      });
    } catch (pdfErr) {
      console.error('PDF error:', pdfErr);
    }

    // Open WhatsApp directly to 0710548278
    const waText = `*VOLTRIDER EV SRI LANKA - NEW INQUIRY & QUOTE REQUEST*\n\n` +
      `📄 *Ref:* ${ref}\n` +
      `👤 *Customer Name:* ${formData.name}\n` +
      `📞 *Phone / WhatsApp:* ${formData.phone}\n` +
      `📧 *Email:* ${formData.email || 'Not given'}\n` +
      `🛵 *Vehicle Model:* ${formData.bike_model || 'Yadea T5 / EV Scooter / Motorbike'}\n` +
      `💬 *Requirements:* ${formData.message}\n\n` +
      `_A PDF copy of this inquiry has also been generated._`;

    const waUrl = `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(waText)}`;
    
    // Open WhatsApp in new tab
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank');
    }

    setLoading(false);
    setSubmitted(true);
  };

  const handleDownloadPdfAgain = () => {
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    generateInquiryPdf({
      inquiryRef: inquiryRef || 'EV-INQ-COPY',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      vehicleModel: formData.bike_model || 'Yadea T5 / Converted EV',
      message: formData.message,
      dateStr,
    });
  };

  const directWhatsAppUrl = getWhatsAppInquiryUrl(
    `*VOLTRIDER EV SRI LANKA - INQUIRY COPY (${inquiryRef})*\nName: ${formData.name}\nPhone: ${formData.phone}\nVehicle: ${formData.bike_model}\nMessage: ${formData.message}`
  );

  return (
    <section id="contact-advisor" className="py-12 sm:py-16 bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
          
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[11px] sm:text-xs font-semibold mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Direct Technician Consultation • 071 054 8278</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              Get an Instant EV Quote & PDF Specification
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Inquire about Yadea T5 batteries, FarDriver controller unlocks, Suzuki GN125 / Pulsar kits, or 3-Wheeler conversions. Your inquiry is compiled into a PDF and sent directly to <strong>{CONTACT_INFO.phone}</strong>.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-white">Inquiry & PDF Generated!</h4>
                <p className="text-xs font-mono text-cyan-300 mt-1">Ref: {inquiryRef}</p>
              </div>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Your official EV technical inquiry has been downloaded as a PDF and dispatched to our hotline (<strong>{CONTACT_INFO.phone}</strong>).
              </p>

              {/* Action Buttons for Mobile & Desktop */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send to WhatsApp ({CONTACT_INFO.phone})</span>
                </a>

                <button
                  onClick={handleDownloadPdfAgain}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Copy</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', bike_model: '', message: '' });
                  }}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Submit Another Inquiry &rarr;
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Perera"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 077 123 4567"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. kasun@gmail.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle / Model Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Yadea T5 / GN125 / Pulsar / Bajaj RE"
                    value={formData.bike_model}
                    onChange={e => setFormData({ ...formData, bike_model: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry / Conversion Requirements *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. I need a 72V 42Ah battery upgrade for my Yadea T5 scooter to get 100km range, or need a conversion kit for my GN125."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50 active:scale-98"
              >
                <FileText className="w-4 h-4" />
                <span>{loading ? 'Generating PDF & Preparing WhatsApp...' : 'Generate PDF & Send to WhatsApp (071 054 8278)'}</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </section>
  );
}
