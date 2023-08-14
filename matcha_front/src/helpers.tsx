import { differenceInYears, parseISO } from 'date-fns';

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function findCookie(name: string) {
  const cookies = document.cookie.split(';').map((c) => c.trim());
  for (const cookie of cookies) {
    const [n, v] = cookie.split('=');
    if (name == n) return v;
  }
}

export function birthdateToAge(birthdate: string) {
  const date = parseISO(birthdate);
  const age = differenceInYears(new Date(), date);
  return age;
}

export function getNotificationMessage(n: MNotification) {
  if (n.type == 'visit') return 'visited your profile';
  if (n.type == 'like') return 'likes you';
  if (n.type == 'match') return 'is your new match!';
  return "don't like you anymore";
}

export function parseIntSearchParam(v?: string) {
  const n = parseInt(v ?? '');
  if (isNaN(n)) return undefined;
  return n;
}
