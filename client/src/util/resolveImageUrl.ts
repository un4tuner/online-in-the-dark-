import { BASE_URL } from '@/api/connection';

export default function resolveImageUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/images/') || path.startsWith('/books/')) {
    if (window.location.port === '5173') {
      return BASE_URL + path;
    }
    return path;
  }
  return path;
} 