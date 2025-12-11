'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t-2 border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="block mb-4">
              <span className="text-xl font-bold uppercase tracking-tight">
                THRIFT<span className="gradient-text">@NYU</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--muted)]">
              Sustainable fashion. Zero effort.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Links</h4>
            <ul className="space-y-2">
              {[
                { href: '/submit', label: 'Submit' },
                { href: '/track', label: 'Track' },
                { href: '/admin', label: 'Admin' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors uppercase tracking-wider"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li>NYU Campus</li>
              <li>New York, NY</li>
              <li>
                <a href="mailto:hello@thriftatnyu.com" className="hover:text-[var(--foreground)] transition-colors">
                  hello@thriftatnyu.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-12 pt-8 border-t-2 border-[var(--border)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wider">
            © {new Date().getFullYear()} THRIFT@NYU
          </p>
        </div>
      </div>
    </footer>
  );
}
