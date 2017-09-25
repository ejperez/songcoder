(function ($) {
	$(document).ready(function () {
		var songForm = $('#songForm');
		var source = $('#source');
		var newKey = $('#newKey');
		var song = new Song();
		var printer = new Printer();
		var previewContainer = $('#previewContainer');

		var render = function () {
			song.parse(source.val(), newKey.val());
			return printer.render(song);
		};

		songForm.on('submit', function (e) {
			e.preventDefault();

			var rendered = render();

			var newWindow = window.open();
			newWindow.document.write(rendered);
			newWindow.document.close();
		});
	});
})(jQuery);