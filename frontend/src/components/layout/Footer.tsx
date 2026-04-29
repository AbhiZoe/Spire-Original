import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { Globe, Mail, Phone, MessageCircle, Users, Play } from "lucide-react";

const columns = [
  {
    title: "Courses",
    links: [
      { label: "Web Development", href: "/categories/web-development" },
      { label: "Data Science", href: "/categories/data-science" },
      { label: "Mobile Development", href: "/categories/mobile" },
      { label: "Design", href: "/categories/design" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Webinars", href: "/webinars" },
      { label: "Documentation", href: "/docs" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/support" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Refund Policy", href: "/refund" },
    ],
  },
];

const socials = [
  { icon: MessageCircle, href: "#", label: "Twitter" },
  { icon: Globe, href: "#", label: "Website" },
  { icon: Users, href: "#", label: "LinkedIn" },
  { icon: Play, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-[#0E6B6B] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {/* Company info */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link
              href="/"
              className="font-serif text-2xl font-bold"
            >
              {APP_NAME}
            </Link>
            <p className="mt-3 text-sm text-white/70 leading-relaxed max-w-xs">
              Empowering learners worldwide
            </p>
            <div className="mt-4 flex items-center gap-3 text-sm text-white/60">
              <Mail size={14} />
              <span>hello@spire.dev</span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm text-white/60">
              <Phone size={14} />
              <span>+91 98765 43210</span>
            </div>
            <div className="mt-5 flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/50">
          &copy; 2026 Spire. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
