export function resolveImageUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/images/') || path.startsWith('/books/')) {
    if (window.location.port === '5173') {
      return 'http://localhost:3005' + path;
    }
    return path;
  }
  return path;
} 