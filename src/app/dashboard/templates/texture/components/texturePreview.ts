export function textureOverlayOpacity(value: number | null): number {
  if (value === null || Number.isNaN(value)) return 0.8;
  const unit = value > 1 ? value / 100 : value;
  if (unit < 0) return 0;
  if (unit > 1) return 1;
  return unit;
}
