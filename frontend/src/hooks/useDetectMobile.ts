import { useEffect, useState } from "react";

const useDetectMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const x = /Mobi|Android|iPhone|iPad|Windows Phone|Tablet/i.test(userAgent)
      ? "Mobile"
      : "Desktop";
    if (x == "Desktop") {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  }, []);

  return isMobile;
};

export default useDetectMobile;
