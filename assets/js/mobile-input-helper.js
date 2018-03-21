var MobileInputHelper = {};

( function () {
	var symbols = ['[', ']', '|', '/', '#', ':', '-', '_', '(', ')'];

	$.fn.isInViewport = function () {
		var elementTop = $( this ).offset().top;
		var elementBottom = elementTop + $( this ).outerHeight();
		var viewportTop = $( window ).scrollTop();
		var viewportBottom = viewportTop + $( window ).height();
		return elementBottom > viewportTop && elementTop < viewportBottom;
	};

	var insertAtCursorPosition = function ( field, value ) {
		// Get cursor position
		var cursorPosition = field.prop( 'selectionStart' );

		// Get current text
		var text = field.val();

		// Slice the current text
		var textBefore = text.substring( 0, cursorPosition );
		var textAfter = text.substring( cursorPosition, text.length );

		// Replace current text
		field.val( textBefore + value + textAfter );

		// Restore cursor position
		field.prop( 'selectionStart', cursorPosition + value.length );
		field.prop( 'selectionEnd', cursorPosition + value.length );
		field.focus();
	};

	MobileInputHelper.init = function ( target ) {

		target = $( target );

		// Populate fields
		var buttons = '';
		$.each( symbols, function ( index, value ) {
			buttons += '<button class="btn btn-default js-btn-insert" type="button" value="' + value + '">' + value + '</button>';
		} );

		// Add html
		target.after( '<div class="text-center container-fluid js-toolbar-mobile-helper visible-xs"><div class="row"><div class="buttons col-xs-12">' + buttons + '</div></div></div><br>' );

		$( '.js-btn-insert' ).click( function () {
			insertAtCursorPosition( target, $( this ).val() );
		} );
	};
} )( jQuery );