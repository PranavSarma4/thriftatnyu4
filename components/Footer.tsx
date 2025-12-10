'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shirt, Instagram, Twitter, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[var(--surface)] border-t border-[var(--border)]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--accent)]/5 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] flex items-center justify-center">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Thrift<span className="gradient-text">@NYU</span>
              </span>
            </Link>
            <p className="text-[var(--muted)] max-w-md mb-6">
              The sustainable way to refresh your wardrobe. We pick up your pre-loved clothes 
              and give them a new life, putting money back in your pocket.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Mail].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/submit', label: 'Submit Clothes' },
                { href: '/track', label: 'Track Order' },
                { href: '/#how-it-works', label: 'How It Works' },
                { href: '/#faq', label: 'FAQ' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-[var(--muted)]">
              <li>NYU Campus</li>
              <li>New York, NY 10003</li>
              <li>
                <a href="mailto:hello@thriftatnyu.com" className="hover:text-[var(--accent)] transition-colors">
                  hello@thriftatnyu.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)]">
            © {new Date().getFullYear()} Thrift@NYU. All rights reserved.
          </p>
          <p className="text-sm text-[var(--muted)] flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for sustainability
          </p>
        </div>
      </div>
    </footer>
  );
}



