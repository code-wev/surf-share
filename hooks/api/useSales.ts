import { queryKeys } from "@/lib/api/query-keys";
import { SalesService } from "@/lib/api/services/sales.service";
import { useQuery } from "@tanstack/react-query";

export const useMySales = (locationId?: string) => {
  return useQuery({
    queryKey: locationId ? [...queryKeys.sales.mySales(), locationId] : queryKeys.sales.mySales(),
    queryFn: () => SalesService.getMySales(locationId),
  });
};
