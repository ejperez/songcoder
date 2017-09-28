(function ($) {
	$(document).ready(function () {
		var songForm = $('#songForm');
		var source = $('#source');
		var newKey = $('#newKey');
		var song = new Song();
		var printer = new Printer();
		var previewContainer = $('#previewContainer');
		var printContainer = $('#print');

		songForm.on('submit', function (e) {
			e.preventDefault();

			// Render the song body
			song.parse(source.val(), newKey.val());
			var rendered = printer.render(song);
			printContainer.html(rendered);

			// Change document title
			document.title = song.title + ' by ' + song.artists + ' in ' + song.key;

			// Print the parsed content
			window.print();
		});
	});
})(jQuery);