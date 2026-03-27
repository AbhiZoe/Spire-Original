import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { Globe, MessageCircle, Users, Play } from "lucide-react";

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
  { icon: Globe, href: "#", label: "GitHub" },
  { icon: Users, href: "#", label: "LinkedIn" },
  { icon: Play, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-[#1B4332] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company info */}
          <div>
            <Link
              href="/"
              className="font-['Playfair_Display',serif] text-2xl font-bold"
            >
              {APP_NAME}
            </Link>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              Elevate your skills with expert-led courses. Learn at your own
              pace and build the career you deserve.
            </p>
            <div className="mt-6 flex gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Icon size={20} />
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
              <ul className="mt-4 space-y-3">
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

        <div className="mt-14 border-t border-white/10 pt-8 text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
