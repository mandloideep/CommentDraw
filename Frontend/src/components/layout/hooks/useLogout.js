import { useDispatch } from "react-redux";
import { apiSlice, useLogoutMutation } from "../../../Redux/slices/apiSlice";

export const useLogout = ({ onError } = {}) => {
  const dispatch = useDispatch();
  const [logoutApi, { isLoading }] = useLogoutMutation();

  const logout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(apiSlice.util.resetApiState());
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      onError?.(err);
    }
  };

  return { logout, isLoggingOut: isLoading };
};
