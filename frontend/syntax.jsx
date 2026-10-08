import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Syntax from "./components/Syntax";
import Nav from "./components/Nav";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Nav currentView="syntax" />
    <Syntax />
  </StrictMode>,
);
