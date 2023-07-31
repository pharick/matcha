export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function findCookie(name: string) {
  const cookies = document.cookie.split(';').map((c) => c.trim());
  for (const cookie of cookies) {
    const [n, v] = cookie.split('=');
    if (name == n) return v;
  }
}
