import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { SubmissionStatus } from '@prisma/client';

// NYC area coordinates for geocoding fallback
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

function geocodeAddress(address: string): { lat: number; lng: number } {
  const lowerAddress = address.toLowerCase();
  
  for (const [keyword, coords] of Object.entries(NYC_LOCATIONS)) {
    if (lowerAddress.includes(keyword)) {
      return {
        lat: coords.lat + (Math.random() - 0.5) * 0.005,
        lng: coords.lng + (Math.random() - 0.5) * 0.005,
      };
    }
  }
  
  // Default to NYU area with random offset
  return {
    lat: 40.7295 + (Math.random() - 0.5) * 0.01,
    lng: -73.9965 + (Math.random() - 0.5) * 0.01,
  };
}

// GET all submissions or filter by email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (email) {
      const submissions = await prisma.clothingSubmission.findMany({
        where: { email: { equals: email, mode: 'insensitive' } },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(submissions);
    }
    
    const submissions = await prisma.clothingSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

// POST new submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const coords = geocodeAddress(body.pickupAddress);
    
    const submission = await prisma.clothingSubmission.create({
      data: {
        customerName: body.customerName,
        email: body.email,
        phone: body.phone,
        zelleInfo: body.zelleInfo,
        pickupAddress: body.pickupAddress,
        pickupLat: coords.lat,
        pickupLng: coords.lng,
        clothingDescription: body.clothingDescription || '',
        clothingItems: body.clothingItems || [],
        estimatedItems: body.estimatedItems || 0,
        status: 'pending' as SubmissionStatus,
        customerAvailability: body.customerAvailability || [],
      },
    });
    
    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}

// DELETE all submissions (admin only)
export async function DELETE() {
  try {
    await prisma.clothingSubmission.deleteMany();
    return NextResponse.json({ message: 'All submissions deleted' });
  } catch (error) {
    console.error('Error deleting submissions:', error);
    return NextResponse.json({ error: 'Failed to delete submissions' }, { status: 500 });
  }
}

