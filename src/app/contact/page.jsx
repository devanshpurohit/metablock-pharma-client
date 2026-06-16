"use client";

import { useState } from "react";
import { Send, PhoneCall, MessageCircle, Navigation, CheckCircle } from "lucide-react";
import api from "@/utils/api";
import CustomerReviews from "@/components/Review";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setFileName(selected.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !title || !message) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("title", title);
      formData.append("message", message);
      if (file) {
        formData.append("attachment", file);
      }

      await api.post("/messages", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setSubmitted(true);
      setName("");
      setEmail("");
      setTitle("");
      setMessage("");
      setFile(null);
      setFileName("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Breadcrumb */}
      <div className="px-6 py-3 text-sm text-gray-500 flex items-center gap-1.5 border-b border-gray-100 bg-white">
        <a href="/" className="hover:text-primary">Home</a>
        <span>›</span>
        <span className="text-gray-700">Contact Us</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* ── LEFT COLUMN: CONTACT CHANNELS ── */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            
            {/* Social channels */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* WhatsApp Card */}
              <a 
                href="https://wa.me/48453395714" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors border-b border-gray-100"
              >
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                  <MessageCircle size={24} className="fill-[#25D366]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">WhatsApp</h4>
                  <p className="text-xs text-gray-500 mt-0.5">WhatsApp: +48 453 395 714</p>
                </div>
              </a>

              {/* Telegram Channel Card */}
              <a 
                href="https://t.me/roidspharma_channel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors border-b border-gray-100"
              >
                <div className="w-12 h-12 rounded-full bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc]">
                  <Send size={20} className="fill-[#0088cc] -translate-x-0.5 translate-y-0.5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Telegram Channel</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Join our announcements channel</p>
                </div>
              </a>

              {/* Telegram Chat Card */}
              <a 
                href="https://t.me/roidspharma_chat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc]">
                  <MessageCircle size={22} className="fill-[#0088cc]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Telegram Chat</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Chat directly with support representatives</p>
                </div>
              </a>
            </div>

            {/* Address info */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Navigation size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-800 text-sm uppercase mb-1">ANABOLIC BEATZ LIMITED</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    46 Cambridge Road, Thornaby, Stockton-On-Tees,<br />
                    England, TS17 6LR
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: CONTACT FORM ── */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">Contact Form</h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle size={56} className="text-green-500 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Message Submitted Successfully</h3>
                <p className="text-sm text-gray-500 max-w-sm mb-6">
                  Thank you for contacting us. Your message has been routed to our admin support team. We will get back to you shortly via email!
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-primary hover:bg-secondary text-white font-bold text-xs rounded transition-colors uppercase tracking-wider shadow-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded font-semibold">
                    {error}
                  </div>
                )}

                {/* Name */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="w-full md:w-1/4 text-xs font-black text-gray-700 uppercase">Your name *</label>
                  <input 
                    type="text" 
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="flex-1 bg-gray-50 border border-gray-200 rounded px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="w-full md:w-1/4 text-xs font-black text-gray-700 uppercase">Your email address *</label>
                  <input 
                    type="email" 
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-gray-50 border border-gray-200 rounded px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>

                {/* Title */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="w-full md:w-1/4 text-xs font-black text-gray-700 uppercase">Title *</label>
                  <input 
                    type="text" 
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="flex-1 bg-gray-50 border border-gray-200 rounded px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col md:flex-row md:items-start gap-2">
                  <label className="w-full md:w-1/4 text-xs font-black text-gray-700 uppercase pt-2">Message *</label>
                  <textarea 
                    rows="6"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="flex-1 bg-gray-50 border border-gray-200 rounded px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white transition-colors resize-none"
                  />
                </div>

                {/* File Upload */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="w-full md:w-1/4 text-xs font-black text-gray-700 uppercase">Upload</label>
                  <div className="flex-1 flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-secondary font-bold text-xs rounded transition-colors cursor-pointer shadow-sm uppercase tracking-wider">
                      <Send size={12} className="rotate-45" />
                      Upload File
                      <input 
                        type="file" 
                        onChange={handleFileChange}
                        className="hidden" 
                        accept="image/*,application/pdf"
                      />
                    </label>
                    <span className="text-xs text-gray-500 font-semibold truncate max-w-xs">
                      {fileName || "No file selected"}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-4">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="px-8 py-3 bg-primary hover:bg-secondary disabled:opacity-50 text-white font-bold text-xs rounded shadow-md transition-colors uppercase tracking-widest"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>

      <CustomerReviews />
    </div>
  );
}
