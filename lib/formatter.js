/*
 * Formatter class
 *
 * Convert parsed song body to HTML
 */

const Formatter = {
  dot: '<span class="dot">.</span>',
  format: function (songBody) {
    for (let i = 0; i < songBody.length; i++) {
      if (songBody[i].type === "symbol" || songBody[i].type === "repeat") {
        if (!Formatter.symbolsLookup.hasOwnProperty(songBody[i].value))
          continue;

        songBody[i].value = Formatter.symbolsLookup[songBody[i].value];
      } else if (songBody[i].type === "chord") {
        if (!songBody[i].timing) continue;

        const timings = songBody[i].timing.join(",");

        if (Formatter.beamsLookup.hasOwnProperty(timings)) {
          songBody[i].timing = Formatter.beamsLookup[timings];
        } else {
          const newTimings = [];

          songBody[i].timing.forEach(function (item) {
            if (Formatter.notesDurationLookup.hasOwnProperty(item)) {
              newTimings.push(Formatter.notesDurationLookup[item]);
            }
          });

          songBody[i].timing = newTimings.join("");
        }
      } else if (songBody[i].type === "rest") {
        if (!songBody[i].timing) continue;

        const newTimings = [];

        songBody[i].timing.forEach(function (item) {
          if (Formatter.restsDurationLookup.hasOwnProperty(item)) {
            newTimings.push(Formatter.restsDurationLookup[item]);
          }
        });

        songBody[i].timing = newTimings.join("");
      }
    }

    return songBody;
  },
};

/*
 * Declare lookup properties
 */
Formatter.symbolsLookup = {
  "[[:": "{",
  "[[": '"',
  "[[_": "V",
  ":]]": "}",
  "|": "\\",
};

Formatter.notesDurationLookup = {
  1: "w",
  2: "h",
  4: "q",
  8: "e",
  16: "s",
  "1.": "R",
  "2.": "d",
  "4.": "j",
  "8.": "i",
  "16.": "s" + Formatter.dot,
  "1_": "wU",
  "2_": "hU",
  "4_": "qU",
  "8_": "eU",
  "16_": "sU",
  "1._": "RU",
  "2._": "dU",
  "4._": "jU",
  "8._": "iU",
  "16._": "s" + Formatter.dot + "U",
};

Formatter.restsDurationLookup = {
  1: "W",
  2: "H",
  4: "Q",
  8: "E",
  16: "S",
  "1.": "W" + Formatter.dot,
  "2.": "D",
  "4.": "J",
  "8.": "I",
  "16.": "S" + Formatter.dot,
  "1_": "WU",
  "2_": "HU",
  "4_": "QU",
  "8_": "EU",
  "16_": "SU",
  "1._": "W" + Formatter.dot + "U",
  "2._": "DU",
  "4._": "JU",
  "8._": "IU",
  "16._": "S" + Formatter.dot + "U",
};

Formatter.beamsLookup = {
  "16,16,8": "M",
  "16,16": "N",
  "16,8.": "O",
  "8_3": "T",
  "8,8,8,8": "Y",
  "8,16,16": "m",
  "8,8": "n",
  "8.,16": "o",
  "4_3": "t",
  "16,16,16,16": "y",
  "8,8,8": "§",
  "16,16,16": "³",
  "16,8,16": "¾",
};

export default Formatter;
