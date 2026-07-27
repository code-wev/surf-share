import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkoutService } from "../../lib/api/services/checkout.service";
import { getErrorMessage } from "../../lib/utils/error-handler";

type CheckoutQueryOptions = {
  enabled?: boolean;
};

export const useCreatePayPalOrderMutation = () => {
  return useMutation({
    mutationFn: checkoutService.createSession,
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error, "Failed to initiate secure checkout.");
      toast.error(errorMessage);
    },
  });
};

export const useCapturePayPalOrderMutation = () => {
  return useMutation({
    mutationFn: checkoutService.captureOrder,
    onSuccess: (data, orderId) => {
      // Clear the items from cart (they are now purchased)
      // Since we don't have the photoIds in this mutation variables, we might need to rely on the cart clearing them, or we can just clear the whole cart for now, or just the selected ones if passed.
      // Actually, if we successfully purchase, we can just redirect to /checkout/success and clear the whole cart for now.
      window.location.href = `/checkout/success?order_id=${orderId}`;
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error, "Failed to capture payment.");
      toast.error(errorMessage);
    },
  });
};

export const usePurchasedPhotoIdsQuery = (options: CheckoutQueryOptions = {}) => {
  return useQuery({
    queryKey: ["checkout", "purchased-ids"],
    queryFn: () => checkoutService.getPurchasedPhotoIds(),
    enabled: options.enabled ?? true,
  });
};
