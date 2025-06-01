import { useNavigate } from "react-router-dom";
import { userUserInfoStore } from "../../store/userInfoStore";
import type { ChildComponentProp } from "../../types/types";

const OnlyLoggedIn = ({ element }: ChildComponentProp) => {
  const isLoggedIn = userUserInfoStore().isLoggedIn;
  const navigate = useNavigate();

  if (isLoggedIn) {
    return element;
  } else {
    navigate("/");
  }
};

export default OnlyLoggedIn;
