export function randomInteger(max: number, min: number = 0) {
  const diff = max - min;
  if (!Number.isFinite(diff)) {
    return NaN;
  }

  return min + Math.floor(Math.random() * diff);
}

export function randomHexColor() {
  const val = Math.random().toString(16).substring(2, 8);
  return `#${val}`;
}
