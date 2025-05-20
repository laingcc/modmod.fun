export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const crypto = window.crypto || (window as any).msCrypto; // For older browsers
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  randomValues.forEach(value => {
    result += characters.charAt(value % characters.length);
  });
  return result;
}
