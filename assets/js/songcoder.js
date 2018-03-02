/*
 * SongCoder class
 * 
 * Responsible for transforming text source code to JS object
 */

var SongCoder = {
	keys: ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'],
	flatKeys: ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
	sharpKeys: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
	noteNames: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
	keysWithFlats: ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'],
	dot: '<span class="dot">.</span>',
	useFlats: false,
	steps: 0,
	transposeNote: function ( note ) {

		var indexOfKey = SongCoder.sharpKeys.indexOf( note );
		if ( indexOfKey === -1 ) {
			indexOfKey = SongCoder.flatKeys.indexOf( note );
		}

		var indexOfNewKey = indexOfKey + SongCoder.steps;

		if ( indexOfNewKey < 0 ) {
			indexOfNewKey = SongCoder.sharpKeys.length + indexOfNewKey;
		} else if ( indexOfNewKey >= SongCoder.sharpKeys.keys.length ) {
			indexOfNewKey = indexOfNewKey - SongCoder.sharpKeys.keys.length;
		}

		if ( SongCoder.useFlats ) {
			return SongCoder.flatKeys[indexOfNewKey];
		} else {
			return SongCoder.sharpKeys[indexOfNewKey];
		}
	},
	transposeChord: function ( chord ) {

		var currentNote = chord.substr( 0, 1 );

		if ( SongCoder.noteNames.indexOf( currentNote ) === -1 ) {
			return chord;
		}

		var chordType = null;

		if ( chord.substr( 1, 1 ) === '#' ) {
			currentNote += '#';
			chordType = chord.substr( 2 );
		} else if ( chord.substr( 1, 1 ) === 'b' ) {
			currentNote += 'b';
			chordType = chord.substr( 2 );
		} else {
			chordType = chord.substr( 1 );
		}

		currentNote = SongCoder.transposeNote( currentNote );

		chord = currentNote + chordType;

		// Transpose over key note
		if ( chord.indexOf( '/' ) > -1 ) {
			var overKey = chord.substr( chord.indexOf( '/' ) + 1 );
			chord = chord.substr( 0, chord.indexOf( '/' ) ) + '/' + SongCoder.transposeNote( overKey );
		}

		return chord;
	},
	getItemType: function ( value ) {

		var firstCharacter = value.substr( 0, 1 );
		var lastCharacter = value.substr( value.length - 1, 1 );
		var firstThreeCharacters = value.substr( 0, 3 );

		if ( firstCharacter === '[' && lastCharacter === ']' ) {

			return {
				type: 'section',
				value: value.substr( 1, value.length - 2 ).replaceAll( '-', ' ' )
			};

		} else if ( SongCoder.symbolsLookup.hasOwnProperty( firstThreeCharacters ) ) {

			if ( firstThreeCharacters === ':]]' ) {
				var times = value.length > 3 ? value.substr( 3 ) : null;

				return {
					type: 'repeat',
					value: SongCoder.symbolsLookup[value.substr( 0, 3 )],
					times: times
				};
			}

			return {
				type: 'symbol',
				value: SongCoder.symbolsLookup[value]
			};

		} else if ( firstCharacter === '"' ) {

			return {
				type: 'label',
				value: value.replaceAll( '"', '' ).replaceAll( '-', ' ' )
			};

		} else if ( firstCharacter === '\'' ) {

			return {
				type: 'comment',
				value: value.replaceAll( '\'', '' ).replaceAll( '-', ' ' )
			};

		} else if ( value.substr( 0, 2 ) === '[[' ) {

			// Update useflats
			var newKeyInLine = value.substr( 2 );
			useFlats = SongCoder.keysWithFlats.indexOf( newKeyInLine ) > -1;

		} else if ( firstCharacter === '(' ) {

			value = value.replaceAll( '(', '' ).replaceAll( ')', '' );

			var splittedNotes = value.split( ',' );
			var noteSeries = [];

			splittedNotes.forEach( function ( splittedValue ) {
				if ( SongCoder.steps !== 0 || SongCoder.useFlats ) {
					noteSeries.push( SongCoder.transposeChord( splittedValue ) );
				} else {
					noteSeries.push( splittedValue );
				}
			} );

			return {
				type: 'chord',
				value: '(' + noteSeries.join( ',' ) + ')'
			};

		} else if ( value !== 'r' && value !== 'x' ) {
			
			var chord = value;
			var timing = null;
			var type = 'chord';

			var hasTiming = chord.indexOf( ':' ) !== -1;

			if ( hasTiming ) {
				
				var splittedValue = value.split( ':' );

				chord = splittedValue[0];
				timing = splittedValue[1];

				if ( chord === 'r' )
					type = 'rest';

				if ( chord !== 'r' && SongCoder.beamsLookup.hasOwnProperty( timing ) ) {
					timing += SongCoder.beamsLookup[timing];
				} else {
					var splittedTiming = timing.split( ',' );
					var transformedTiming = '';

					splittedTiming.forEach( function ( timing ) {
						if ( chord === 'r' ) {
							if ( SongCoder.restsDurationLookup.hasOwnProperty( timing ) ) {
								transformedTiming += SongCoder.restsDurationLookup[timing];
							}
						} else {
							if ( SongCoder.notesDurationLookup.hasOwnProperty( timing ) ) {
								transformedTiming += SongCoder.notesDurationLookup[timing];
							}
						}
					} );

					timing = transformedTiming;
				}
			}

			return {
				type: type,
				value: chord === 'x' || chord === 'r' ? null : chord,
				timing: timing
			};
		}

		return {
			type: null,
			value: null
		};
	},
	parse: function ( sourceCode, newKey ) {

		var song = {
			title: null,
			artists: null,
			key: 'C',
			comment: null,
			bpm: 100,
			meter: '4/4',
			body: []
		};

		var songBody = '';

		// Split source code lines
		var lines = sourceCode.trim().split( /\s*[\r\n]+\s*/g );

		if ( lines.length === 0 ) {
			return;
		}

		// Map to song object properties
		var propertyCount = 7;

		lines.forEach( function ( value, index ) {
			if ( index < propertyCount ) {
				var splittedValue = value.split( ':' );
				song[splittedValue[0]] = splittedValue[1];
			} else {
				songBody += value + '\r\n';
			}
		} );

		// Parse song body
		var indexOfKey = SongCoder.sharpKeys.indexOf( song.key );
		if ( indexOfKey === -1 ) {
			indexOfKey = SongCoder.flatKeys.indexOf( song.key );
		}

		if ( newKey !== '' ) {

			var indexOfNewKey = SongCoder.sharpKeys.indexOf( newKey );
			if ( indexOfNewKey === -1 ) {
				indexOfNewKey = SongCoder.flatKeys.indexOf( newKey );
			}

			// Calculate semitone steps
			steps = indexOfNewKey - indexOfKey;

			// Determine if flat notes should be used
			useFlats = SongCoder.keysWithFlats.indexOf( newKey ) > -1;

			if ( SongCoder.steps !== 0 || SongCoder.useFlats ) {
				song.key = SongCoder.transposeNote( song.key );
			}

		}

		var songBodyItems = songBody.trim().split( ' ' );

		song.body = [];

		songBodyItems.forEach( function ( value ) {

			if ( value === 'v2' || value === '' )
				return;

			// Check for line break
			if ( ( value.match( /\s*[\r\n]+\s*/g ) || [] ).length ) {

				var values = value.trim().split( /\s*[\r\n]+\s*/g );

				values.forEach( function ( value, index ) {
					song.body.push( SongCoder.getItemType( value ) );

					if ( index < ( values.length - 1 ) ) {
						song.body.push( { type: 'break' } );
					}
				} );

			} else {

				song.body.push( SongCoder.getItemType( value ) );
			}

		} );

		return song;
	}
};

