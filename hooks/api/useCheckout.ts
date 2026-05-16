import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkoutService } from "../../lib/api/services/checkout.service";
import { getErrorMessage } from "../../lib/utils/error-handler";
import { useCartStore } from "@/store/cart.store";

export const useCreateCheckoutSessionMutation = () => {
  const { removeItems } = useCartStore();
  
  return useMutation({
    mutationFn: checkoutService.createSession,
    onSuccess: (data) => {
      // The backend returns the Stripe Checkout URL. We redirect the user to it securely.
      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error, "Failed to initiate secure checkout.");
      
      // Auto-heal the cart if the backend rejects duplicate purchases
      // The backend sends a JSON string inside the message containing "purchasedIds"
      try {
        const parsedError = JSON.parse(errorMessage);
        if (parsedError.purchasedIds && Array.isArray(parsedError.purchasedIds)) {
           removeItems(parsedError.purchasedIds);
           toast.error(parsedError.message || "Some items were removed because you already own them.");
           return;
        }
      } catch (e) {
        // Not a JSON error string, just a normal string message
      }

      toast.error(errorMessage);
    },
  });
};

export const usePurchasedPhotoIdsQuery = () => {
  return useQuery({
    queryKey: ["checkout", "purchased-ids"],
    queryFn: () => checkoutService.getPurchasedPhotoIds(),
  });
};
