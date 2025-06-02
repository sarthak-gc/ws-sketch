import { useUserInfoStore } from "../../store/userInfoStore";
import { Navigate } from "react-router-dom";
import type { ChildComponentProp } from "../../types/types";

const OnlyLoggedOut = ({ element }: ChildComponentProp) => {
  const isLoggedIn = useUserInfoStore().isLoggedIn;

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  } else {
    return element;
  }
};

export default OnlyLoggedOut;
