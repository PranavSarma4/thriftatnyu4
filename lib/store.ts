'use client';

import { ClothingSubmission, CustomerAccount, SubmissionStatus } from './types';

const API_BASE = '/api';

// Submissions
export async function getSubmissions(): Promise<ClothingSubmission[]> {
  try {
    const response = await fetch(`${API_BASE}/submissions`);
    if (!response.ok) throw new Error('Failed to fetch submissions');
    return response.json();
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
}

export async function getSubmissionById(id: string): Promise<ClothingSubmission | undefined> {
  try {
    const response = await fetch(`${API_BASE}/submissions/${id}`);
    if (!response.ok) return undefined;
    return response.json();
  } catch (error) {
    console.error('Error fetching submission:', error);
    return undefined;
  }
}

export async function getSubmissionsByEmail(email: string): Promise<ClothingSubmission[]> {
  try {
    const response = await fetch(`${API_BASE}/submissions?email=${encodeURIComponent(email)}`);
    if (!response.ok) throw new Error('Failed to fetch submissions');
    return response.json();
  } catch (error) {
    console.error('Error fetching submissions by email:', error);
    return [];
  }
}

export async function createSubmission(
  data: Omit<ClothingSubmission, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<ClothingSubmission> {
  const response = await fetch(`${API_BASE}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) throw new Error('Failed to create submission');
  return response.json();
}

export async function updateSubmission(
  id: string,
  updates: Partial<ClothingSubmission>
): Promise<ClothingSubmission | undefined> {
  try {
    const response = await fetch(`${API_BASE}/submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) return undefined;
    return response.json();
  } catch (error) {
    console.error('Error updating submission:', error);
    return undefined;
  }
}

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
  scheduledPickupDate?: string,
  scheduledPickupTime?: string,
  adminNotes?: string
): Promise<ClothingSubmission | undefined> {
  return updateSubmission(id, {
    status,
    scheduledPickupDate,
    scheduledPickupTime,
    adminNotes,
  });
}

export async function updateSubmissionCoordinates(
  id: string,
  lat: number,
  lng: number
): Promise<ClothingSubmission | undefined> {
  return updateSubmission(id, {
    pickupLat: lat,
    pickupLng: lng,
  });
}

export async function deleteSubmission(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/submissions/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting submission:', error);
    return false;
  }
}

export async function clearAllSubmissions(): Promise<void> {
  try {
    await fetch(`${API_BASE}/submissions`, { method: 'DELETE' });
  } catch (error) {
    console.error('Error clearing submissions:', error);
  }
}

// Customer Accounts
export async function getCustomerAccount(email: string): Promise<CustomerAccount | undefined> {
  try {
    const response = await fetch(`${API_BASE}/accounts/${encodeURIComponent(email)}`);
    if (!response.ok) return undefined;
    return response.json();
  } catch (error) {
    console.error('Error fetching customer account:', error);
    return undefined;
  }
}

export async function saveCustomerAccount(
  account: Omit<CustomerAccount, 'createdAt'>
): Promise<CustomerAccount> {
  const response = await fetch(`${API_BASE}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
  });
  
  if (!response.ok) throw new Error('Failed to save account');
  return response.json();
}

export async function getAllCustomerAccounts(): Promise<CustomerAccount[]> {
  try {
    const response = await fetch(`${API_BASE}/accounts`);
    if (!response.ok) throw new Error('Failed to fetch accounts');
    return response.json();
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return [];
  }
}

// Legacy sync function wrappers for backward compatibility during migration
// These can be used by components that haven't been updated to async yet
export function geocodeAddress(address: string): { lat: number; lng: number } | null {
  const NYC_LOCATIONS: Record<string, { lat: number; lng: number }> = {
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

  const lowerAddress = address.toLowerCase();
  
  for (const [keyword, coords] of Object.entries(NYC_LOCATIONS)) {
    if (lowerAddress.includes(keyword)) {
      return {
        lat: coords.lat + (Math.random() - 0.5) * 0.005,
        lng: coords.lng + (Math.random() - 0.5) * 0.005,
      };
    }
  }
  
  return {
    lat: 40.7295 + (Math.random() - 0.5) * 0.01,
    lng: -73.9965 + (Math.random() - 0.5) * 0.01,
  };
}
