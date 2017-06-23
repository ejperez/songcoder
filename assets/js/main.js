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

		var loadPreview = function () {
			previewContainer.html('<iframe id="preview"></iframe>');
			var iframe = document.getElementById('preview');
			var doc = iframe.contentDocument || iframe.contentWindow.document;
			doc.write(render());
			doc.close();

		};

		songForm.on('submit', function (e) {
			e.preventDefault();

			var rendered = render();

			var newWindow = window.open();
			newWindow.document.write(rendered);
			newWindow.document.close();
		});

		source.on('keyup paste', debounce(loadPreview, 1000));

		newKey.on('change', loadPreview);
	});
})(jQuery);