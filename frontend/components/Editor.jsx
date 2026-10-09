import { keys } from "../../lib/main";

const meters = ["4/4", "3/4", "2/4", "6/8", "12/8"];

function Options({ label, values }) {
  return (
    <>
      <option value="" disabled>
        {label}
      </option>
      {values.map((value) => (
        <option value={value} key={value}>
          {value}
        </option>
      ))}
    </>
  );
}

export default function Editor({ formData, onChange, onSubmit, onPrint }) {
  return (
    <form
      className="flex flex-col gap-2 print:hidden h-full"
      onSubmit={onSubmit}
    >
      <h2 className="text-lg leading-10">Editor</h2>
      <div className="flex justify-between gap-2">
        <input
          className="bg-gray-100 p-2 w-full"
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={onChange}
          required
        />
        <input
          className="bg-gray-100 p-2 w-full"
          type="text"
          name="artist"
          placeholder="Artist"
          value={formData.artist}
          onChange={onChange}
          required
        />
        <input
          className="bg-gray-100 p-2"
          type="number"
          name="bpm"
          min={24}
          max={500}
          placeholder="BPM"
          value={formData.bpm}
          onChange={onChange}
        />
        <select
          className="bg-gray-100 p-2"
          name="meter"
          value={formData.meter}
          onChange={onChange}
        >
          <Options label="Meter" values={meters} />
        </select>
      </div>
      <div className="flex justify-between gap-2">
        <select
          className="bg-gray-100 p-2 w-36"
          name="key"
          value={formData.key}
          onChange={onChange}
        >
          <Options label="Key" values={keys} />
        </select>
        <select
          className="bg-gray-100 p-2 w-36"
          name="outputKey"
          value={formData.outputKey}
          onChange={onChange}
        >
          <Options label="Transpose To" values={keys} />
        </select>
        <input
          className="bg-gray-100 p-2 w-full"
          type="text"
          name="comments"
          placeholder="Comments"
          value={formData.comments}
          onChange={onChange}
        />
      </div>
      <textarea
        className="w-full font-code text-xl p-2 leading-10 font-normal resize-none bg-gray-100 focus:outline-none focus:ring-0 grow"
        name="sourceCode"
        placeholder="Source code"
        spellCheck="false"
        value={formData.sourceCode}
        onChange={onChange}
        required
      ></textarea>
    </form>
  );
}
