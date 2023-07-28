'use server';

import { cookies } from 'next/headers';

export async function getCurrentUser() {
  const token = cookies().get('token')?.value;
  if (!token) return undefined;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/whoami/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status == 401) return undefined;
  if (!res.ok) throw Error('Something went wrong');
  const user = (await res.json()) as CurrentUser;
  return user;
}

export async function login(username: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login/`, {
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
  console.log(reqData);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register/`, {
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
