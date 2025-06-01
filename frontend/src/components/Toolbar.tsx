import { userUserInfoStore } from "../store/userInfoStore";
import type { Shapes } from "../types/types";
import Arrow from "./Svg/Arrow";
import Circle from "./Svg/Circle";
import Delete from "./Svg/Delete";
import Diamond from "./Svg/Diamond";
import Line from "./Svg/Line";
import Rect from "./Svg/Rect";

type ToolbarProps = {
  selectedShape: Shapes;
  setSelectedShape: (shape: Shapes) => void;
  clearEverything: () => void;
  undo: () => void;
  toggleModal: () => void;
  setShowTutorial: (val: boolean) => void;
};

export const Options = ({
  selectedShape,
  setSelectedShape,
  clearEverything,
  undo,
  toggleModal,
  setShowTutorial,
}: ToolbarProps) => {
  const isLoggedIn = userUserInfoStore().isLoggedIn;
  return (
    <div className="fixed flex  w-full overflow-auto items-center justify-center  ">
      <div className="md:w-fit w-full  flex gap-4 overflow-auto items-center  fixed top-3  z-10 shadow-lg  bg-white rounded-2xl px-2">
        <button
          className={
            "p-2 cursor-pointer rounded-sm w-12 h-12 flex justify-center items-center hover:bg-[#e0dfffba]"
          }
          onClick={clearEverything}
        >
          <Delete />
        </button>
        <button
          className={"hover:bg-[#e0dfffba]  p-2 cursor-pointer rounded-sm"}
          onClick={undo}
        >
          Remove last
        </button>
        <button
          className={"hover:bg-[#e0dfffba]  p-2 cursor-pointer rounded-sm"}
          onClick={toggleModal}
        >
          Shortcuts
        </button>
        <button
          onClick={() => {
            setShowTutorial(true);
            localStorage.setItem("show_tutorial", "true");
          }}
          className={"hover:bg-[#e0dfffba]  p-2 cursor-pointer rounded-sm"}
        >
          Tutorial
        </button>
        <div className="flex gap-4 p-2">
          {["Rectangle", "Line", "Arrow", "Circle", "Diamond"].map((shape) => (
            <div key={shape}>
              <button
                className={`${
                  selectedShape === shape
                    ? "bg-[#e0dfff]"
                    : "hover:bg-[#e0dfffba]"
                }  p-2 cursor-pointer rounded-sm w-12 h-12 flex justify-center items-center`}
                id={shape}
                name="shape"
                value={shape}
                onClick={() => setSelectedShape(shape as Shapes)}
              >
                {shape === "Rectangle" && (
                  <div className="flex relative">
                    <Rect />
                    <span className="absolute -bottom-3 -right-3">1</span>
                  </div>
                )}
                {shape === "Line" && (
                  <div className="flex relative">
                    <Line />
                    <span className="absolute -bottom-3 -right-3">2</span>
                  </div>
                )}
                {shape === "Arrow" && (
                  <div className="flex relative">
                    <Arrow />
                    <span className="absolute -bottom-3 -right-3">3</span>
                  </div>
                )}
                {shape === "Circle" && (
                  <div className="flex relative">
                    <Circle />
                    <span className="absolute -bottom-3 -right-3">4</span>
                  </div>
                )}
                {shape === "Diamond" && (
                  <div className="flex relative">
                    <Diamond />
                    <span className="absolute -bottom-3 -right-3">5</span>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
        <div className={`flex gap-4 ${isLoggedIn && "hidden"}`}>
          <button className="hover:bg-[#dadada] px-4  p-2 cursor-pointer rounded-md bg-black text-white hover:text-black">
            Login
          </button>
          <button className="hover:bg-[#dadada]  p-2 cursor-pointer rounded-sm bg-black text-white hover:text-black">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};
