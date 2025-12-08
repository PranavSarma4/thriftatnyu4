'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  Tag,
  DollarSign,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { getSubmissionsByEmail } from '@/lib/store';
import { ClothingSubmission, STATUS_LABELS } from '@/lib/types';
import Link from 'next/link';

const statusSteps = [
  { status: 'pending', label: 'Submitted', icon: Package, description: 'Your submission is being reviewed' },
  { status: 'scheduled', label: 'Scheduled', icon: Calendar, description: 'Pickup has been scheduled' },
  { status: 'picked_up', label: 'Picked Up', icon: Truck, description: 'Items collected successfully' },
  { status: 'processing', label: 'Processing', icon: Clock, description: 'Items being prepared for sale' },
  { status: 'listed', label: 'Listed', icon: Tag, description: 'Items are now for sale' },
  { status: 'sold', label: 'Sold', icon: DollarSign, description: 'Congratulations! Payment incoming' },
];

function getStatusIndex(status: string): number {
  return statusSteps.findIndex(s => s.status === status);
}

function TrackContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [submissions, setSubmissions] = useState<ClothingSubmission[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ClothingSubmission | null>(null);

  const handleSearch = useCallback(async (searchEmail?: string) => {
    const emailToSearch = searchEmail || email;
    if (!emailToSearch) return;
    
    setIsLoading(true);
    try {
      const results = await getSubmissionsByEmail(emailToSearch);
      setSubmissions(results);
      setHasSearched(true);
      
      if (results.length > 0 && !selectedSubmission) {
        setSelectedSubmission(results[0]);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  }, [email, selectedSubmission]);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      handleSearch(emailParam);
    }
  }, [searchParams, handleSearch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 mb-6">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm font-medium text-[var(--accent)]">Real-Time Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Track Your <span className="gradient-text">Submission</span>
          </h1>
          <p className="text-[var(--muted)] text-lg">
            Enter your email to see the status of your clothing submissions
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter your email address"
                  className="input-field"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSearch()}
                disabled={isLoading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {hasSearched && submissions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
                <Package className="w-10 h-10 text-[var(--muted)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No submissions found</h3>
              <p className="text-[var(--muted)] mb-6">
                We couldn&apos;t find any submissions with that email address
              </p>
              <Link href="/submit">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <span>Submit Your Clothes</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
          )}

          {submissions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Submission tabs */}
              {submissions.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {submissions.map((submission, index) => (
                    <motion.button
                      key={submission.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedSubmission(submission)}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedSubmission?.id === submission.id
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]'
                      }`}
                    >
                      Submission #{index + 1}
                    </motion.button>
                  ))}
                </div>
              )}

              {selectedSubmission && (
                <div className="grid lg:grid-cols-5 gap-8">
                  {/* Status Timeline */}
                  <div className="lg:col-span-3">
                    <div className="bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)]">
                      <h3 className="text-xl font-bold mb-8">Order Status</h3>
                      
                      <div className="relative">
                        {/* Progress line */}
                        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[var(--border)]" />
                        <div 
                          className="absolute left-6 top-6 w-0.5 bg-[var(--accent)] transition-all duration-500"
                          style={{ 
                            height: `${(getStatusIndex(selectedSubmission.status) / (statusSteps.length - 1)) * 100}%` 
                          }}
                        />
                        
                        <div className="space-y-8">
                          {statusSteps.map((step, index) => {
                            const currentIndex = getStatusIndex(selectedSubmission.status);
                            const isCompleted = index <= currentIndex;
                            const isCurrent = index === currentIndex;
                            const Icon = step.icon;
                            
                            return (
                              <motion.div
                                key={step.status}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative flex gap-4"
                              >
                                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                  isCompleted 
                                    ? 'bg-[var(--accent)] text-white' 
                                    : 'bg-[var(--surface)] border-2 border-[var(--border)] text-[var(--muted)]'
                                } ${isCurrent ? 'ring-4 ring-[var(--accent)]/20' : ''}`}>
                                  {isCompleted && index < currentIndex ? (
                                    <CheckCircle className="w-5 h-5" />
                                  ) : (
                                    <Icon className="w-5 h-5" />
                                  )}
                                </div>
                                
                                <div className="flex-1 pt-2">
                                  <h4 className={`font-semibold ${isCompleted ? '' : 'text-[var(--muted)]'}`}>
                                    {step.label}
                                  </h4>
                                  <p className="text-sm text-[var(--muted)]">
                                    {step.description}
                                  </p>
                                  {isCurrent && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm"
                                    >
                                      <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                                      Current Status
                                    </motion.div>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Status Card */}
                    <div className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-2xl p-6 text-white">
                      <p className="text-white/60 text-sm mb-1">Current Status</p>
                      <p className="text-2xl font-bold mb-4">
                        {STATUS_LABELS[selectedSubmission.status]}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <Clock className="w-4 h-4" />
                        <span>Updated {formatDate(selectedSubmission.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Details Card */}
                    <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
                      <h4 className="font-semibold mb-4">Submission Details</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Package className="w-5 h-5 text-[var(--muted)] mt-0.5" />
                          <div>
                            <p className="text-sm text-[var(--muted)]">Items</p>
                            <p className="font-medium">{selectedSubmission.estimatedItems} items</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedSubmission.clothingItems.slice(0, 3).map((item, i) => (
                                <span key={i} className="text-xs px-2 py-0.5 bg-[var(--surface-elevated)] rounded-full">
                                  {item}
                                </span>
                              ))}
                              {selectedSubmission.clothingItems.length > 3 && (
                                <span className="text-xs px-2 py-0.5 bg-[var(--surface-elevated)] rounded-full">
                                  +{selectedSubmission.clothingItems.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-[var(--muted)] mt-0.5" />
                          <div>
                            <p className="text-sm text-[var(--muted)]">Pickup Address</p>
                            <p className="font-medium">{selectedSubmission.pickupAddress}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-[var(--muted)] mt-0.5" />
                          <div>
                            <p className="text-sm text-[var(--muted)]">Submitted On</p>
                            <p className="font-medium">{formatDate(selectedSubmission.createdAt)}</p>
                          </div>
                        </div>
                        
                        {selectedSubmission.scheduledPickupDate && (
                          <div className="flex items-start gap-3 p-3 bg-blue-500/5 rounded-xl border border-blue-500/20">
                            <Truck className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-blue-500 font-medium">Scheduled Pickup</p>
                              <p className="font-bold text-lg">
                                {formatDate(selectedSubmission.scheduledPickupDate)}
                                {selectedSubmission.scheduledPickupTime && (
                                  <span className="text-blue-600"> at {selectedSubmission.scheduledPickupTime}</span>
                                )}
                              </p>
                              <p className="text-xs text-[var(--muted)] mt-1">
                                Please have your items ready for pickup
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tracking ID */}
                    <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]">
                      <p className="text-sm text-[var(--muted)] mb-1">Tracking ID</p>
                      <p className="font-mono text-lg font-bold text-[var(--accent)]">
                        {selectedSubmission.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help section */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)] text-center"
          >
            <h3 className="text-xl font-bold mb-4">Need Help?</h3>
            <p className="text-[var(--muted)] mb-6">
              If you can&apos;t find your submission or have questions, feel free to contact us.
            </p>
            <a href="mailto:hello@thriftatnyu.com" className="text-[var(--accent)] font-medium hover:underline">
              hello@thriftatnyu.com
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
