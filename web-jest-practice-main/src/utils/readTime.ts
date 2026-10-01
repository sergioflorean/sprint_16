function calculateReadTime(content: string): number {
  const trimmed = content.trim();
  if (!trimmed) return 0;
  const wordCount = trimmed.split(/\s+/).length;
  return Math.ceil(wordCount / 200);
}

export { calculateReadTime };
