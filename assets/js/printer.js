/**
 * Created by STOK-Comp3 on 30/05/2017.
 */
function Printer() {
	this.render = function (song) {
		var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">';
		html += '<title>' + song.title + ' by ' + song.artists + '</title><link rel="stylesheet" href="/assets/css/print.css"/></head><body>';

		html += '<table cellspacing="0" id="header" class="full-width"><tr><td colspan="4" style="width: 100%;border-bottom:solid thin black">';
		html += '<h2 id="title">' + song.title + ' - ' + song.artists + '</h2></td></tr><tr>';
		html += '<td width="12%">Tempo: ' + song.bpm + '</td>';
		html += '<td width="12%">Meter: ' + song.meter + '</td>';
		html += '<td width="10%">Key: ' + song.key + '</td>';
		html += '<td width="56%">' + song.comment + '</td>';
		html += '</tr></table>';

		song.body.forEach(function (value) {
			html += '<table cellspacing="0" border="0" style="padding-top: ' + value.hasLabels ? '20' : '15' + 'px"><tbody><tr>';

			html += '</tr></tbody></table>';
		});

		html += '</body></html>';

		return html;
	};
}
