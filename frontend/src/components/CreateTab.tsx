import { useNavigate } from "react-router-dom";
import { useUserInfoStore } from "../store/userInfoStore";
import { AXIOS_TAB, AXIOS_USER } from "../utils/axios/axios";
import Add from "./Svg/Add";
import Logout from "./Svg/Logout";

const CreateTab = () => {
  const navigate = useNavigate();
  const handleClick = async () => {
    const response = await AXIOS_TAB.post("/create");
    if (response.data.status === "success") {
      alert("Tab created");
    }
  };
  return (
    <div>
      <div
        onClick={handleClick}
        className="absolute bottom-5 right-5 bg-black/40 text-white font-bold p-3 rounded-full cursor-pointer hover:bg-black"
      >
        <Add />
      </div>
      <div
        onClick={() => {
          AXIOS_USER.post("/logout");
          useUserInfoStore.getState().logout();
          localStorage.clear();
          localStorage.setItem("show_tutorial", "false");
          navigate("/login");
        }}
        className="absolute bottom-5 left-5 bg-black/40 text-white font-bold p-3 rounded-full cursor-pointer w-10 h-10  hover:bg-black flex items-center justify-center z-10"
      >
        <Logout />
      </div>
    </div>
  );
};

export default CreateTab;
