// import type { MouseEvent } from "react";
// import type { Element } from "../../types/types";

// export const handleMouseMoveH = (
//   e: MouseEvent,
//   isDrawing: boolean,
//   element: Element
// ) => {
//   if (isDrawing) {
//     const id = crypto.randomUUID();
//     createElement({
//       ...element,
//     });
//   }
//   if (grabbedElement) {
//     if (selectedShape == "Grab") {
//       const width = grabbedElement.X2 - grabbedElement.X1;
//       const height = grabbedElement.Y2 - grabbedElement.Y1;

//       const centerX = e.clientX;
//       const centerY = e.clientY;

//       setElements((prev) =>
//         prev.map((elem) =>
//           elem.id === grabbedElement.id
//             ? {
//                 ...elem,
//                 X1: centerX - width / 2,
//                 Y1: centerY - height / 2,
//                 X2: centerX + width / 2,
//                 Y2: centerY + height / 2,
//               }
//             : elem
//         )
//       );

//       setPosX(e.clientX);
//       setPosY(e.clientY);
//     }
//   }

//   for (let i = elements.length - 1; i >= 0; i--) {
//     const isElemThere = elementThere(elements[i], e.clientX, e.clientY);

//     if (isElemThere) {
//       const updatedElements = elements.map((el) =>
//         el === elements[i]
//           ? { ...el, color: "blue" }
//           : { ...el, color: "black" }
//       );
//       setElements(updatedElements);
//       setGrabbedElement({ ...elements[i] });
//       break;
//     } else {
//       setGrabbedElement(null);

//       const updatedElements = elements.map((e) => {
//         return { ...e, color: "black" };
//       });

//       setElements(updatedElements);
//     }
//   }
// };
