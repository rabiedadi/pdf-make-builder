export function uuid() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '');
}
