import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

import { activate } from '@/api/auth';

export async function GET(request: NextRequest) {
  const emailToken = request.nextUrl.searchParams.get('token');
  if (!emailToken) return new NextResponse();
  await activate(emailToken);
  redirect('/');
}
