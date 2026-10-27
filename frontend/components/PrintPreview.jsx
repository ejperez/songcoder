export default function PrintPreview({ formData, htmlOutput }) {
  return (
    <div className="overflow-auto bg-white p-2">
      <div className="text-2xl font-code font-normal border-b">
        {formData.title} - {formData.artist}
      </div>
      <div className="flex gap-10 text-xs mt-1">
        <div>BPM: {formData.bpm}</div>
        <div>Meter: {formData.meter}</div>
        <div>Key: {formData.outputKey}</div>
        <div>Comments: {formData.comments}</div>
      </div>
      <div
        className="w-full"
        dangerouslySetInnerHTML={{ __html: htmlOutput }}
      ></div>
    </div>
  );
}
