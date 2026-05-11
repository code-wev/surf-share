"use client";

import { ArrowRight, Mail, User, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { sendContactMessage } from "@/src/actions/contact.action";

export default function ContactContent() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await sendContactMessage(form);
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending contact message:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-480 px-10 py-10 lg:px-65 lg:py-25">
      <div className="rounded-lg border border-(--color-line-weak) bg-white p-8">
        {/* Row 1: Name + Email */}
        <div className="mb-6 flex flex-col gap-6 sm:flex-row">
          {/* Name */}
          <div className="flex-1">
            <label className="mb-1.5 block text-base font-medium text-(--color-text-strong)">
              Name <span className="text-gray-800">*</span>
            </label>
            <div className="flex items-center rounded-md border border-(--color-line-weak) px-3 py-2.5">
              <User className="mr-2 h-4 w-4 shrink-0 text-(--color-text-weak)" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full bg-transparent text-sm text-(--color-text-strong) outline-none placeholder:text-(--color-text-weak)"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex-1">
            <label className="mb-1.5 block text-base font-medium text-(--color-text-strong)">
              Email <span className="text-gray-800">*</span>
            </label>
            <div className="flex items-center rounded-md border border-(--color-line-weak) px-3 py-2.5">
              <Mail className="mr-2 h-4 w-4 shrink-0 text-(--color-text-weak)" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full bg-transparent text-sm text-(--color-text-strong) outline-none placeholder:text-(--color-text-weak)"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Subject */}
        <div className="mb-6">
          <label className="mb-1.5 block text-base font-medium text-(--color-text-strong)">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="How can we help?"
            className="w-full rounded-md border border-(--color-line-weak) px-3 py-2.5 text-sm text-(--color-text-strong) outline-none placeholder:text-(--color-text-weak)"
          />
        </div>

        {/* Row 3: Message */}
        <div className="mb-8">
          <label className="mb-1.5 block text-base font-medium text-(--color-text-strong)">
            Message <span className="text-gray-800">*</span>
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us more about your enquiry..."
            rows={4}
            className="w-full resize-none rounded-md border border-(--color-line-weak) px-3 py-2.5 text-sm text-(--color-text-strong) outline-none placeholder:text-(--color-text-weak)"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-(--color-text-brand-strong) px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Send Message
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </section>
  );
}
