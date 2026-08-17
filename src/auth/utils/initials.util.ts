export function computeInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0][0];
  const last = words[words.length - 1][0];
  return (words.length === 1 ? first : `${first}${last}`).toUpperCase();
}
