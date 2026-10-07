/*
 * Parser class
 *
 * Convert text source code to object
 */

const Parser = {
  keys: [
    "C",
    "C#",
    "Db",
    "D",
    "D#",
    "Eb",
    "E",
    "F",
    "F#",
    "Gb",
    "G",
    "G#",
    "Ab",
    "A",
    "A#",
    "Bb",
    "B",
  ],
  flatKeys: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],
  sharpKeys: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
  noteNames: ["C", "D", "E", "F", "G", "A", "B"],
  keysWithFlats: ["C", "F", "Bb", "Eb", "Ab", "Db", "Gb"],
  symbolsLookup: ["[[:", "[[", "[[_", ":]]", "|"],
  notesDurationLookup: [
    "1",
    "2",
    "4",
    "8",
    "16",
    "1.",
    "2.",
    "4.",
    "8.",
    "16.",
    "1_",
    "2_",
    "4_",
    "8_",
    "16_",
    "1._",
    "2._",
    "4._",
    "8._",
    "16._",
    "8_3",
    "4_3",
  ],
  useFlats: false,
  steps: 0,
  transposeNote: function (note) {
    let indexOfKey = Parser.sharpKeys.indexOf(note);
    if (indexOfKey === -1) {
      indexOfKey = Parser.flatKeys.indexOf(note);
    }

    let indexOfNewKey = indexOfKey + Parser.steps;

    if (indexOfNewKey < 0) {
      indexOfNewKey = Parser.sharpKeys.length + indexOfNewKey;
    } else if (indexOfNewKey >= Parser.sharpKeys.length) {
      indexOfNewKey = indexOfNewKey - Parser.sharpKeys.length;
    }

    if (Parser.useFlats) {
      return Parser.flatKeys[indexOfNewKey];
    } else {
      return Parser.sharpKeys[indexOfNewKey];
    }
  },
  transposeChord: function (chord) {
    let currentNote = chord.substr(0, 1);

    if (Parser.noteNames.indexOf(currentNote) === -1)
      throw new Error("Error: Invalid note name --> " + currentNote);

    let chordType = chord.substr(1);
    const secondCharacter = chord.substr(1, 1);

    if (secondCharacter === "#") {
      currentNote += "#";
      chordType = chord.substr(2);
    } else if (secondCharacter === "b") {
      currentNote += "b";
      chordType = chord.substr(2);
    }

    currentNote = Parser.transposeNote(currentNote);

    chord = currentNote + chordType;

    // Transpose over key note
    if (chord.indexOf("/") > -1) {
      const overKey = chord.substr(chord.indexOf("/") + 1);

      // Check if note is a valid key
      if (Parser.keys.indexOf(overKey) === -1) {
        chord = chord.substr(0, chord.indexOf("/")) + "/" + overKey;
      } else {
        chord =
          chord.substr(0, chord.indexOf("/")) +
          "/" +
          Parser.transposeNote(overKey);
      }
    }

    return chord;
  },
  getItemType: function (value) {
    const firstCharacter = value.substr(0, 1);
    const lastCharacter = value.substr(value.length - 1, 1);
    const firstThreeCharacters = value.substr(0, 3);

    if (firstCharacter === "[" && lastCharacter === "]") {
      return {
        type: "section",
        value: value.substr(1, value.length - 2).replaceAll("_", " "),
      };
    } else if (Parser.symbolsLookup.indexOf(firstThreeCharacters) !== -1) {
      if (firstThreeCharacters === ":]]") {
        const times = value.length > 3 ? value.substr(3) : null;

        return {
          type: "repeat",
          value: firstThreeCharacters,
          times: parseInt(times) === 2 ? null : times,
        };
      }

      return {
        type: "symbol",
        value: value,
      };
    } else if (firstCharacter === '"') {
      return {
        type: "label",
        value: value.substr(1).replaceAll("_", " "),
      };
    } else if (firstCharacter === "'") {
      return {
        type: "comment",
        value: value.substr(1).replaceAll("_", " "),
      };
    } else if (value.substr(0, 2) === "[[") {
      // Update useflats
      const newKeyInLine = value.substr(2);
      Parser.useFlats = Parser.keysWithFlats.indexOf(newKeyInLine) > -1;
    } else if (firstCharacter === "(") {
      value = value.replaceAll("(", "").replaceAll(")", "");

      const splittedNotes = value.split(",");
      const noteSeries = [];

      splittedNotes.forEach(function (splittedValue) {
        if (Parser.steps !== 0 || Parser.useFlats) {
          noteSeries.push(Parser.transposeNote(splittedValue));
        } else {
          noteSeries.push(splittedValue);
        }
      });

      return {
        type: "chord",
        value: "(" + noteSeries.join(",") + ")",
      };
    } else {
      let chord = value;
      let timing = null;
      let type = "chord";

      const hasTiming = chord.indexOf(":") !== -1;

      if (hasTiming) {
        const splittedValue = value.split(":");

        chord = splittedValue[0];
        timing = splittedValue[1];
        timing = timing.split(",").map(function (item) {
          if (Parser.notesDurationLookup.indexOf(item) === -1)
            throw new Error("Error: Invalid note duration --> " + item);

          return item;
        });

        if (chord === "r") type = "rest";
      }

      return {
        type: type,
        value: (function () {
          if (chord === "x" || chord === "r") return null;
          else if (chord === "%") return chord;
          else return Parser.transposeChord(chord);
        })(),
        timing: timing,
      };
    }

    return {
      type: null,
      value: null,
    };
  },
  parse: function (sourceCode, key, newKey) {
    Parser.steps = 0;
    Parser.useFlats = false;

    if (typeof key === "undefined" || key === "" || !key) {
      key = "C";
      Parser.useFlats = true;
    }

    if (Parser.keys.indexOf(key) === -1) {
      throw new Error("Error: Invalid value for key --> " + key);
    }

    // Parse song body
    let indexOfKey = Parser.sharpKeys.indexOf(key);
    if (indexOfKey === -1) {
      indexOfKey = Parser.flatKeys.indexOf(key);
    }

    if (typeof newKey !== "undefined" && newKey !== "" && newKey) {
      if (Parser.keys.indexOf(newKey) === -1) {
        throw new Error("Error: Invalid value for new key --> " + key);
      }

      let indexOfNewKey = Parser.sharpKeys.indexOf(newKey);
      if (indexOfNewKey === -1) {
        indexOfNewKey = Parser.flatKeys.indexOf(newKey);
      }

      // Calculate semitone steps
      Parser.steps = indexOfNewKey - indexOfKey;

      // Determine if flat notes should be used
      Parser.useFlats = Parser.keysWithFlats.indexOf(newKey) > -1;

      if (Parser.steps !== 0 || Parser.useFlats) {
        key = Parser.transposeNote(key);
      }
    }

    const songBodyItems = sourceCode.trim().split(" ");
    const songBody = [];

    songBodyItems.forEach(function (value) {
      if (value === "") {
        return;
      }

      // Check for line break
      if ((value.match(/\s*[\r\n]+\s*/g) || []).length) {
        const values = value.trim().split(/\s*[\r\n]+\s*/g);

        values.forEach(function (value, index) {
          songBody.push(Parser.getItemType(value));

          if (index < values.length - 1) {
            songBody.push({ type: "break" });
          }
        });
      } else {
        songBody.push(Parser.getItemType(value));
      }
    });

    return songBody;
  },
};

export default Parser;
