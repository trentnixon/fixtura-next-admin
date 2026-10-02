export function gradientBackground(type: string, direction: string): string {
  const hint = `${type} ${direction}`.toLowerCase();
  if (hint.includes("radial") || hint.includes("circle")) {
    return "radial-gradient(circle at 30% 30%, #99f6e4, #0f766e 42%, #0f172a 78%)";
  }
  return `linear-gradient(${gradientAngle(hint)}, #99f6e4, #0f766e 46%, #0f172a)`;
}

function gradientAngle(hint: string): string {
  if (hint.includes("horizontal") || /\bleft\b/.test(hint) || /\bright\b/.test(hint)) {
    return "90deg";
  }
  if (hint.includes("vertical") || /\bup\b/.test(hint) || /\bdown\b/.test(hint)) {
    return "180deg";
  }
  return "135deg";
}
