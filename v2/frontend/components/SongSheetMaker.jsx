import { generateChordSheet, keys } from "../../lib/main";
import { useState, useEffect } from "react";

export default function SongSheetMaker() {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    bpm: 100,
    meter: "4/4",
    key: "C",
    outputKey: "C",
    comments: "",
    sourceCode: "",
  });
  const [htmlOutput, setHtmlOutput] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => {
      // If key was updated, update outputKey too
      if (name === "key") {
        prevData.outputKey = value;
      }

      return {
        ...prevData,
        [name]:
          type === "select-one"
            ? e.target.options[e.target.selectedIndex].value
            : value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted Data:", formData);
  };

  useEffect(() => {
    try {
      setHtmlOutput(
        generateChordSheet(
          formData.sourceCode,
          formData.key,
          formData.outputKey,
        ),
      );

      document.title = `${formData.title} - ${formData.artist} | Song Coder`;
    } catch (e) {
      console.info(e);
    }
  }, [formData]);

  const meters = ["4/4", "3/4", "2/4", "6/8", "12/8"];
  const getOptions = (label, values) => [
    <option key="" value="" disabled>
      {label}
    </option>,
    ...values.map((value) => (
      <option value={value} key={value}>
        {value}
      </option>
    )),
  ];

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <form
        className="flex flex-col gap-2 print:hidden"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg leading-10">Editor</h2>
        <div className="flex justify-between gap-2">
          <input
            className="bg-gray-100 p-2 w-full"
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
          />
          <input
            className="bg-gray-100 p-2 w-full"
            type="text"
            name="artist"
            placeholder="Artist"
            value={formData.artist}
            onChange={handleChange}
          />
          <input
            className="bg-gray-100 p-2"
            type="number"
            name="bpm"
            min={24}
            max={500}
            placeholder="BPM"
            value={formData.bpm}
            onChange={handleChange}
          />
          <select
            className="bg-gray-100 p-2"
            name="meter"
            value={formData.meter}
            onChange={handleChange}
          >
            {getOptions("Meter", meters)}
          </select>
        </div>
        <div className="flex justify-between gap-2">
          <select
            className="bg-gray-100 p-2 w-36"
            name="key"
            value={formData.key}
            onChange={handleChange}
          >
            {getOptions("Key", keys)}
          </select>
          <select
            className="bg-gray-100 p-2 w-36"
            name="outputKey"
            value={formData.outputKey}
            onChange={handleChange}
          >
            {getOptions("Transpose To", keys)}
          </select>
          <input
            className="bg-gray-100 p-2 w-full"
            type="text"
            name="comments"
            placeholder="Comments"
            value={formData.comments}
            onChange={handleChange}
          />
        </div>
        <textarea
          className="w-full font-code text-xl p-2 leading-10 font-normal resize-none bg-gray-100 focus:outline-none focus:ring-0"
          name="sourceCode"
          rows="20"
          spellCheck="false"
          value={formData.sourceCode}
          onChange={handleChange}
        ></textarea>
      </form>
      <div className="overflow-auto">
        <div className="flex justify-between print:hidden">
          <h2 className="text-lg leading-10">Print Preview</h2>
          <button
            type="submit"
            onClick={window.print}
            className="bg-black text-white w-20 mt-2 cursor-pointer"
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
    </main>
  );
}
