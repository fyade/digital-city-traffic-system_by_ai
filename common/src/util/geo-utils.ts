// 地球半径(米)
const EARTH_RADIUS = 6371008.8

function _toRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

/**
 * 使用 Haversine 公式计算距离（适合短距离，速度快）
 * @param {[number, number]} lonLat1 - 起点 [经度, 纬度]
 * @param {[number, number]} lonLat2 - 终点 [经度, 纬度]
 * @returns {number} 距离（米）
 */
export function haversineDistance(lonLat1: [number, number], lonLat2: [number, number]) {
  const [lon1, lat1] = lonLat1.map(deg => _toRadians(deg));
  const [lon2, lat2] = lonLat2.map(deg => _toRadians(deg));
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
}

/**
 * 基于Haversine公式计算路径总距离（适合短距离/实时计算）
 * @param {[number, number][]} points - 经纬度数组 [[lon1, lat1], [lon2, lat2], ...]
 * @returns {number} 总距离（米）
 */
export function calculatePathLengthHaversine(points: [number, number][]) {
  if (points.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += haversineDistance(points[i], points[i + 1]);
  }
  return total;
}

/**
 * 使用 Vincenty 公式计算距离（高精度，适合长距离）
 * @param {[number, number]} lonLat1 - 起点 [经度, 纬度]
 * @param {[number, number]} lonLat2 - 终点 [经度, 纬度]
 * @param {number} [maxIterations=200] - 最大迭代次数
 * @returns {number} 距离（米）
 */
export function vincentyDistance(lonLat1: [number, number], lonLat2: [number, number], maxIterations = 200) {
  const [lon1, lat1] = lonLat1.map(deg => _toRadians(deg));
  const [lon2, lat2] = lonLat2.map(deg => _toRadians(deg));
  // WGS84 椭球体参数
  const a = 6378137; // 长半轴（米）
  const b = 6356752.314245; // 短半轴（米）
  const f = (a - b) / a; // 扁率
  const L = lon2 - lon1;
  const U1 = Math.atan((1 - f) * Math.tan(lat1));
  const U2 = Math.atan((1 - f) * Math.tan(lat2));
  let lambda = L;
  let lambdaPrev;
  let sinSigma, cosSigma, sigma, sinAlpha, cosSqAlpha, cos2SigmaM;
  let iterations = 0;
  do {
    lambdaPrev = lambda; // 保存上一次的lambda值
    sinSigma = Math.sqrt(
        (Math.cos(U2) * Math.sin(lambda)) ** 2 +
        (Math.cos(U1) * Math.sin(U2) - Math.sin(U1) * Math.cos(U2) * Math.cos(lambda)) ** 2
    );
    cosSigma = Math.sin(U1) * Math.sin(U2) + Math.cos(U1) * Math.cos(U2) * Math.cos(lambda);
    sigma = Math.atan2(sinSigma, cosSigma);
    sinAlpha = (Math.cos(U1) * Math.cos(U2) * Math.sin(lambda)) / sinSigma;
    cosSqAlpha = 1 - sinAlpha ** 2;
    cos2SigmaM = cosSigma - (2 * Math.sin(U1) * Math.sin(U2)) / cosSqAlpha;
    const C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
    lambda =
        L +
        (1 - C) *
        f *
        sinAlpha *
        (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM ** 2)));
    iterations++;
  } while (Math.abs(lambda - lambdaPrev) > 1e-12 && iterations < maxIterations);
  const uSq = (cosSqAlpha * (a ** 2 - b ** 2)) / (b ** 2);
  const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
  const deltaSigma =
      B *
      sinSigma *
      (cos2SigmaM +
          (B / 4) *
          (cosSigma * (-1 + 2 * cos2SigmaM ** 2) -
              (B / 6) * cos2SigmaM * (-3 + 4 * sinSigma ** 2) * (-3 + 4 * cos2SigmaM ** 2)));
  return b * A * (sigma - deltaSigma);
}

/**
 * 基于Vincenty公式计算路径总距离（高精度，适合长距离）
 * @param {[number, number][]} points - 经纬度数组 [[lon1, lat1], [lon2, lat2], ...]
 * @param {number} [maxIterations=200] - Vincenty最大迭代次数
 * @returns {number} 总距离（米）
 */
export function calculatePathLengthVincenty(points: [number, number][], maxIterations = 200) {
  if (points.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += vincentyDistance(points[i], points[i + 1], maxIterations);
  }
  return total;
}

/**
 * 将矩形边界向外扩展固定距离（单位：千米）
 * @param bounds 原始矩形边界 [top, right, bottom, left]（单位：度）
 * @param padding 扩展距离（单位：千米，默认2km）
 * @returns 扩展后的矩形边界 [top, right, bottom, left]
 */
export function expandBounds(
    bounds: [number, number, number, number], // [top, right, bottom, left]
    padding: number = 2
): [number, number, number, number] {
  const [top, right, bottom, left] = bounds;

  // 计算纬度方向扩展量（全球1°≈111km）
  const latPadding = padding / 111;

  // 计算经度方向扩展量（需考虑纬度影响）
  const centerLat = (top + bottom) / 2;
  const lngPadding = padding / (111 * Math.cos(centerLat * Math.PI / 180));

  return [
    top + latPadding,    // 上边扩展
    right + lngPadding,  // 右边扩展
    bottom - latPadding, // 下边扩展
    left - lngPadding    // 左边扩展
  ];
}
