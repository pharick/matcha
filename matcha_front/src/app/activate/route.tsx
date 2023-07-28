import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

import { activate } from '@/api/auth';

export async function GET(request: NextRequest) {
  const emailToken = request.nextUrl.searchParams.get('token');
  if (!emailToken) throw Error('No email token');
  activate(emailToken);
  redirect('/');
}
