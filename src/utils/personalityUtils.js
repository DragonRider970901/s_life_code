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

export function getType(type) {
  if (type === '1') {
    return 'T00';
  } else if (type === '2') {
    return 'T01';
  } else if (type === '3') {
    return 'T02';
  } else if (type === '4') {
    return 'T03';
  } else if (type === '5') {
    return 'T10';
  } else if (type === '6') {
    return 'T11';
  } else if (type === '7') {
    return 'T12';
  } else if (type === '8') {
    return 'T13';
  } else if (type === '9') {
    return 'T20';
  } else if (type === '10') {
    return 'T21';
  } else if (type === '11') {
    return 'T22';
  } else if (type === '12') {
    return 'T23';
  } else if (type === '13') {
    return 'T30';
  } else if (type === '14') {
    return 'T31';
  } else if (type === '15') {
    return 'T32';
  } else if (type === '16') {
    return 'T33';
  } else {
    return "Invalid type!";
  }
}
