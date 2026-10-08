//#region lib/parser.js
var e = {
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
		"B"
	],
	flatKeys: [
		"C",
		"Db",
		"D",
		"Eb",
		"E",
		"F",
		"Gb",
		"G",
		"Ab",
		"A",
		"Bb",
		"B"
	],
	sharpKeys: [
		"C",
		"C#",
		"D",
		"D#",
		"E",
		"F",
		"F#",
		"G",
		"G#",
		"A",
		"A#",
		"B"
	],
	noteNames: [
		"C",
		"D",
		"E",
		"F",
		"G",
		"A",
		"B"
	],
	keysWithFlats: [
		"C",
		"F",
		"Bb",
		"Eb",
		"Ab",
		"Db",
		"Gb"
	],
	symbolsLookup: [
		"[[:",
		"[[",
		"[[_",
		":]]",
		"|"
	],
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
		"4_3"
	],
	useFlats: !1,
	steps: 0,
	transposeNote: function(t) {
		let n = e.sharpKeys.indexOf(t);
		n === -1 && (n = e.flatKeys.indexOf(t));
		let r = n + e.steps;
		return r < 0 ? r = e.sharpKeys.length + r : r >= e.sharpKeys.length && (r -= e.sharpKeys.length), e.useFlats ? e.flatKeys[r] : e.sharpKeys[r];
	},
	transposeChord: function(t) {
		let n = t.substr(0, 1);
		if (e.noteNames.indexOf(n) === -1) throw Error("Error: Invalid note name --> " + n);
		let r = t.substr(1), i = t.substr(1, 1);
		if (i === "#" ? (n += "#", r = t.substr(2)) : i === "b" && (n += "b", r = t.substr(2)), n = e.transposeNote(n), t = n + r, t.indexOf("/") > -1) {
			let n = t.substr(t.indexOf("/") + 1);
			t = e.keys.indexOf(n) === -1 ? t.substr(0, t.indexOf("/")) + "/" + n : t.substr(0, t.indexOf("/")) + "/" + e.transposeNote(n);
		}
		return t;
	},
	getItemType: function(t) {
		let n = t.substr(0, 1), r = t.substr(t.length - 1, 1), i = t.substr(0, 3);
		if (n === "[" && r === "]") return {
			type: "section",
			value: t.substr(1, t.length - 2).replaceAll("_", " ")
		};
		if (e.symbolsLookup.indexOf(i) !== -1) {
			if (i === ":]]") {
				let e = t.length > 3 ? t.substr(3) : null;
				return {
					type: "repeat",
					value: i,
					times: parseInt(e) === 2 ? null : e
				};
			}
			return {
				type: "symbol",
				value: t
			};
		}
		if (n === "\"") return {
			type: "label",
			value: t.substr(1).replaceAll("_", " ")
		};
		if (n === "'") return {
			type: "comment",
			value: t.substr(1).replaceAll("_", " ")
		};
		if (t.substr(0, 2) === "[[") {
			let n = t.substr(2);
			e.useFlats = e.keysWithFlats.indexOf(n) > -1;
		} else if (n === "(") {
			t = t.replaceAll("(", "").replaceAll(")", "");
			let n = t.split(","), r = [];
			return n.forEach(function(t) {
				e.steps !== 0 || e.useFlats ? r.push(e.transposeNote(t)) : r.push(t);
			}), {
				type: "chord",
				value: "(" + r.join(",") + ")"
			};
		} else {
			let n = t, r = null, i = "chord";
			if (n.indexOf(":") !== -1) {
				let a = t.split(":");
				n = a[0], r = a[1], r = r.split(",").map(function(t) {
					if (e.notesDurationLookup.indexOf(t) === -1) throw Error("Error: Invalid note duration --> " + t);
					return t;
				}), n === "r" && (i = "rest");
			}
			return {
				type: i,
				value: (function() {
					return n === "x" || n === "r" ? null : n === "%" ? n : e.transposeChord(n);
				})(),
				timing: r
			};
		}
		return {
			type: null,
			value: null
		};
	},
	parse: function(t, n, r) {
		if (e.steps = 0, e.useFlats = !1, (n === void 0 || n === "" || !n) && (n = "C", e.useFlats = !0), e.keys.indexOf(n) === -1) throw Error("Error: Invalid value for key --> " + n);
		let i = e.sharpKeys.indexOf(n);
		if (i === -1 && (i = e.flatKeys.indexOf(n)), r !== void 0 && r !== "" && r) {
			if (e.keys.indexOf(r) === -1) throw Error("Error: Invalid value for new key --> " + n);
			let t = e.sharpKeys.indexOf(r);
			t === -1 && (t = e.flatKeys.indexOf(r)), e.steps = t - i, e.useFlats = e.keysWithFlats.indexOf(r) > -1, (e.steps !== 0 || e.useFlats) && (n = e.transposeNote(n));
		}
		let a = t.trim().split(" "), o = [];
		return a.forEach(function(t) {
			if (t !== "") {
				if ((t.match(/\s*[\r\n]+\s*/g) || []).length) {
					let n = t.trim().split(/\s*[\r\n]+\s*/g);
					n.forEach(function(t, r) {
						o.push(e.getItemType(t)), r < n.length - 1 && o.push({ type: "break" });
					});
				} else o.push(e.getItemType(t));
			}
		}), o;
	}
}, t = {
	dot: "<span class=\"dot\">.</span>",
	format: function(e) {
		for (let n = 0; n < e.length; n++) if (e[n].type === "symbol" || e[n].type === "repeat") {
			if (!t.symbolsLookup.hasOwnProperty(e[n].value)) continue;
			e[n].value = t.symbolsLookup[e[n].value];
		} else if (e[n].type === "chord") {
			if (!e[n].timing) continue;
			let r = e[n].timing.join(",");
			if (t.beamsLookup.hasOwnProperty(r)) e[n].timing = t.beamsLookup[r];
			else {
				let r = [];
				e[n].timing.forEach(function(e) {
					t.notesDurationLookup.hasOwnProperty(e) && r.push(t.notesDurationLookup[e]);
				}), e[n].timing = r.join("");
			}
		} else if (e[n].type === "rest") {
			if (!e[n].timing) continue;
			let r = [];
			e[n].timing.forEach(function(e) {
				t.restsDurationLookup.hasOwnProperty(e) && r.push(t.restsDurationLookup[e]);
			}), e[n].timing = r.join("");
		}
		return e;
	}
};
t.symbolsLookup = {
	"[[:": "{",
	"[[": "\"",
	"[[_": "V",
	":]]": "}",
	"|": "\\"
}, t.notesDurationLookup = {
	1: "w",
	2: "h",
	4: "q",
	8: "e",
	16: "s",
	"1.": "R",
	"2.": "d",
	"4.": "j",
	"8.": "i",
	"16.": "s" + t.dot,
	"1_": "wU",
	"2_": "hU",
	"4_": "qU",
	"8_": "eU",
	"16_": "sU",
	"1._": "RU",
	"2._": "dU",
	"4._": "jU",
	"8._": "iU",
	"16._": "s" + t.dot + "U"
}, t.restsDurationLookup = {
	1: "W",
	2: "H",
	4: "Q",
	8: "E",
	16: "S",
	"1.": "W" + t.dot,
	"2.": "D",
	"4.": "J",
	"8.": "I",
	"16.": "S" + t.dot,
	"1_": "WU",
	"2_": "HU",
	"4_": "QU",
	"8_": "EU",
	"16_": "SU",
	"1._": "W" + t.dot + "U",
	"2._": "DU",
	"4._": "JU",
	"8._": "IU",
	"16._": "S" + t.dot + "U"
}, t.beamsLookup = {
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
	"16,8,16": "¾"
};
//#endregion
//#region lib/renderer.js
var n = {
	escapeHTML(e) {
		return String(e).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
	},
	render(e) {
		return `
        <div class="songcoder">
            ${e.map((e) => e.type ? e.type === "break" ? "<div></div>" : `
                <div class="songcoder__item ${e.type === "section" ? "songcoder__item--section" : ""}">
                    ${e.type === "section" ? `<div class="songcoder__section">${this.escapeHTML(e.value)}</div>` : ""}

                    <div class="songcoder__item-container">
                        ${e.type === "chord" ? `
                        <div class="songcoder__item-content chord">
                            <div class="chord-value">${e.value ? e.value : "&nbsp;"}</div>

                            ${e.timing ? `
                            <div class="timing">${e.timing}</div>
                            ` : ""}
                        </div>
                        ` : ""}

                        ${e.type === "symbol" || e.type === "repeat" ? `
                            <span class="songcoder__item-content symbol">${this.escapeHTML(e.value)}</span>
                            ` : ""}

                        ${e.type === "comment" ? `
                            <span class="songcoder__item-content comment">${this.escapeHTML(e.value)}</span>
                            ` : ""}

                        ${e.type === "label" ? `
                            <span class="songcoder__item-content label">${this.escapeHTML(e.value)}</span>
                            ` : ""}

                        ${e.times ? `
                            <span class="songcoder__item-content repeat">x${this.escapeHTML(e.times)}</span>
                            ` : ""}

                        ${e.type === "rest" ? `
                            <span class="songcoder__item-content chord">
							    <div class="timing timing--rest">${e.timing}</div>
						    </span>
                            ` : ""}
                    </div>
                </div>` : "").join("")}
        </div>
    `;
	}
}, r = (r, i, a) => {
	let o = e.parse(r, i, a), s = t.format(o);
	return n.render(s);
}, i = e.keys;
//#endregion
export { r as generateChordSheet, i as keys };
