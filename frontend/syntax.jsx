import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Syntax from "./components/Syntax";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Syntax />
  </StrictMode>,
);
