import { useQuery } from "@tanstack/react-query";
import { usersService } from "../../lib/api/services/users.service";
import { queryKeys } from "../../lib/api/query-keys";

export const useUsersQuery = (filters: { role: string; page: number; limit?: number }) => {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => usersService.getAll(filters),
  });
};
