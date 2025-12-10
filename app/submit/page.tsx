'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  MapPin, 
  User, 
  Shirt,
  Plus,
  X,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Calendar,
  UserCheck,
  UserPlus,
  Mail,
  Camera,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { createSubmission, getCustomerAccount, saveCustomerAccount, getSubmissionsByEmail } from '@/lib/store';
import Link from 'next/link';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';

const libraries: Libraries = ['places'];

const clothingCategories = [
  'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 
  'Accessories', 'Activewear', 'Formal Wear', 'Vintage', 'Designer'
];

const availabilityOptions = [
  'Weekday Mornings (9am - 12pm)',
  'Weekday Afternoons (12pm - 5pm)',
  'Weekday Evenings (5pm - 8pm)',
  'Weekend Mornings (9am - 12pm)',
  'Weekend Afternoons (12pm - 5pm)',
  'Flexible / Anytime'
];

interface FormData {
  customerName: string;
  email: string;
  phone: string;
  zelleInfo: string;
  zelleType: 'email' | 'phone' | '';
  pickupAddress: string;
  pickupAvailability: string[];
  preferredDate: string;
  clothingDescription: string;
  clothingItems: string[];
  estimatedItems: number;
  saveAccount: boolean;
  images: string[]; // Base64 encoded images
}

const initialFormData: FormData = {
  customerName: '',
  email: '',
  phone: '',
  zelleInfo: '',
  zelleType: '',
  pickupAddress: '',
  pickupAvailability: [],
  preferredDate: '',
  clothingDescription: '',
  clothingItems: [],
  estimatedItems: 5,
  saveAccount: true,
  images: [],
};

