/**
 * 是否处于大屏页面
 */
export function ifDashboardPage(path?: string) {
  const _path = path || location.pathname
  return _path.startsWith('/dashboard/') || _path === '/dashboard'
}
