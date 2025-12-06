import { StrictMode } from "react";
import AppContextProvider from "./context/AppContext";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "aos/dist/aos.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HelmetProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </HelmetProvider>
  </BrowserRouter>
);