// Email validation function
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function SubmitPage() {
  const [step, setStep] = useState(0); // 0 = choose new/returning, 1-3 = form steps
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [newItem, setNewItem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [isReturningCustomer, setIsReturningCustomer] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [existingSubmissions, setExistingSubmissions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 3;

  // Load Google Maps API for Places Autocomplete
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // Initialize Google Places Autocomplete
  const initAutocomplete = useCallback(() => {
    if (isLoaded && addressInputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          updateFormData('pickupAddress', place.formatted_address);
        }
      });
    }
  }, [isLoaded]);

  useEffect(() => {
    if (step === 2) {
      initAutocomplete();
    }
  }, [step, initAutocomplete]);

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('Files selected:', files?.length);
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      console.log('Processing file:', file.name, file.size);
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        console.log('Image loaded, base64 length:', base64?.length);
        setFormData(prev => {
          const newImages = [...prev.images, base64].slice(0, 5);
          console.log('Updated images count:', newImages.length);
          return {
            ...prev,
            images: newImages,
          };
        });
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const updateFormData = (field: keyof FormData, value: string | number | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReturningCustomerLogin = async () => {
    if (!loginEmail) {
      setLoginError('Please enter your email');
      return;
    }
    
    if (!isValidEmail(loginEmail)) {
      setLoginError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    try {
      const account = await getCustomerAccount(loginEmail);
      if (account) {
        // Determine zelleType based on saved zelleInfo
        const zelleType: 'email' | 'phone' = account.zelleInfo === account.email ? 'email' : 'phone';
        
        setFormData(prev => ({
          ...prev,
          customerName: account.customerName,
          email: account.email,
          phone: account.phone,
          zelleInfo: account.zelleInfo,
          zelleType: zelleType,
          pickupAddress: account.defaultAddress,
          saveAccount: true,
        }));
        const submissions = await getSubmissionsByEmail(loginEmail);
        setExistingSubmissions(submissions.length);
        setIsReturningCustomer(true);
        setStep(2); // Skip to pickup details since we have their info
        setLoginError('');
      } else {
        setLoginError('No account found with this email. Please submit as a new customer.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAvailability = (option: string) => {
    if (formData.pickupAvailability.includes(option)) {
      updateFormData('pickupAvailability', formData.pickupAvailability.filter(o => o !== option));
    } else {
      updateFormData('pickupAvailability', [...formData.pickupAvailability, option]);
    }
  };

  const addClothingItem = () => {
    if (newItem.trim() && !formData.clothingItems.includes(newItem.trim())) {
      updateFormData('clothingItems', [...formData.clothingItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeClothingItem = (item: string) => {
    updateFormData('clothingItems', formData.clothingItems.filter(i => i !== item));
  };

  const toggleCategory = (category: string) => {
    if (formData.clothingItems.includes(category)) {
      removeClothingItem(category);
    } else {
      updateFormData('clothingItems', [...formData.clothingItems, category]);
    }
  };

  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address (e.g., name@example.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return formData.customerName && 
               formData.email && 
               isValidEmail(formData.email) && 
               formData.phone && 
               formData.zelleType;
      case 2:
        return formData.pickupAddress && formData.pickupAvailability.length > 0;
      case 3:
        return formData.clothingItems.length > 0 || formData.clothingDescription;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    
    setIsSubmitting(true);
    
    // Determine Zelle info based on selection
    const zelleInfo = formData.zelleType === 'email' ? formData.email : formData.phone;
    
    try {
      // Save customer account for future use if opted in
      if (formData.saveAccount) {
        await saveCustomerAccount({
          email: formData.email,
          customerName: formData.customerName,
          phone: formData.phone,
          zelleInfo: zelleInfo,
          defaultAddress: formData.pickupAddress,
        });
      }
      
      const submission = await createSubmission({
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        zelleInfo: zelleInfo,
        pickupAddress: formData.pickupAddress,
        clothingDescription: `Availability: ${formData.pickupAvailability.join(', ')}${formData.preferredDate ? ` | Preferred Date: ${formData.preferredDate}` : ''}${formData.clothingDescription ? ` | Notes: ${formData.clothingDescription}` : ''}`,
        clothingItems: formData.clothingItems,
        clothingImages: formData.images,
        estimatedItems: formData.estimatedItems,
        customerAvailability: formData.pickupAvailability,
      });
      
      setSubmissionId(submission.id);
      setIsComplete(true);
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (step === 1 || (step === 2 && isReturningCustomer)) {
      setStep(0);
      setIsReturningCustomer(false);
    }
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (isComplete) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-500/10 flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-4">Submission Received!</h1>
          <p className="text-[var(--muted)] text-lg mb-8">
            Thank you for submitting your clothes. We&apos;ll review your submission and contact you shortly to schedule a pickup.
          </p>
          
          <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)] mb-8">
            <p className="text-sm text-[var(--muted)] mb-2">Your Tracking ID</p>
            <p className="text-2xl font-mono font-bold text-[var(--accent)]">
              {submissionId.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-sm text-[var(--muted)] mt-4">
              Save this ID to track your submission status
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/track?email=${encodeURIComponent(formData.email)}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2"
              >
                <span>Track Your Submission</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
              >
                Back to Home
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 mb-6">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm font-medium text-[var(--accent)]">Free Pickup Service</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Submit Your <span className="gradient-text">Clothes</span>
          </h1>
          <p className="text-[var(--muted)] text-lg">
            Fill out the form below and we&apos;ll handle the rest
          </p>
        </motion.div>

        {/* Progress bar - only show after step 0 */}
        {step > 0 && (
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex items-center gap-2 ${s <= step ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    s < step 
                      ? 'bg-[var(--accent)] text-white' 
                      : s === step 
                      ? 'bg-[var(--accent)]/10 border-2 border-[var(--accent)]' 
                      : 'bg-[var(--surface)] border border-[var(--border)]'
                  }`}>
                    {s < step ? <CheckCircle className="w-4 h-4" /> : s}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {s === 1 ? 'Your Info' : s === 2 ? 'Pickup Details' : 'Clothing'}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] rounded-full"
              />
            </div>
          </div>
        )}

        {/* Form */}
        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          <AnimatePresence mode="wait">
            {/* Step 0: New or Returning Customer */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* New Customer */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(1)}
                    className="bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)] text-left hover:border-[var(--accent)] transition-all group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--accent)]/20 transition-colors">
                      <UserPlus className="w-7 h-7 text-[var(--accent)]" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">New Customer</h3>
                    <p className="text-[var(--muted)] text-sm">
                      First time submitting? We&apos;ll get your details set up.
                    </p>
                  </motion.button>
                  
                  {/* Returning Customer */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)] hover:border-[var(--accent)] transition-all"
                  >
                    <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                      <UserCheck className="w-7 h-7 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Returning Customer</h3>
                    <p className="text-[var(--muted)] text-sm mb-4">
                      Already submitted before? Enter your email to pre-fill your info.
                    </p>
                    
                    <div className="space-y-3">
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          setLoginError('');
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleReturningCustomerLogin())}
                        placeholder="Enter your email"
                        className="input-field text-sm"
                      />
                      {loginError && (
                        <p className="text-red-500 text-xs">{loginError}</p>
                      )}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleReturningCustomerLogin}
                        disabled={isLoading}
                        className="btn-primary w-full text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Mail className="w-4 h-4" />
                            Continue
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)]">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    Personal Information
                  </h2>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => updateFormData('customerName', e.target.value)}
                        placeholder="John Doe"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          updateFormData('email', e.target.value);
                          if (e.target.value) validateEmail(e.target.value);
                        }}
                        onBlur={(e) => validateEmail(e.target.value)}
                        placeholder="john@nyu.edu"
                        className={`input-field ${emailError ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                      {emailError && (
                        <p className="text-red-500 text-sm mt-1">{emailError}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        placeholder="(212) 555-0123"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-3">Zelle Payment Method</label>
                      <p className="text-sm text-[var(--muted)] mb-3">
                        Which would you like to use for Zelle payments?
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateFormData('zelleType', 'email')}
                          className={`flex-1 p-4 rounded-xl border-2 text-left transition-all ${
                            formData.zelleType === 'email'
                              ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                              : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.zelleType === 'email' ? 'border-[var(--accent)]' : 'border-[var(--muted)]'
                            }`}>
                              {formData.zelleType === 'email' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">Use my email</p>
                              <p className="text-sm text-[var(--muted)]">{formData.email || 'Enter email above'}</p>
                            </div>
                          </div>
                        </motion.button>
                        
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateFormData('zelleType', 'phone')}
                          className={`flex-1 p-4 rounded-xl border-2 text-left transition-all ${
                            formData.zelleType === 'phone'
                              ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                              : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.zelleType === 'phone' ? 'border-[var(--accent)]' : 'border-[var(--muted)]'
                            }`}>
                              {formData.zelleType === 'phone' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">Use my phone</p>
                              <p className="text-sm text-[var(--muted)]">{formData.phone || 'Enter phone above'}</p>
                            </div>
                          </div>
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Save Account Option */}
                    <div className="pt-4 border-t border-[var(--border)]">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateFormData('saveAccount', !formData.saveAccount)}
                        className="flex items-start gap-3 w-full text-left"
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          formData.saveAccount 
                            ? 'border-[var(--accent)] bg-[var(--accent)]' 
                            : 'border-[var(--muted)]'
                        }`}>
                          {formData.saveAccount && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Create an account for faster submissions</p>
                          <p className="text-sm text-[var(--muted)]">
                            Save your info so you can submit again quickly next time
                          </p>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Pickup Location & Availability */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Welcome back message for returning customers */}
                {isReturningCustomer && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/10 rounded-xl p-4 border border-green-500/20"
                  >
                    <p className="text-green-600 font-medium">
                      👋 Welcome back, {formData.customerName}!
                    </p>
                    <p className="text-sm text-green-600/80 mt-1">
                      You have {existingSubmissions} previous submission{existingSubmissions !== 1 ? 's' : ''}.
                      Your info has been pre-filled.
                    </p>
                  </motion.div>
                )}
                
                <div className="bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)]">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    Pickup Details
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Address</label>
                      <input
                        ref={addressInputRef}
                        type="text"
                        value={formData.pickupAddress}
                        onChange={(e) => updateFormData('pickupAddress', e.target.value)}
                        placeholder="Start typing your address..."
                        className="input-field"
                      />
                      <p className="text-sm text-[var(--muted)] mt-2">
                        {isLoaded ? '📍 Start typing to see address suggestions' : 'Enter your full address including apartment/unit number'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[var(--accent)]" />
                        When are you available for pickup?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {availabilityOptions.map((option) => (
                          <motion.button
                            key={option}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleAvailability(option)}
                            className={`p-3 rounded-xl text-sm font-medium text-left transition-all ${
                              formData.pickupAvailability.includes(option)
                                ? 'bg-[var(--accent)] text-white'
                                : 'bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--accent)]'
                            }`}
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                      <p className="text-sm text-[var(--muted)] mt-2">
                        Select all times that work for you
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred Pickup Date (Optional)</label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => updateFormData('preferredDate', e.target.value)}
                        min={getMinDate()}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-[var(--accent)]/5 rounded-xl border border-[var(--accent)]/10">
                    <p className="text-sm font-medium text-[var(--accent)] mb-2">📍 Pickup Info</p>
                    <ul className="text-sm text-[var(--muted)] space-y-1">
                      <li>• Pickups available 7 days a week</li>
                      <li>• We&apos;ll confirm your pickup time via text</li>
                      <li>• Have items ready in bags or boxes</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Clothing Details */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)]">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                      <Shirt className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    Clothing Details
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Categories */}
                    <div>
                      <label className="block text-sm font-medium mb-3">Categories (select all that apply)</label>
                      <div className="flex flex-wrap gap-2">
                        {clothingCategories.map((category) => (
                          <motion.button
                            key={category}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              formData.clothingItems.includes(category)
                                ? 'bg-[var(--accent)] text-white'
                                : 'bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--accent)]'
                            }`}
                          >
                            {category}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Custom items */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Add Specific Items</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newItem}
                          onChange={(e) => setNewItem(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addClothingItem())}
                          placeholder="e.g., Vintage Levi's Jacket"
                          className="input-field flex-1"
                        />
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addClothingItem}
                          className="btn-primary px-4"
                        >
                          <Plus className="w-5 h-5" />
                        </motion.button>
                      </div>
                      
                      {formData.clothingItems.filter(item => !clothingCategories.includes(item)).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.clothingItems
                            .filter(item => !clothingCategories.includes(item))
                            .map((item) => (
                              <span
                                key={item}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm"
                              >
                                {item}
                                <button
                                  type="button"
                                  onClick={() => removeClothingItem(item)}
                                  className="hover:text-red-500"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Estimated items */}
                    <div>
                      <label className="block text-sm font-medium mb-4">
                        Estimated Number of Items: <span className="text-[var(--accent)] font-bold">{formData.estimatedItems}</span>
                      </label>
                      <div className="relative">
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 left-0 h-2 rounded-full bg-[var(--accent)]"
                          style={{ width: `${((formData.estimatedItems - 1) / 49) * 100}%` }}
                        />
                        <input
                          type="range"
                          min="1"
                          max="50"
                          value={formData.estimatedItems}
                          onChange={(e) => updateFormData('estimatedItems', parseInt(e.target.value))}
                          className="range-slider relative z-10"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
                        <span>1 item</span>
                        <span>50+ items</span>
                      </div>
                    </div>
                    
                    {/* Photo upload */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-[var(--accent)]" />
                        Upload Photos (optional)
                      </label>
                      <p className="text-sm text-[var(--muted)] mb-3">
                        Add up to 5 photos of your items to help us give you a better estimate
                      </p>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {/* Uploaded images */}
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border)] group">
                            <img 
                              src={image} 
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        
                        {/* Upload button */}
                        {formData.images.length < 5 && (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              console.log('Upload button clicked');
                              fileInputRef.current?.click();
                            }}
                            className="aspect-square rounded-xl border-2 border-dashed border-[var(--accent)]/50 hover:border-[var(--accent)] bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 flex flex-col items-center justify-center gap-2 text-[var(--accent)] transition-all cursor-pointer"
                          >
                            <Upload className="w-6 h-6" />
                            <span className="text-xs font-medium">Add Photo</span>
                          </motion.button>
                        )}
                      </div>
                      
                      {formData.images.length > 0 && (
                        <p className="text-xs text-[var(--muted)] mt-2">
                          {formData.images.length}/5 photos added
                        </p>
                      )}
                    </div>
                    
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Additional Notes (optional)</label>
                      <textarea
                        value={formData.clothingDescription}
                        onChange={(e) => updateFormData('clothingDescription', e.target.value)}
                        placeholder="Tell us more about your items, brands, conditions, special instructions, etc."
                        rows={4}
                        className="input-field resize-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          {step > 0 && (
            <div className="flex justify-between mt-8">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : step === totalSteps ? (
                  <>
                    <span>Submit</span>
                    <Package className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
