import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

import { authService } from "../../lib/api/services/auth.service";
import { useAuth, getRoleHomePath } from "../../lib/auth";
import { queryKeys } from "../../lib/api/query-keys";
import { getErrorMessage } from "../../lib/utils/error-handler";

type RegisterBasePayload = {
  name: string;
  email: string;
  password: string;
  promotionEmail?: boolean;
};

type RegisterPhotographerPayload = RegisterBasePayload & {
  paypalEmail?: string;
  acceptedApproval: boolean;
  acceptedContributor: boolean;
};

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
      toast.error(getErrorMessage(error, "Invalid email or password."));
    },
  });
};

export const useGoogleLoginMutation = () => {
  const { setSessionData } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.googleLogin,
    retry: false, // Critical: prevent retrying since Google Auth codes can only be used once
    onSuccess: (data) => {
      const { accessToken, user } = data.data;
      setSessionData(user, accessToken);
      toast.success(`Logged in with Google successfully.`);
      router.push(getRoleHomePath(user.role));
    },
    onError: (error: unknown) => {
      const isNotFound = isAxiosError(error) && error.response?.status === 404;

      // Specifically look for the message in the expected response structure
      let message = "Google authentication failed.";
      if (isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else {
        message = getErrorMessage(error, message);
      }

      toast.error(message);

      if (isNotFound) {
        router.push("/signup");
      }
    },
  });
};

export const useRegisterSurferMutation = () => {
  return useMutation<unknown, unknown, RegisterBasePayload>({
    mutationFn: authService.registerSurfer,
    onSuccess: () => {
      toast.success("Account created successfully! Please log in.");
      window.location.assign("/login");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "An error occurred during registration."));
    },
  });
};

export const useRegisterPhotographerMutation = () => {
  return useMutation<unknown, unknown, RegisterPhotographerPayload>({
    mutationFn: authService.registerPhotographer,
    onSuccess: () => {
      toast.success("Account created successfully! Please log in.");
      window.location.assign("/login");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "An error occurred during registration."));
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
      toast.error(getErrorMessage(error, "Failed to register moderator."));
    },
  });
};
