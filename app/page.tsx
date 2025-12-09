'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { 
  ArrowRight, 
  Package, 
  Truck, 
  DollarSign, 
  Sparkles,
  CheckCircle,
  Leaf,
  Recycle,
  TrendingUp,
  ShieldCheck,
  Clock,
  Star
} from 'lucide-react';

const features = [
  {
    icon: Package,
    title: 'Easy Submission',
    description: 'Fill out a simple form with your clothing details and pickup location.',
  },
  {
    icon: Truck,
    title: 'Free Pickup',
    description: 'We come to you! No need to ship or drop off your items.',
  },
  {
    icon: Sparkles,
    title: 'Professional Care',
    description: 'We clean, photograph, and list your items on top marketplaces.',
  },
  {
    icon: DollarSign,
    title: 'Get Paid',
    description: 'Receive payment via Zelle when your items sell. Simple!',
  },
];

const stats = [
  { value: '2,500+', label: 'Items Resold' },
  { value: '$45K+', label: 'Paid to Sellers' },
  { value: '500+', label: 'Happy Customers' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const benefits = [
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    description: 'Reduce fashion waste and environmental impact',
  },
  {
    icon: Clock,
    title: 'Time-Saving',
    description: 'We handle everything from photos to shipping',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: 'Fast, secure payments directly to your Zelle',
  },
  {
    icon: TrendingUp,
    title: 'Best Prices',
    description: 'We maximize value with strategic pricing',
  },
];

const testimonials = [
  {
    name: 'Jessica M.',
    role: 'NYU Senior',
    content: 'Made $200 from clothes I was going to donate. The pickup was so convenient!',
    rating: 5,
  },
  {
    name: 'Alex K.',
    role: 'Grad Student',
    content: 'Love how easy the whole process is. They really take care of everything.',
    rating: 5,
  },
  {
    name: 'Taylor R.',
    role: 'NYU Junior',
    content: 'Sustainable and profitable! What more could you ask for?',
    rating: 5,
  },
];

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--accent)]/20 rounded-full blur-3xl float" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl float" style={{ animationDelay: '-3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[var(--accent)]/5 to-pink-500/5 rounded-full" />
        </div>
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div 
          style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 mb-8"
          >
            <Recycle className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm font-medium text-[var(--accent)]">Sustainable Fashion at NYU</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="block">Turn Your Closet</span>
            <span className="block gradient-text">Into Cash</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10"
          >
            We pick up your pre-loved clothes, handle everything, and pay you when they sell. 
            Zero hassle. Maximum sustainability.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/submit">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2 px-8 py-4 text-lg"
              >
                <span>Submit Your Clothes</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/track">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center gap-2 px-8 py-4 text-lg"
              >
                <span>Track Your Order</span>
              </motion.button>
            </Link>
          </motion.div>

        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-[var(--muted)]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
              Four simple steps to turn your unused clothes into cash
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Connector line */}
                {index < features.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/20" />
                )}
                
                <div className="relative bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)] card-hover">
                  {/* Step number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[var(--accent)] text-white font-bold flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-8 h-8 text-[var(--accent)]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-[var(--muted)]">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why Choose <span className="gradient-text">Thrift@NYU</span>?
              </h2>
              <p className="text-[var(--muted)] text-lg mb-8">
                We make reselling effortless while maximizing your earnings and minimizing environmental impact.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-[var(--accent)]" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{benefit.title}</h4>
                      <p className="text-sm text-[var(--muted)]">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Decorative card stack */}
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute -top-4 -left-4 w-full h-full bg-[var(--accent)]/20 rounded-3xl transform -rotate-3" />
                <div className="absolute -top-2 -left-2 w-full h-full bg-[var(--accent)]/30 rounded-3xl transform -rotate-1" />
                <div className="relative bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-3xl p-8 text-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <DollarSign className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Average Seller Earnings</p>
                      <p className="text-3xl font-bold">$127</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'Processing Time', value: '24-48 hours' },
                      { label: 'Commission Rate', value: 'Only 15%' },
                      { label: 'Pickup Available', value: 'All of NYC' },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-t border-white/10">
                        <span className="text-white/60">{item.label}</span>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Students</h2>
            <p className="text-[var(--muted)] text-lg">
              See what NYU students are saying about us
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)] card-hover"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-lg mb-6">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-pink-500" />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-[var(--muted)]">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] p-12 text-center text-white"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
            </div>
            
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Free Pickup • No Minimum Items</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Clear Your Closet?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Join hundreds of NYU students who have turned their unused clothes into cash while helping the planet.
              </p>
              
              <Link href="/submit">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[var(--accent-dark)] px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center gap-2 hover:bg-white/90 transition-colors"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
