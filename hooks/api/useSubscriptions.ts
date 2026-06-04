import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { subscriptionsService, type ISubscriptionTier, type ISubscriptionUpdatePayload } from "../../lib/api/services/subscriptions.service";
import { queryKeys } from "../../lib/api/query-keys";
import { getErrorMessage } from "../../lib/utils/error-handler";

export const useSubscriptionsQuery = () => {
  return useQuery({
    queryKey: queryKeys.subscriptions.lists(),
    queryFn: subscriptionsService.getAll,
  });
};

export const useUpdateSubscriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tier, payload }: { tier: ISubscriptionTier; payload: ISubscriptionUpdatePayload }) =>
      subscriptionsService.update(tier, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all });
      toast.success(`${variables.tier} subscription updated successfully.`);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update subscription."));
    },
  });
};
