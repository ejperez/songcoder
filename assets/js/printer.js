/**
 * Created by STOK-Comp3 on 30/05/2017.
 */
function Printer() {
	this.render = function (song) {
		var dot = '<span class="dot">.</span>';

		var beforeLookup = {
			'[[:': '{',
			'[[': '"',
			'[[_': 'V'
		};

		var notesDurationLookup = {
			'1': 'w',
			'2': 'h',
			'4': 'q',
			'8': 'e',
			'16': 's',
			'1.': 'R',
			'2.': 'd',
			'4.': 'j',
			'8.': 'i',
			'16.': 's' + dot,
			'1_': 'wU',
			'2_': 'hU',
			'4_': 'qU',
			'8_': 'eU',
			'16_': 'sU',
			'1._': 'RU',
			'2._': 'dU',
			'4._': 'jU',
			'8._': 'iU',
			'16._': 's' + dot + 'U'
		};

		var restsDurationLookup = {
			'1': 'W',
			'2': 'H',
			'4': 'Q',
			'8': 'E',
			'16': 'S',
			'1.': 'W' + dot,
			'2.': 'D',
			'4.': 'J',
			'8.': 'I',
			'16.': 'S' + dot,
			'1_': 'WU',
			'2_': 'HU',
			'4_': 'QU',
			'8_': 'EU',
			'16_': 'SU',
			'1._': 'W' + dot + 'U',
			'2._': 'DU',
			'4._': 'JU',
			'8._': 'IU',
			'16._': 'S' + dot + 'U'
		};

		var beamsLookup = {
			'16,16,8': 'M',
			'16,16': 'N',
			'16,8.': 'O',
			'8_3': 'T',
			'8,8,8,8': 'Y',
			'8,16,16': 'm',
			'8,8': 'n',
			'8.,16': 'o',
			'4_3': 't',
			'16,16,16,16': 'y',
			'8,8,8': '§',
			'16,16,16': '³',
			'16,8,16': '¾'
		};

		var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">';
		html += '<title>' + song.title + ' by ' + song.artists + '</title>';
		html += '<link rel="stylesheet" href="dist/css/print.min.css"/>';
		html += '</head>';
		html += '<body>';

		html += '<table cellspacing="0" id="header" class="full-width">';
		html += '<tr>';
		html += '<td colspan="4" style="width: 100%;border-bottom:solid thin black">';
		html += '<h2 id="title">' + song.title + ' - ' + song.artists + '</h2>';
		html += '</td>';
		html += '</tr>';
		html += '<tr>';
		html += '<td width="12%">Tempo: ' + song.bpm + '</td>';
		html += '<td width="12%">Meter: ' + song.meter + '</td>';
		html += '<td width="10%">Key: ' + song.key + '</td>';
		html += '<td width="56%">' + song.comment + '</td>';
		html += '</tr></table>';

		song.body.lines.forEach(function (line, lineIndex) {
			html += '<table cellspacing="0" border="0" style="padding-top: ' + (line.hasLabels ? '15' : '10') + 'px">';
			html += '<tbody>';
			html += '<tr>';
			
			var lastBarHasRepeat = false;

			line.bars.forEach(function (bar, barIndex) {
				html += '<td style="vertical-align: top; padding-right: 5px;">';
				html += '<table cellspacing="0" border="0" class="full-width">';
				html += '<tbody>';

				// Print labels
				if (line.hasLabels) {
					html += '<tr>';
					if (bar.hasOwnProperty('left_label')) {
						html += '<td colspan="3"><span style="font-weight: bold">' + bar.left_label + '</span></td>';
					} else if (bar.hasOwnProperty('right_label')) {
						html += '<td colspan="3" class="right">' + bar.right_label + '</td>';
					} else {
						html += '<td colspan="3">&nbsp;</td>';
					}
					html += '</tr>';
				}

				// Print comments
				if (line.hasComments) {
					html += '<tr>';
					if (bar.hasOwnProperty('left_comment')) {
						html += '<td colspan="3" class="comment">' + bar.left_comment + '</td>';
					} else if (bar.hasOwnProperty('right_comment')) {
						html += '<td colspan="3" class="right comment">' + bar.right_comment + '</td>';
					} else {
						html += '<td colspan="3" class="comment">&nbsp;</td>';
					}
					html += '</tr>';
				}

				// Print bar chords, lines and timings
				html += '<tr>';

				if (bar.hasOwnProperty('before')) {
					html += '<td class="bar-line">' + beforeLookup[bar.before] + '</td>';
				} else {
					if (lastBarHasRepeat) {
						lastBarHasRepeat = false;
					} else {
						html += '<td class="bar-line">\\</td>';
					}
				}

				html += '<td>';
				html += '<table cellspacing="0" border="0" width="100%">';
				html += '<tbody>';
				html += '<tr>';

				bar.items.forEach(function (item) {
					html += '<td style="padding-right: 5px;">';
					html += '<table cellspacing="0" border="0">';
					html += '<tbody>';

					if (item.chord !== 'r') {
						html += '<tr>';
						html += '<td class="chord">' + (item.chord === 'x' ? '&nbsp;' : item.chord) + '</td>';
						html += '</tr>';
					}

					html += '<tr>';

					var timings = '';
					if (item.hasOwnProperty('timing')) {
						if (item.chord !== 'r' && beamsLookup.hasOwnProperty(item.timing)) {
							timings += beamsLookup[item.timing];
						} else {
							var splittedTimings = item.timing.split(',');
							
							splittedTimings.forEach(function (timing) {
								if (item.chord === 'r') {
									if (restsDurationLookup.hasOwnProperty(timing)) {
										timings += restsDurationLookup[timing];
									}						
								} else {
									if (notesDurationLookup.hasOwnProperty(timing)) {
										timings += notesDurationLookup[timing];
									}
								}
							});
						}						
					} else {
						if (item.chord === 'r') {
							timings = 'W';
						}
					}

					if (timings !== '') {
						html += '<td class="chord-timing" border="1">' + timings + '</td>';
					}					

					html += '</tr>';

					html += '</tbody>';
					html += '</table>';
					html += '</td>';
				});

				html += '</tr>';
				html += '</tbody>';
				html += '</table>';
				html += '</td>';

				if (bar.hasOwnProperty('after')) {
					if (bar.after.substr(0, 3) === ':]]') {
						
						lastBarHasRepeat = true;
						
						if (bar.after.length > 3) {
							var times = bar.after.substr(3);
							html += '<td class="bar-line bar-line-after" style="width: 60px;">}<span style="font-family: Arial; font-size: 12pt"> x ' + times + '</span></td>';
						} else {
							html += '<td class="bar-line bar-line-after">}</td>';
						}
					}
				} else if (barIndex === (line.bars.length - 1)) {
					if (lineIndex === (song.body.lines - 1)) {
						html += '<td class="bar-line bar-line-after">]</td>';
					} else {
						html += '<td class="bar-line bar-line-after">\\</td>';
					}
				}

				html += '</tr>';

				html += '</tbody>';
				html += '</table>';
				html += '</td>';
			});

			html += '</tr>';
			html += '</tbody>';
			html += '</table>';
		});

		html += '</body></html>';

		return html;
	};
}
