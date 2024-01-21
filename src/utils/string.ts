export function isInternalLink(maybeLink: unknown): maybeLink is string {
  return typeof maybeLink === 'string' && !maybeLink.startsWith('http');
}
