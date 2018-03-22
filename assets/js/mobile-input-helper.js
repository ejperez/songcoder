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

		// Add style
		var head = document.head || document.getElementsByTagName( 'head' )[0];
		var css = '.js-toolbar-mobile-helper { background: #fff; height: 45px; width: 100%;} .js-toolbar-mobile-helper .buttons { overflow: auto; white-space: nowrap; text-align: center;}';
		var style = document.createElement( 'style' );
		style.type = 'text/css';

		if ( style.styleSheet ) {
			style.styleSheet.cssText = css;
		} else {
			style.appendChild( document.createTextNode( css ) );
		}

		head.appendChild( style );

		// Add html
		target.after( '<div class="text-center container-fluid js-toolbar-mobile-helper visible-xs"><div class="row"><div class="buttons col-xs-12">' + buttons + '</div></div></div><br>' );

		$( '.js-btn-insert' ).click( function () {
			insertAtCursorPosition( target, $( this ).val() );
		} );
	};
} )( jQuery );