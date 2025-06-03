import { useNavigate } from "react-router-dom";
import { useUserInfoStore } from "../store/userInfoStore";
import { AXIOS_USER } from "../utils/axios/axios";
import Logout from "./Svg/Logout";
import Collab from "./Svg/Collab";
import JoinLink from "./Svg/JoinLink";
import { useState } from "react";

const ControlPanel = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div className="fixed bottom-6  z-10 right-6">
      <div className="flex gap-8  items-center">
        <div
          className={`flex gap-4 overflow-auto justify-end transition-all z-10 rounded-2xl  duration-800 ${
            isOpen ? "max-w-[500px]" : "max-w-0"
          }`}
        >
          <button className=" bg-black/40 text-white font-bold p-3 rounded-full cursor-pointer hover:bg-black">
            <Collab />
          </button>
          <button className=" bg-black/40 text-white font-bold p-3 rounded-full cursor-pointer hover:bg-black">
            <JoinLink />
          </button>

          <div
            onClick={() => {
              AXIOS_USER.post("/logout");
              useUserInfoStore.getState().logout();
              localStorage.clear();
              localStorage.setItem("show_tutorial", "false");
              navigate("/login");
            }}
            className=" bg-black/40 text-white font-bold p-3 rounded-full cursor-pointer hover:bg-black"
          >
            <Logout />
          </div>
        </div>

        <button
          className="bg-black/40 text-white font-bold p-3 rounded-full cursor-pointer hover:bg-black h-12 w-12 flex items-center text-center justify-center"
          onClick={handleToggle}
        >
          <div>
            {isOpen ? (
              <span>x</span>
            ) : (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
