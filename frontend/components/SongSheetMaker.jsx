import Editor from "./Editor";
import PrintPreview from "./PrintPreview";
import useSongSheetMaker from "../hooks/useSongSheetMaker";
import GoogleSheetsConnector from "./GoogleSheetsConnector";

export default function SongSheetMaker() {
  const {
    formData,
    htmlOutput,
    handleChange,
    handleSubmit,
    handlePrint,
    setFormData,
  } = useSongSheetMaker();

  return (
    <main>
      <GoogleSheetsConnector {...{ formData, setFormData }} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100dvh-100px)]">
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
      </div>
    </main>
  );
}
