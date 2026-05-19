import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../lib/api/services/dashboard.service";
import { queryKeys } from "../../lib/api/query-keys";

export const useDashboardStatsQuery = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: () => dashboardService.getStats(),
  });
};
