import { generateChordSheet } from "../../lib/main";

const guides = [
  {
    label: "Chords",
    description:
      "Chords are displayed as is. Sharps (#) will be replaced with flats (b) if the new key has flats.",
    input: `A B C D E F G
Am7 Bdim7 C#m9b13 DM9 E11 Fm6 G7b5`,
  },
  {
    label: "Timing",
    description:
      "You can indicate simple timings to complicated ones with dotted notes and ties.",
    input: `C:1 C:2 C:4 C:8 C:16
C:1. C:2. C:4. C:8. C:16.
C:1_ C:2_ C:4_ C:8_ C:16_
C:1._ C:2._ C:4._ C:8._ C:16._
C:16,16,8 | C:16,16 | C:16,8. | C:8_3 | C:8,8,8,8 | C:8,16,16
C:8,8 | C:8.,16 | C:4_3 | C:16,16,16,16 | C:8,8,8 | C:16,16,16 | C:16,8,16`,
  },
  {
    label: "Rests",
    description: "The timing symbols can also be used to indicate rests.",
    input: `r:1 r:2 r:4 r:8 r:16
r:1. r:2. r:4. r:8. r:16.
r:1_ r:2_ r:4_ r:8_ r:16_
r:1._ r:2._ r:4._ r:8._ r:16._`,
  },
  {
    label: "Repetitions",
    description: "Use repetition symbols to save sheet space.",
    input: `[[: C | F | G | C :]]
[[: C | F | G | C :]]4`,
  },
  {
    label: "Comments",
    description: "Add comments to make you chord sheet more informative.",
    input: `'guitar [[: C | F | G | C :]]
'apostrophe' [[: C | F | G | C :]]
'double-quotes" [[: C | F | G | C :]]
'with_(parentheses) [[: C | F | G | C :]]
'synth_comes_in C | F | G | C
'whole_band_comes_in C | F | G | C`,
  },
  {
    label: "Sections",
    description: "Add sections of the song to better see its structure.",
    input: `[Intro] [[: C | F | G | C :]]
[Chorus] 'whole_band F G | C | F G | C`,
  },
  {
    label: "Labels",
    description:
      "Labels are used in pair with repetition symbols. It can also be used to add jumps to different parts of the song.",
    input: `[Intro] [[: "A. C | F | G | "1. C "2. Am C :]]
[[: C | F | G | C F | G C "To_A :]]`,
  },
  {
    label: "Double Bar Line",
    description:
      "Used to indicate a change in the piece either key , tempo, style etc.",
    input: `[Intro] [[: C:4,4,4,4 D:4,4,4,4 [[ E:4,4,4 | G#m:4,4,4 :]]`,
  },
  {
    label: "Bar Tie",
    description: "Extends a chord's timing to another bar.",
    input: `[Intro] C:4,4,4,4 [[_ x:4 F:4,4,4`,
  },
  {
    label: "Change Of Key",
    description:
      "Though invisible, this will help ChordPlus in transposing the chords.",
    input: `C D | Em F | Bb G C
[[ 'higher [[Eb Eb F | Gb G | A B`,
  },
];

// (() => {
//   const guides = [
//     {
//       label: "Chords",
//       description:
//         "Chords are displayed as is. Sharps (#) will be replaced with flats (b) if the new key has flats.",
//       input: `A B C D E F G
// Am7 Bdim7 C#m9b13 DM9 E11 Fm6 G7b5`,
//     },
//     {
//       label: "Timing",
//       description:
//         "You can indicate simple timings to complicated ones with dotted notes and ties.",
//       input: `C:1 C:2 C:4 C:8 C:16
// C:1. C:2. C:4. C:8. C:16.
// C:1_ C:2_ C:4_ C:8_ C:16_
// C:1._ C:2._ C:4._ C:8._ C:16._
// C:16,16,8 | C:16,16 | C:16,8. | C:8_3 | C:8,8,8,8 | C:8,16,16
// C:8,8 | C:8.,16 | C:4_3 | C:16,16,16,16 | C:8,8,8 | C:16,16,16 | C:16,8,16`,
//     },
//     {
//       label: "Rests",
//       description: "The timing symbols can also be used to indicate rests.",
//       input: `r:1 r:2 r:4 r:8 r:16
// r:1. r:2. r:4. r:8. r:16.
// r:1_ r:2_ r:4_ r:8_ r:16_
// r:1._ r:2._ r:4._ r:8._ r:16._`,
//     },
//     {
//       label: "Repetitions",
//       description: "Use repetition symbols to save sheet space.",
//       input: `[[: C | F | G | C :]]
// [[: C | F | G | C :]]4`,
//     },
//     {
//       label: "Comments",
//       description: "Add comments to make you chord sheet more informative.",
//       input: `'guitar [[: C | F | G | C :]]
// 'apostrophe' [[: C | F | G | C :]]
// 'double-quotes" [[: C | F | G | C :]]
// 'with_(parentheses) [[: C | F | G | C :]]
// 'synth_comes_in C | F | G | C
// 'whole_band_comes_in C | F | G | C`,
//     },
//     {
//       label: "Sections",
//       description: "Add sections of the song to better see its structure.",
//       input: `[Intro] [[: C | F | G | C :]]
// [Chorus] 'whole_band F G | C | F G | C`,
//     },
//     {
//       label: "Labels",
//       description:
//         "Labels are used in pair with repetition symbols. It can also be used to add jumps to different parts of the song.",
//       input: `[Intro] [[: "A. C | F | G | "1. C "2. Am C :]]
// [[: C | F | G | C F | G C "To_A :]]`,
//     },
//     {
//       label: "Double Bar Line",
//       description:
//         "Used to indicate a change in the piece either key , tempo, style etc.",
//       input: `[Intro] [[: C:4,4,4,4 D:4,4,4,4 [[ E:4,4,4 | G#m:4,4,4 :]]`,
//     },
//     {
//       label: "Bar Tie",
//       description: "Extends a chord's timing to another bar.",
//       input: `[Intro] C:4,4,4,4 [[_ x:4 F:4,4,4`,
//     },
//     {
//       label: "Change Of Key",
//       description:
//         "Though invisible, this will help ChordPlus in transposing the chords.",
//       input: `C D | Em F | Bb G C
// [[ 'higher [[Eb Eb F | Gb G | A B`,
//     },
//   ];

//   const guidesContainer = document.getElementById("guides");

//   guidesContainer.innerHTML = guides
//     .map((guide) => {
//       const chordSheet = generateChordSheet(guide.input, "C", "C");

//       return `
//         <div>
//           <h2>${guide.label}</h2>
//           ${guide.description ? `<p>${guide.description}</p>` : ""}
//           <div class="demo">
//             <div class="guide-input"><pre>${guide.input}</pre></div>
//             <div>${chordSheet}</div>
//           </div>
//         </div>`;
//     })
//     .join("");
// })();

import Nav from "./Nav";

export default function Syntax() {
  return (
    <>
      <Nav currentView="syntax" />
      <main>
        <section>
          {guides.map((guide) => {
            const chordSheet = generateChordSheet(guide.input, "C", "C");

            return (
              <div key={guide.label} className="my-6">
                <h2 className="text-lg font-bold">{guide.label}</h2>

                {guide.description && (
                  <p className="leading-relaxed">{guide.description}</p>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                  <div>
                    <pre className="font-code text-[20px] p-2 pt-5 leading-10 font-normal bg-gray-100 h-full overflow-x-auto">
                      {guide.input}
                    </pre>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: chordSheet }}
                    className="border-2 p-2 border-gray-100"
                  ></div>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
}
