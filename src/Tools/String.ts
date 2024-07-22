export function slugify(text: string) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+\?/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')

}

export function removeLastSlashUrl(text: string) {
  if (!text) {
    return text
  }
  return text.toString().endsWith('/') ? text.slice(0, -1) : text
}