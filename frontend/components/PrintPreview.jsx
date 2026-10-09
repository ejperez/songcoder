export default function PrintPreview({ formData, htmlOutput, onPrint }) {
  return (
    <div className="overflow-auto">
      <div className="flex justify-between print:hidden">
        <h2 className="text-lg leading-10">Print Preview</h2>
        <button
          type="button"
          onClick={onPrint}
          className="bg-black text-white w-20 my-2 cursor-pointer"
        >
          Print
        </button>
      </div>
      <div className="text-2xl font-code font-normal border-b">
        {formData.title} - {formData.artist}
      </div>
      <div className="flex gap-10 text-xs mt-1">
        <div>BPM: {formData.bpm}</div>
        <div>Meter: {formData.meter}</div>
        <div>Key: {formData.key}</div>
        <div>Comments: {formData.comments}</div>
      </div>
      <div
        className="w-full"
        dangerouslySetInnerHTML={{ __html: htmlOutput }}
      ></div>
    </div>
  );
}
