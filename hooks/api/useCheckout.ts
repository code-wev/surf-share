import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkoutService } from "../../lib/api/services/checkout.service";
import { getErrorMessage } from "../../lib/utils/error-handler";

export const useCreateCheckoutSessionMutation = () => {
  return useMutation({
    mutationFn: checkoutService.createSession,
    onSuccess: (data) => {
      // The backend returns the Stripe Checkout URL. We redirect the user to it securely.
      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to initiate secure checkout."));
    },
  });
};
