export interface ClothingSubmission {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  zelleInfo: string;
  pickupAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  clothingDescription: string;
  clothingItems: string[];
  estimatedItems: number;
  status: 'pending' | 'scheduled' | 'picked_up' | 'processing' | 'listed' | 'sold';
  createdAt: string;
  updatedAt: string;
  scheduledPickupDate?: string;
  scheduledPickupTime?: string;
  adminNotes?: string;
  customerAvailability?: string[];
}

export interface CustomerAccount {
  email: string;
  customerName: string;
  phone: string;
  zelleInfo: string;
  defaultAddress: string;
  createdAt: string;
}

export type SubmissionStatus = ClothingSubmission['status'];

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending: 'Pending Review',
  scheduled: 'Pickup Scheduled',
  picked_up: 'Picked Up',
  processing: 'Processing',
  listed: 'Listed for Sale',
  sold: 'Sold',
};

export const STATUS_COLORS: Record<SubmissionStatus, string> = {
  pending: 'bg-amber-500',
  scheduled: 'bg-blue-500',
  picked_up: 'bg-purple-500',
  processing: 'bg-indigo-500',
  listed: 'bg-emerald-500',
  sold: 'bg-green-600',
};

// NYC area coordinates for geocoding fallback
export const NYC_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  'washington square': { lat: 40.7308, lng: -73.9973 },
  'nyu': { lat: 40.7295, lng: -73.9965 },
  'greenwich village': { lat: 40.7336, lng: -74.0027 },
  'east village': { lat: 40.7265, lng: -73.9815 },
  'soho': { lat: 40.7233, lng: -73.9961 },
  'tribeca': { lat: 40.7163, lng: -74.0086 },
  'lower east side': { lat: 40.7150, lng: -73.9843 },
  'chelsea': { lat: 40.7465, lng: -74.0014 },
  'midtown': { lat: 40.7549, lng: -73.9840 },
  'upper east side': { lat: 40.7736, lng: -73.9566 },
  'upper west side': { lat: 40.7870, lng: -73.9754 },
  'harlem': { lat: 40.8116, lng: -73.9465 },
  'brooklyn': { lat: 40.6782, lng: -73.9442 },
  'williamsburg': { lat: 40.7081, lng: -73.9571 },
  'manhattan': { lat: 40.7831, lng: -73.9712 },
  'new york': { lat: 40.7128, lng: -74.0060 },
};
