import { ArrowRight, Mail, UserRound } from "lucide-react";

import { Input } from "@/components/ui/input";

type ContactFormFieldProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
};

function ContactFormField({ label, required = false, children }: ContactFormFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-text-strong">
        {label}
        {required ? " *" : ""}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export default function ContactFormSection() {
  return (
    <section className="bg-fill-weak">
      <div className="mx-auto max-w-470 px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-12.5 lg:py-22 2xl:py-25">
        <div className="mx-auto max-w-350 rounded-md border border-line-weaker bg-fill-weak px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8 lg:py-8">
          <form className="space-y-5" action="#" method="post">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              <ContactFormField label="Name" required>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-weak">
                    <UserRound size={14} />
                  </span>
                  <Input
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    className="h-11 bg-surface-muted-100 pl-9"
                  />
                </div>
              </ContactFormField>

              <ContactFormField label="Email" required>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-weak">
                    <Mail size={14} />
                  </span>
                  <Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    className="h-11 bg-surface-muted-100 pl-9"
                  />
                </div>
              </ContactFormField>
            </div>

            <ContactFormField label="Subject">
              <Input name="subject" placeholder="How can we help?" className="h-11 bg-surface-muted-100" />
            </ContactFormField>

            <ContactFormField label="Message" required>
              <textarea
                name="message"
                rows={4}
                placeholder="Tell us more about your inquiry..."
                className="w-full rounded-md border border-line-weaker bg-surface-muted-100 px-3 py-3 text-sm text-text-strong placeholder:text-text-disable outline-none focus-visible:ring-2 focus-visible:ring-brand-default/30"
              />
            </ContactFormField>

            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-brand-default px-5 text-sm font-medium text-text-inverse-strong transition-colors hover:bg-brand-hover"
            >
              Send Message
              <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
