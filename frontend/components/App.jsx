import useSongSheetMaker from "../hooks/useSongSheetMaker";
import Editor from "./Editor";
import PrintPreview from "./PrintPreview";
import Header from "./Header";
import { createContext } from "react";

export const AppContext = createContext({});

export default function App() {
  const {
    formData,
    htmlOutput,
    handleChange,
    handleSubmit,
    handlePrint,
    setFormData,
    clearFormData,
  } = useSongSheetMaker();

  return (
    <AppContext
      value={{
        formData,
        setFormData,
        clearFormData,
        handlePrint,
      }}
    >
      <Header currentView="song-sheet-maker" />
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-[calc(100dvh-49px)]">
        <Editor
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
        <PrintPreview
          formData={formData}
          htmlOutput={htmlOutput}
          onPrint={handlePrint}
        />
      </main>
    </AppContext>
  );
}
