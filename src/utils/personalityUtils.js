export function interpretFactor([pos, neg, _latent]) {
  if (pos >= 2 && neg <= 1) return '+';
  if (neg >= 2 && pos <= 1) return '-';
  if (pos >= 2 && neg >= 2) return '+-';
  if ((pos <= 1 && neg <= 1) || (pos <= 1 && neg === 0) || (pos === 0 && neg <= 1)) return '0';
  return '0';
}

export function determineType(result) {
  if (!result || !result.k || !result.p) return 'Unknown';
  const kReaction = interpretFactor(result.k.values);
  const pReaction = interpretFactor(result.p.values);
  const map = { '0': 0, '-': 1, '+': 2, '+-': 3 };
  return `T${map[kReaction]}${map[pReaction]}`;
}


export function getFactorBreakdown(result) {
  const output = {};
  if (!result) return output;
  for (const factor of ['d', 'e', 'h', 'hy', 'k', 'm', 'p', 's']) {
    if (result[factor]) {
      output[factor] = interpretFactor(result[factor].values);
    }
  }
  return output;
}
