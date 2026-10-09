import assert from "assert";
import Parser from "../lib/parser.js";

var tests = [
  {
    title: "Section with chords",
    test: function () {
      var testString = "[Intro] C G";
      var result = Parser.parse(testString);

      assert(result[0].type === "section", "First item must be a section");
      assert(result[1].type === "chord", "Second item must be a chord");
      assert(result[2].type === "chord", "Third item must be a chord");
    },
  },
  {
    title: "Symbols and Repetition",
    test: function () {
      var testString = "[[: | [[ [[_  :]]3 :]]2";
      var result = Parser.parse(testString);

      assert(result[0].type === "symbol", "First item must be a symbol");
      assert(result[1].type === "symbol", "Second item must be a symbol");
      assert(result[2].type === "symbol", "Third item must be a symbol");
      assert(result[3].type === "symbol", "Fourth item must be a symbol");
      assert(result[4].type === "repeat", "Fifth item must be a repeat");
      assert(result[4].times === "3", "Fifth item repeat must be 3");
      assert(result[5].type === "repeat", "Sixth item must be a repeat");
      assert(result[5].times === null, "Sixth item repeat must be null");
    },
  },
  {
    title: "Labels and Comments",
    test: function () {
      var testString = "\"This-is-a-label '(This-is-a-comment)";
      var result = Parser.parse(testString);

      assert(result[0].type === "label", "First item must be a label");
      assert(result[0].value.indexOf("-"), "Hypens must be replaced");
      assert(result[1].type === "comment", "Second item must be a comment");
      assert(result[1].value.indexOf("-"), "Hypens must be replaced");
    },
  },
  {
    title: "Transpose Up",
    test: function () {
      var testString = "C Dm Em F G A Bdim";
      var result = Parser.parse(testString, "C", "D");
      var stringResult = result
        .map(function (item) {
          return item.value;
        })
        .join(" ");
      var expectedResult = "D Em F#m G A B C#dim";

      assert(stringResult === expectedResult, "Should be " + expectedResult);
    },
  },
  {
    title: "Transpose Down",
    test: function () {
      var testString = "C Dm Em F G A Bdim";
      var result = Parser.parse(testString, "C", "Bb");
      var stringResult = result
        .map(function (item) {
          return item.value;
        })
        .join(" ");
      var expectedResult = "Bb Cm Dm Eb F G Adim";

      assert(stringResult === expectedResult, "Should be " + expectedResult);
    },
  },
  {
    title: "Invalid Timing",
    test: function () {
      assert.throws(
        function () {
          var testString =
            "C:1,2,4,8,16,1.,2.,4.,8.,16.,1_,2_,4_,8_,16_,1._,2._,4._,8._,16._,12";
          Parser.parse(testString);
        },
        /Invalid note duration/,
        "Should throw invalid note duration",
      );
    },
  },
  {
    title: "Invalid Note",
    test: function () {
      assert.throws(
        function () {
          var testString = "A B C D E F G x r H";
          Parser.parse(testString);
        },
        /Invalid note name/,
        "Should throw invalid note name",
      );
    },
  },
  {
    title: "Invalid Key",
    test: function () {
      assert.throws(
        function () {
          var testString = "C | F G | C";
          Parser.parse(testString, "C$");
        },
        /Invalid value for key/,
        "Should throw invalid value for key",
      );
    },
  },
  {
    title: "Invalid New Key",
    test: function () {
      assert.throws(
        function () {
          var testString = "C | F G | C";
          Parser.parse(testString, "C", "D$");
        },
        /Invalid value for new key/,
        "Should throw invalid value for new key",
      );
    },
  },
  {
    title: "Line Breaks",
    test: function () {
      var testString = "[Intro] C\r\nDm:16,16,16 Em";
      var result = Parser.parse(testString);

      assert(result[2].type === "break", "Third item should be a break");
    },
  },
  {
    title: "Key Change",
    test: function () {
      var testString = "[Intro] C D Em | [[F F G Am";
      var result = Parser.parse(testString);

      assert(result[5].type === null, "Sixth item should be null");
    },
  },
  {
    title: "Key of C uses flat chords",
    test: function () {
      var testString = "A# Bb";
      var result = Parser.parse(testString);
      assert(result[0].value === "Bb", "First chord should be Bb");
    },
  },
  {
    title: "% Sign",
    test: function () {
      var testString = "[Intro] C | % | % | %";
      var result = Parser.parse(testString);
      assert(result[3].value === "%", "Fourth item should be %");
    },
  },
  {
    title: "Key of C uses flat chords",
    test: function () {
      var testString = "A# Bb";
      var result = Parser.parse(testString);
      console.log(result);
    },
  },
];

for (var key in tests) {
  var test = tests[key];

  test.test();
  console.log("TEST " + (parseInt(key) + 1) + ": " + test.title + " PASSED");
}
