// const useHandleShortcuts = () => {
//   const handleKeyPress = useCallback(
//     (e: KeyboardEvent) => {
//       if (!grabbedElement) {
//         if (e.ctrlKey) {
//           switch (e.key) {
//             case "d":
//               clearEverything();
//               break;
//             case "s":
//               setIsModalOpen((prev) => !prev);
//               break;
//           }
//         }
//         switch (e.key) {
//           case "1":
//             setSelectedShape("Rectangle");
//             break;
//           case "2":
//             setSelectedShape("Line");
//             break;
//           case "3":
//             setSelectedShape("Arrow");
//             break;
//           case "4":
//             setSelectedShape("Circle");
//             break;
//           case "5":
//             setSelectedShape("Diamond");
//             break;
//           case "Backspace":
//             handleDelete();
//             break;
//           default:
//             break;
//         }
//         return;
//       }
//       if (e.key == "Escape") {
//         const updatedElements = elements.map((e) => {
//           return { ...e, color: "black" };
//         });
//         setElements(updatedElements);
//         setGrabbedElement(null);
//       }
//     },
//     [handleDelete, grabbedElement, elements]
//   );
// };

// export default useHandleShortcuts;
