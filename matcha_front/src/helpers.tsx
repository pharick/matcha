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
  if (n.type == 'message') return 'sent you a message';
  return "don't like you anymore";
}

export function parseIntSearchParam(v?: string) {
  const n = parseInt(v ?? '');
  if (isNaN(n)) return undefined;
  return n;
}

export function getRandomMatchPhrase(username: string) {
  const phrases: string[] = [
    "Congratulations! You've found a match! 🎉",
    `Great news! You and ${username} are a match!`,
    `You've got a connection! ${username} is interested too.`,
    `It's a match made in heaven! You and ${username} are a perfect match.`,
    `You're in luck! ${username} is interested in getting to know you.`,
    `Swipe right success! ${username} is your new match.`,
    `A new spark ignites! ${username} has matched with you.`,
    `The stars have aligned! You and ${username} are a match.`,
    `Two hearts meet! ${username} is your latest match.`,
    `Bingo! You and ${username} have matched up. Start chatting now!`,
  ];
  const number = Math.floor(Math.random() * 9);
  return phrases[number];
}
