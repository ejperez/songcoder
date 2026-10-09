import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SongSheetMaker from "./components/SongSheetMaker";
import Nav from "./components/Nav";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Nav currentView="song-sheet-maker" />
    <SongSheetMaker />
  </StrictMode>,
);
