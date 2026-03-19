const HTML_TAG_PATTERN = /<[^>]*>/g;
const MARKDOWN_FORMATTING_PATTERN = /##|\*\*|__|`|~~/g;
const NON_BREAKING_SPACE_PATTERN = /\u00a0/g;
const DISALLOWED_CHARACTER_PATTERN = /[^\x20-\x7e£]/g;
const WHITESPACE_PATTERN = /\s+/g;

export function normaliseText(raw: string): string {
  return raw
    .toLowerCase()
    .replace(HTML_TAG_PATTERN, ' ')
    .replace(MARKDOWN_FORMATTING_PATTERN, ' ')
    .replace(NON_BREAKING_SPACE_PATTERN, ' ')
    .replace(DISALLOWED_CHARACTER_PATTERN, '')
    .replace(WHITESPACE_PATTERN, ' ')
    .trim();
}

export function wordCount(text: string): number {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return 0;
  }

  return trimmedText.split(WHITESPACE_PATTERN).length;
}
