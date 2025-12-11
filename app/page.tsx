'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, 
  Package, 
  Truck, 
  DollarSign, 
  Sparkles,
  CheckCircle,
  Star
} from 'lucide-react';

const features = [
  {
    icon: Package,
    title: 'Submit',
    description: 'Fill out a form with your clothing details.',
  },
  {
    icon: Truck,
    title: 'Pickup',
    description: 'We come to you. Free.',
  },
  {
    icon: Sparkles,
    title: 'We Sell',
    description: 'We photograph and list your items.',
  },
  {
    icon: DollarSign,
    title: 'Get Paid',
    description: 'Zelle payment when items sell.',
  },
];

const stats = [
  { value: '2,500+', label: 'Items Resold' },
  { value: '$45K+', label: 'Paid Out' },
  { value: '500+', label: 'Customers' },
  { value: '98%', label: 'Satisfaction' },
];

const testimonials = [
  {
    name: 'Jessica M.',
    role: 'NYU Senior',
    content: 'Made $200 from clothes I was going to donate.',
    rating: 5,
  },
  {
    name: 'Alex K.',
    role: 'Grad Student',
    content: 'So easy. They handle everything.',
    rating: 5,
  },
  {
    name: 'Taylor R.',
    role: 'NYU Junior',
    content: 'Sustainable and profitable.',
    rating: 5,
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 leading-[0.85]"
          >
            TURN YOUR
            <br />
            <span className="gradient-text">CLOSET</span>
            <br />
            INTO CASH
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-[var(--muted)] max-w-xl mx-auto mb-12"
          >
            We pick up your clothes. We sell them. You get paid.
            <br />
            Zero effort. Maximum sustainability.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/submit">
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary inline-flex items-center gap-3"
              >
                <span>SUBMIT CLOTHES</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/track">
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary inline-flex items-center gap-3"
              >
                <span>TRACK ORDER</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y-2 border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-1">
                  {stat.value}
                </div>
                <div className="text-sm uppercase tracking-wider text-[var(--muted)]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4">HOW IT WORKS</h2>
            <p className="text-[var(--muted)] text-lg">
              Four steps. That&apos;s it.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-[var(--surface)] p-10 border-2 border-[var(--border)] card-hover h-full">
                  <div className="text-6xl font-bold text-[var(--muted)] mb-6">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="w-12 h-12 bg-[var(--foreground)] flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-[var(--background)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 uppercase">{feature.title}</h3>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Card */}
      <section className="py-32 bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 uppercase">
                Why <span className="gradient-text">Thrift@NYU</span>?
              </h2>
              <ul className="space-y-4 text-lg">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Free pickup anywhere in NYC</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Only 15% commission</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Fast Zelle payments</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Sustainable fashion</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[var(--foreground)] text-[var(--background)] p-10"
            >
              <div className="text-sm uppercase tracking-wider mb-3 opacity-60">
                Average Seller Earnings
              </div>
              <div className="text-7xl font-bold mb-8">$127</div>
              
              <div className="space-y-5 text-sm">
                <div className="flex justify-between border-t border-[var(--background)]/20 pt-5">
                  <span className="opacity-60">Processing Time</span>
                  <span className="font-bold">24-48 hours</span>
                </div>
                <div className="flex justify-between border-t border-[var(--background)]/20 pt-5">
                  <span className="opacity-60">Commission</span>
                  <span className="font-bold">Only 15%</span>
                </div>
                <div className="flex justify-between border-t border-[var(--background)]/20 pt-5">
                  <span className="opacity-60">Pickup Area</span>
                  <span className="font-bold">All of NYC</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4">REVIEWS</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[var(--surface)] p-10 border-2 border-[var(--border)] card-hover"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-8 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-[var(--muted)] mt-1">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[var(--foreground)] text-[var(--background)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 uppercase">
              Ready?
            </h2>
            <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto">
              Clear your closet. Get paid. Help the planet.
            </p>
            
            <Link href="/submit">
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[var(--background)] text-[var(--foreground)] px-8 py-4 font-bold text-sm uppercase tracking-wider inline-flex items-center gap-3 hover:opacity-90 transition-opacity"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
