'use server';

import { cookies } from 'next/headers';

export async function getCurrentUser() {
  const token = cookies().get('token')?.value;
  if (!token) return undefined;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/whoami/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status == 401) return undefined;
  if (!res.ok) throw Error('Something went wrong');
  const user = (await res.json()) as CurrentUser;
  return user;
}

export async function login(username: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login/`, {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    cache: 'no-cache',
  });
  if (res.status == 401) return undefined;
  if (!res.ok) throw Error('Something went wrong');
  const data = (await res.json()) as LoginResponse;
  cookies().set('token', data.token);
  return data.user;
}

export async function signUp(reqData: SignUpData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/register/`, {
    method: 'POST',
    body: JSON.stringify(reqData),
    cache: 'no-cache',
  });
  if (res.status == 409) return undefined;
  if (!res.ok) throw Error('Something went wrong');
  const data = (await res.json()) as LoginResponse;
  cookies().set('token', data.token);
  return data.user;
}

export async function resetPassword(email: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/send_reset_email/`,
    {
      method: 'POST',
      body: JSON.stringify({ email }),
      cache: 'no-cache',
    }
  );
  if (res.status == 400) return false;
  if (!res.ok) throw Error('Something went wrong');
  return true;
}

export async function activate(emailToken: string) {
  const userToken = cookies().get('token')?.value;
  if (!userToken) throw Error('No user token');
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/activate/`, {
    method: 'POST',
    body: JSON.stringify({ token: emailToken }),
    headers: { Authorization: `Bearer ${userToken}` },
    cache: 'no-cache',
  });
  if (!res.ok) throw Error('Something went wrong');
}

export async function sendActivationEmail() {
  const token = cookies().get('token')?.value;
  if (!token) return undefined;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/send_activation_email/`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-cache',
    }
  );
  if (!res.ok) throw Error('Something went wrong');
}
