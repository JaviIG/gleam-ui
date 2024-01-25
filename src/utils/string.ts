export function isInternalLink(maybeLink: unknown): maybeLink is string {
  return typeof maybeLink === 'string' && !maybeLink.startsWith('http');
}

const collator = new Intl.Collator(undefined, {
  usage: 'search',
  ignorePunctuation: true,
  sensitivity: 'base',
});

export function contains(string: string, substring: string): boolean {
  if (substring.length === 0) {
    return true;
  }

  string = string.normalize('NFC');
  substring = substring.normalize('NFC');

  let scan = 0;
  const sliceLen = substring.length;
  for (; scan + sliceLen <= string.length; scan++) {
    const slice = string.slice(scan, scan + sliceLen);
    if (collator.compare(substring, slice) === 0) {
      return true;
    }
  }

  return false;
}
