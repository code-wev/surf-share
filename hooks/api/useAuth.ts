import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

import { authService } from "../../lib/api/services/auth.service";
import { useAuth, getRoleHomePath } from "../../lib/auth";
import { queryKeys } from "../../lib/api/query-keys";

export const useLoginMutation = () => {
  const { setSessionData } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const { accessToken, user } = data.data;
      setSessionData(user, accessToken);
      toast.success(`Logged in successfully.`);
      router.push(getRoleHomePath(user.role));
    },
    onError: (error: unknown) => {
      const errorMessage =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Invalid email or password.";
      toast.error(errorMessage);
    },
  });
};

export const useRegisterSurferMutation = () => {
  return useMutation({
    mutationFn: authService.registerSurfer,
    onSuccess: () => {
      toast.success("Account created successfully! Please log in.");
      window.location.assign("/login");
    },
    onError: (error: unknown) => {
      const errorMessage =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "An error occurred during registration.";
      toast.error(errorMessage);
    },
  });
};

export const useRegisterPhotographerMutation = () => {
  return useMutation({
    mutationFn: authService.registerPhotographer,
    onSuccess: () => {
      toast.success("Account created successfully! Please log in.");
      window.location.assign("/login");
    },
    onError: (error: unknown) => {
      const errorMessage =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "An error occurred during registration.";
      toast.error(errorMessage);
    },
  });
};

export const useRegisterModeratorMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.registerModerator,
    onSuccess: () => {
      toast.success("Moderator registered successfully.");
      if (onSuccessCallback) onSuccessCallback();
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    onError: (error: unknown) => {
      const errorMessage =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to register moderator.";
      toast.error(errorMessage);
    },
  });
};
