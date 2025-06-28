/**
 * 是否位于大屏页面
 */
export function ifDashboardPage() {
  return location.pathname.startsWith('/dashboard')
}
