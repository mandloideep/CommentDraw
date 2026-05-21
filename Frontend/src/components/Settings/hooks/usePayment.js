import { useCreateOrderMutation } from "../../../Redux/slices/apiSlice";

export const usePayment = (userEmail, setModal) => {
  const [createOrder] = useCreateOrderMutation();

  const handlePayment = async (planName) => {
    if (planName.toUpperCase() === "FREE") return;

    try {
      const session = await createOrder(planName.toUpperCase()).unwrap();

      if (!session?.url) {
        throw new Error("No checkout URL returned from server");
      }

      window.location.href = session.url;
    } catch (err) {
      setModal({
        open: true,
        title: "Payment Failed",
        message:
          err?.data?.message || "Could not initialize payment. Please try again.",
        type: "error",
      });
    }
  };

  return { handlePayment };
};
