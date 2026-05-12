import request from '@/api/request.ts';
import type { StrategyOverviewGroupVo } from '@/type/module/dcts/strategyOverview.ts';

export function strategyOverviewApi() {
  return request<StrategyOverviewGroupVo[]>({
    url: '/dcts/strategy-overview',
    method: 'GET',
  });
}
