import Editor from "./Editor";
import PrintPreview from "./PrintPreview";
import useSongSheetMaker from "../hooks/useSongSheetMaker";

export default function SongSheetMaker() {
  const {
    formData,
    htmlOutput,
    handleChange,
    handleSubmit,
    handlePrint,
  } = useSongSheetMaker();

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100dvh-62px)]">
      <Editor
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onPrint={handlePrint}
      />
      <PrintPreview
        formData={formData}
        htmlOutput={htmlOutput}
        onPrint={handlePrint}
      />
    </main>
  );
}
