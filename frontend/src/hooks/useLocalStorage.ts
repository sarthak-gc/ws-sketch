import { useEffect } from "react";
import type { Element } from "../types/types";

const useLocalStorage = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setElements: React.Dispatch<React.SetStateAction<Element[]>>,
  setShowTutorial: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    const showTutorial = localStorage.getItem("show_tutorial");
    if (showTutorial == "false") {
      setShowTutorial(false);
    }
    setIsLoading(false);
    const storedElem = localStorage.getItem("elements");
    if (storedElem) {
      setElements(JSON.parse(storedElem));
    }
  }, [setIsLoading, setElements, setShowTutorial]);
};

export default useLocalStorage;
