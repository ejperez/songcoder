(function ($) {
	$(document).ready(function () {
		var songForm = $('#songForm');
		var printContainer = $('#print');
		var song = new Song();
		var printer = new Printer();

		songForm.on('submit', function (e) {
			e.preventDefault();

			// Get form data
			var formData = $(this).serializeArray();
			var source;
			var mode;
			var newKey;

			formData.forEach(function(item) {
				if (item.name === 'source') {
					source = item.value;
				} else if (item.name === 'mode') {
					mode = item.value;
				}  else if (item.name === 'new_key') {
					newKey = item.value;
				}
			});

			// Render the song body
			song.parse(source, mode, newKey);
			var rendered = printer.render(song);
			printContainer.html(rendered);

			// Change document title
			var title;
			if (mode === 'traditional') {
				document.title = song.title + ' by ' + song.artists + ' in ' + song.key;
			} else {
				document.title = song.title + ' by ' + song.artists;
			}			

			// Print the parsed content
			window.print();
		});
	});
})(jQuery);