/*
 * Declare lookup properties
 */
SongCoder.symbolsLookup = {
	'[[:': '{',
	'[[': '"',
	'[[_': 'V',
	':]]': '}',
	'|': '\\'
};

SongCoder.notesDurationLookup = {
	'1': 'w',
	'2': 'h',
	'4': 'q',
	'8': 'e',
	'16': 's',
	'1.': 'R',
	'2.': 'd',
	'4.': 'j',
	'8.': 'i',
	'16.': 's' + SongCoder.dot,
	'1_': 'wU',
	'2_': 'hU',
	'4_': 'qU',
	'8_': 'eU',
	'16_': 'sU',
	'1._': 'RU',
	'2._': 'dU',
	'4._': 'jU',
	'8._': 'iU',
	'16._': 's' + SongCoder.dot + 'U'
};

SongCoder.restsDurationLookup = {
	'1': 'W',
	'2': 'H',
	'4': 'Q',
	'8': 'E',
	'16': 'S',
	'1.': 'W' + SongCoder.dot,
	'2.': 'D',
	'4.': 'J',
	'8.': 'I',
	'16.': 'S' + SongCoder.dot,
	'1_': 'WU',
	'2_': 'HU',
	'4_': 'QU',
	'8_': 'EU',
	'16_': 'SU',
	'1._': 'W' + SongCoder.dot + 'U',
	'2._': 'DU',
	'4._': 'JU',
	'8._': 'IU',
	'16._': 'S' + SongCoder.dot + 'U'
};

SongCoder.beamsLookup = {
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