import { useEffect, useState } from "react";
import { generateChordSheet, keys } from "../../lib/main";
import Nav from "./Nav";

const demoInitialInput = `[Intro]
[[: C:4,4,4,4 Dm | Em F | G Am Bdim :]]3
[[ Dm7:16,16,16 | r:1,2,4,8
[Verse]
F G | Am G/B | C6/9
[Chorus]
[[: C:4,4,4 Dm:4 | Em7:4 F:4,4,8,8 G:8,8 :]]
Am7:8,8,16,16 Bminb5:16,16,16_ BM7:16,16. | C:8_3 Dm:4_3`;

export default function Home() {
  const [code, setCode] = useState("");
  const [htmlOutput, setHtmlOutput] = useState(null);
  const [sourceKey, setSourceKey] = useState(keys[0]);
  const [outputKey, setOutputKey] = useState(keys[0]);
  const options = keys.map((key) => (
    <option value={key} key={key}>
      {key}
    </option>
  ));

  useEffect(() => {
    let counter = 1;

    const interval = setInterval(() => {
      setCode(demoInitialInput.substring(0, counter++));

      if (counter > demoInitialInput.length) {
        clearInterval(interval);
      }
    }, 10);
  }, []);

  useEffect(() => {
    console.log(outputKey);
    try {
      setHtmlOutput(generateChordSheet(code, sourceKey, outputKey));
    } catch (e) {
      console.info(e);
    }
  }, [code, sourceKey, outputKey]);

  return (
    <>
      <Nav currentView="home" />
      <main>
        <section className="text-center leading-relaxed my-10">
          <h2>
            Need a professional-looking chord sheet? ChordPlus can help you with
            that.
          </h2>
          <p>
            It's a lightweight JavaScript library that converts chord sheets
            written in an <a href="syntax.html">easy to learn syntax</a> and
            renders them as HTML with musical notations. It can also transpose
            chord sheets to different keys.
          </p>
          <p>
            You can play with it below. The source codes goes to the left and
            the generated chord sheet appears on the right.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-1 lg:grid-cols-2">
          <div className="grow order-1">
            <textarea
              className="w-full font-code text-[20px] p-2 pt-5 leading-10 font-normal resize-none bg-gray-100 focus:outline-none focus:ring-0"
              id="input"
              rows="16"
              spellCheck="false"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
              }}
            ></textarea>
          </div>
          <div className="grow order-3 lg:order-2">
            <div
              className="w-full p-2 h-[669px] overflow-y-auto border-2 rounded-sm border-gray-100"
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
            ></div>
          </div>
          <div className="order-2 lg:order-3 text-center">
            <label htmlFor="key">
              Key:
              <select
                id="key"
                value={sourceKey}
                onChange={(e) => {
                  setSourceKey(e.target.options[e.target.selectedIndex].value);
                }}
              >
                {options}
              </select>
            </label>
          </div>
          <div className="order-4 text-center">
            <label htmlFor="transpose_to">
              Transpose to:
              <select
                id="transpose_to"
                value={outputKey}
                onChange={(e) => {
                  setOutputKey(e.target.options[e.target.selectedIndex].value);
                }}
              >
                {options}
              </select>
            </label>
          </div>
        </section>
      </main>
    </>
  );
}
