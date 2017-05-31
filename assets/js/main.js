(function ($) {
	$(document).ready(function () {
		var songForm = $('#songForm');
		var source = $('#source');
		var newKey = $('#newKey');
		var song = new Song();
		var printer = new Printer();

		songForm.on('submit', function (e) {
			e.preventDefault();
			song.parse(source.val(), newKey.val());
			console.log(song);
			var rendered = printer.render(song);
			var newWindow = window.open();
			newWindow.document.write(rendered);
			newWindow.document.close();
		});
	});
})(jQuery);