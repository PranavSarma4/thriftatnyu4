import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET account by email
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);
    
    const account = await prisma.customerAccount.findFirst({
      where: { email: { equals: decodedEmail, mode: 'insensitive' } },
    });
    
    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }
    
    return NextResponse.json(account);
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json({ error: 'Failed to fetch account' }, { status: 500 });
  }
}

