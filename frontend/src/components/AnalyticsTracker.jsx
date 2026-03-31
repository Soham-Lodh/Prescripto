import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_ID = "G-JCRN71ZSP3";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", GA_ID, {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
}

export default AnalyticsTracker;