var SongCoder = {};

( function ( $ ) {
	var songBody = $( '#js-song-body' );

	SongCoder.init = function () {

		MobileInputHelper.init( '.source-code' );

		$( '#song-form' ).submit( function () {
			var sourceCode, key, newKey, title, artists;
			var serializedData = $( this ).serializeArray();

			serializedData.forEach( function ( item ) {

				if ( item.name === 'key' ) {
					key = item.value;
				}

				if ( item.name === 'newKey' ) {
					newKey = item.value;

					if ( newKey ) {
						$( '#js-song-key' ).html( newKey );
					}

					return;
				}

				if ( item.name === 'sourceCode' ) {
					sourceCode = item.value;

					return;
				}

				if ( item.name === 'title' ) {
					title = item.value;
				}

				if ( item.name === 'artists' ) {
					artists = item.value;
				}

				$( '#js-song-' + item.name ).html( item.value );
			} );

			try {
				songBody.html( ChordPlus.getHTML( sourceCode, key, newKey ) );
			} catch ( e ) {
				alert( e.message );
			}

			document.title = title + ' by ' + artists + ' | Song Coder';

			return false;
		} );
	};

	$( SongCoder.init );
} )( jQuery );