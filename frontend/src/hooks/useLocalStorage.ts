import { useEffect } from "react";

const useLocalStorage = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,

  setShowTutorial: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    const showTutorial = localStorage.getItem("show_tutorial");
    if (showTutorial == "false") {
      setShowTutorial(false);
    }
    setIsLoading(false);
  }, [setIsLoading, setShowTutorial]);
};

export default useLocalStorage;
