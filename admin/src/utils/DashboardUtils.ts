/**
 * 是否处于地图大屏端
 */
export function ifDashboardPage(path?: string) {
  const _path = path || location.pathname
  return _path.startsWith('/dashboard/') || _path === '/dashboard'
}

/**
 * 是否处于三维端
 */
export function ifThreePage(path?: string) {
  const _path = path || location.pathname
  return _path.startsWith('/three/') || _path === '/three'
}
