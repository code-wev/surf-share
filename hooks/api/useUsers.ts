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

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: Record<string, unknown> }) =>
      usersService.update(userId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["moderators"] });
      toast.success(data.message || "User updated successfully.");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update user."));
    },
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

export const useUpdateUserStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      usersService.updateStatus(userId, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["moderators"] });
      toast.success(data.message || "User status updated successfully.");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update user status."));
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersService.delete(userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: ["moderators"] });
      toast.success(data?.message || "User deleted successfully.");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete user."));
    },
  });
};
