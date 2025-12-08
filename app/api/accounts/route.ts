import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all accounts
export async function GET() {
  try {
    const accounts = await prisma.customerAccount.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

// POST new account or update existing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const account = await prisma.customerAccount.upsert({
      where: { email: body.email.toLowerCase() },
      update: {
        customerName: body.customerName,
        phone: body.phone,
        zelleInfo: body.zelleInfo,
        defaultAddress: body.defaultAddress,
      },
      create: {
        email: body.email.toLowerCase(),
        customerName: body.customerName,
        phone: body.phone,
        zelleInfo: body.zelleInfo,
        defaultAddress: body.defaultAddress,
      },
    });
    
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating account:', error);
    return NextResponse.json({ error: 'Failed to save account' }, { status: 500 });
  }
}

