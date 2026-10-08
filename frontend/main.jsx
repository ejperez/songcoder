import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./components/Home.jsx";
import Nav from "./components/Nav";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Nav currentView="home" />
    <Home />
  </StrictMode>,
);
