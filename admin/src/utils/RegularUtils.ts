// ===== ===== ===== ===== ===== ===== 以下为 dcts 专用 ===== ===== ===== ===== ===== =====
export function getLonlatFromLinestring(str: string): { lon: number, lat: number }[] {
  const match = str.match(/[0-9., ]+/);
  if (!match) {
    return []
  }
  const ret: { lon: number, lat: number }[] = []
  for (const string of match[0].split(',')) {
    const strings = string.split(' ');
    ret.push({lon: Number(strings[0]), lat: Number(strings[1])})
  }
  return ret
}
