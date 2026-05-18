import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../../lib/api/services/users.service";
import { queryKeys } from "../../lib/api/query-keys";
import { toast } from "sonner";
import { getErrorMessage } from "../../lib/utils/error-handler";

export const useUsersQuery = (filters: { role: string; page: number; limit?: number }) => {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => usersService.getAll(filters),
  });
};

export const useUpdateSubscriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, tier }: { userId: string; tier: string }) =>
      usersService.updateSubscription(userId, tier),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
      toast.success(data.message || "Subscription updated successfully.");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update subscription."));
    },
  });
};
