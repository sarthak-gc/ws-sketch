import type { Shapes } from "../types/types";
import Arrow from "./Svg/Arrow";
import Circle from "./Svg/Circle";
import Diamond from "./Svg/Diamond";
import Line from "./Svg/Line";
import Rect from "./Svg/Rect";

type ToolbarProps = {
  selectedShape: Shapes;
  setSelectedShape: (shape: Shapes) => void;
  clearEverything: () => void;
  undo: () => void;
};

export const Options = ({
  selectedShape,
  setSelectedShape,
  clearEverything,
  undo,
}: ToolbarProps) => (
  <div className="fixed bg-red-500 flex gap-40 w-full overflow-auto">
    <button onClick={clearEverything}>Clear</button>
    <button onClick={undo}>Remove last element</button>
    {["Rectangle", "Line", "Arrow", "Circle", "Diamond"].map((shape) => (
      <div key={shape}>
        <button
          className={`${
            selectedShape === shape ? "bg-[#ccc]" : ""
          } bg-white p-2 cursor-pointer hover:bg-[#dadada]`}
          id={shape}
          name="shape"
          value={shape}
          onClick={() => setSelectedShape(shape as Shapes)}
        >
          {shape === "Rectangle" && <Rect />}
          {shape === "Line" && <Line />}
          {shape === "Arrow" && <Arrow />}
          {shape === "Circle" && <Circle />}
          {shape === "Diamond" && <Diamond />}
        </button>
      </div>
    ))}
  </div>
);
