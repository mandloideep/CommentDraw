import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  apiSlice,
  useConfirmDeleteMutation,
  useRequestDeleteOTPMutation,
} from "../../../Redux/slices/apiSlice";

export const useAccountActions = (setModal) => {
  const dispatch = useDispatch();
  const [showCaution, setShowCaution] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [requestOTP] = useRequestDeleteOTPMutation();
  const [confirmDelete, { isLoading: isVerifying }] =
    useConfirmDeleteMutation();

  const triggerDelete = () => setShowCaution(true);
  const closeModals = () => {
    setShowCaution(false);
    setShowOtpModal(false);
  };

  const handleCautionConfirm = async () => {
    setShowCaution(false);
    try {
      await requestOTP().unwrap();
      setShowOtpModal(true);
    } catch (err) {
      setModal({ open: true, type: "error", message: "Failed to send OTP" });
    }
  };

  const handleVerifyOTP = async (otpCode) => {
    try {
      await confirmDelete(otpCode).unwrap();
      dispatch(apiSlice.util.resetApiState());
      localStorage.removeItem("token");
      window.location.href = "/";

      setModal({
        open: true,
        type: "success",
        title: "Deleted",
        message: "Account removed successfully.",
      });
    } catch (err) {
      setModal({
        open: true,
        type: "error",
        title: "Wrong OTP",
        message: err?.data?.message || "Verification failed",
      });
    }
  };

  return {
    triggerDelete,
    handleCautionConfirm,
    handleVerifyOTP,
    showCaution,
    showOtpModal,
    isVerifying,
    closeModals,
  };
};
