String.prototype.replaceAll = function ( search, replacement ) {
	return this.split( search ).join( replacement );
};

var app = new Vue( {
	el: '#app',
	data: {
		keys: ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'],
		flatKeys: ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
		sharpKeys: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
		noteNames: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
		keysWithFlats: ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'],
		sourceCode: 'title:\nartists:\nkey:C\ncomment:\nbpm:100\nmeter:4/4\nbody:\n',
		newKey: '',
		song: {
			title: null,
			artists: null,
			key: 'C',
			comment: null,
			bpm: 100,
			meter: '4/4',
			body: []
		}
	},
	methods: {
		transposeNote: function ( note, steps, useFlats ) {
			var indexOfKey = this.sharpKeys.indexOf( note );
			if ( indexOfKey === -1 ) {
				indexOfKey = this.flatKeys.indexOf( note );
			}

			var indexOfNewKey = indexOfKey + steps;

			if ( indexOfNewKey < 0 ) {
				indexOfNewKey = this.sharpKeys.length + indexOfNewKey;
			} else if ( indexOfNewKey >= this.sharpKeys.keys.length ) {
				indexOfNewKey = indexOfNewKey - this.sharpKeys.keys.length;
			}

			if ( useFlats ) {
				return this.flatKeys[indexOfNewKey];
			} else {
				return this.sharpKeys[indexOfNewKey];
			}
		},
		replaceNonChord: function ( chord ) {
			if ( chord === 'x' || chord === 'r' )
				return '&nbsp;'

			return chord;
		},
		transposeChord: function ( chord, steps, useFlats ) {

			var currentNote = chord.substr( 0, 1 );

			if ( this.noteNames.indexOf( currentNote ) === -1 ) {
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

			currentNote = this.transposeNote( currentNote, steps, useFlats );

			chord = currentNote + chordType;

			// Transpose over key note
			if ( chord.indexOf( '/' ) > -1 ) {
				var overKey = chord.substr( chord.indexOf( '/' ) + 1 );
				chord = chord.substr( 0, chord.indexOf( '/' ) ) + '/' + this.transposeNote( overKey, steps, useFlats );
			}

			return chord;
		},
		parse: function () {
			var vm = this;
			var songBody = '';

			var dot = '<span class="dot">.</span>';

			var symbolsLookup = {
				'[[:': '{',
				'[[': '"',
				'[[_': 'V',
				':]]': '}'
			};

			var notesDurationLookup = {
				'1': 'w',
				'2': 'h',
				'4': 'q',
				'8': 'e',
				'16': 's',
				'1.': 'R',
				'2.': 'd',
				'4.': 'j',
				'8.': 'i',
				'16.': 's' + dot,
				'1_': 'wU',
				'2_': 'hU',
				'4_': 'qU',
				'8_': 'eU',
				'16_': 'sU',
				'1._': 'RU',
				'2._': 'dU',
				'4._': 'jU',
				'8._': 'iU',
				'16._': 's' + dot + 'U'
			};

			var restsDurationLookup = {
				'1': 'W',
				'2': 'H',
				'4': 'Q',
				'8': 'E',
				'16': 'S',
				'1.': 'W' + dot,
				'2.': 'D',
				'4.': 'J',
				'8.': 'I',
				'16.': 'S' + dot,
				'1_': 'WU',
				'2_': 'HU',
				'4_': 'QU',
				'8_': 'EU',
				'16_': 'SU',
				'1._': 'W' + dot + 'U',
				'2._': 'DU',
				'4._': 'JU',
				'8._': 'IU',
				'16._': 'S' + dot + 'U'
			};

			var beamsLookup = {
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

			// Split source code lines
			var lines = vm.sourceCode.trim().split( /\s*[\r\n]+\s*/g );

			if ( lines.length === 0 ) {
				return;
			}

			// Map to song object properties
			var propertyCount = 7;

			lines.forEach( function ( value, index ) {
				if ( index < propertyCount ) {
					var splittedValue = value.split( ':' );
					vm.song[splittedValue[0]] = splittedValue[1];
				} else {
					songBody += value + '\r\n';
				}
			} );

			// Parse song body
			var indexOfKey = vm.sharpKeys.indexOf( vm.song.key );
			if ( indexOfKey === -1 ) {
				indexOfKey = vm.flatKeys.indexOf( vm.song.key );
			}

			var useFlats = false;
			var steps = 0;

			if ( vm.newKey !== '' ) {

				var indexOfNewKey = vm.sharpKeys.indexOf( vm.newKey );
				if ( indexOfNewKey === -1 ) {
					indexOfNewKey = vm.flatKeys.indexOf( vm.newKey );
				}

				// Calculate semitone steps
				var steps = indexOfNewKey - indexOfKey;

				// Determine if flat notes should be used
				var useFlats = vm.keysWithFlats.indexOf( vm.newKey ) > -1;

				if ( steps !== 0 || useFlats ) {
					vm.song.key = vm.transposeNote( vm.song.key, steps, useFlats );
				}

			}

			var songBodyLines = songBody.trim().split( /\s*[\r\n]+\s*/g );
			vm.song.body = [];

			songBodyLines.forEach( function ( value ) {

				if ( value === 'v2' || value === '' )
					return;

				var items = value.trim().split( ' ' );

				items.forEach( function ( value ) {

					if ( value === '' )
						return;

					var firstCharacter = value.substr( 0, 1 );
					var lastCharacter = value.substr( value.length - 1, 1 );

					if ( firstCharacter === '[' && lastCharacter === ']' ) {

						vm.song.body.push( {
							type: 'section',
							value: value.substr( 1, value.length - 2 ).replaceAll( '_', ' ' )
						} );

					} else if ( value === '|' ) {

						vm.song.body.push( {
							type: 'symbol',
							value: '\\'
						} );

					} else if ( firstCharacter === '"' ) {

						vm.song.body.push( {
							type: 'label',
							value: value.replaceAll( '"', '' ).replaceAll( '_', ' ' )
						} );

					} else if ( firstCharacter === '\'' ) {

						vm.song.body.push( {
							type: 'comment',
							value: value.replaceAll( '\'', '' ).replaceAll( '_', ' ' )
						} );

					} else if ( value === '[[:' || value === '[[' || value === '[[_' ) {

						vm.song.body.push( {
							type: 'symbol',
							value: symbolsLookup[value]
						} );

					} else if ( value.substr( 0, 2 ) === '[[' ) {

						// Update useflats
						var newKeyInLine = value.substr( 2 );
						useFlats = vm.keysWithFlats.indexOf( newKeyInLine ) > -1;

					} else if ( value.substr( 0, 3 ) === ':]]' ) {

						var times = value.length > 3 ? value.substr( 3 ) : null;

						vm.song.body.push( {
							type: 'repeat',
							value: symbolsLookup[value.substr( 0, 3 )],
							times: times
						} );

					} else if ( firstCharacter === '(' ) {

						value = value.replaceAll( '(', '' ).replaceAll( ')', '' );

						var splittedNotes = value.split( ',' );
						var noteSeries = [];

						splittedNotes.forEach( function ( splittedValue ) {
							if ( steps !== 0 || useFlats ) {
								noteSeries.push( vm.transposeChord( splittedValue, steps, useFlats ) );
							} else {
								noteSeries.push( splittedValue );
							}
						} );

						vm.song.body.push( {
							type: 'chord',
							value: '(' + noteSeries.join( ',' ) + ')'
						} );

					} else {
						if ( value.indexOf( ':' ) === -1 ) {
							if ( steps !== 0 || useFlats ) {

								vm.song.body.push( {
									type: 'chord',
									value: vm.replaceNonChord( vm.transposeChord( value, steps, useFlats ) )
								} );

							} else {

								vm.song.body.push( {
									type: 'chord',
									value: vm.replaceNonChord( value )
								} );

							}
						} else {
							var splitted = value.split( ':' );

							var transformTimings = function ( chord, timings ) {

								var transformedTimings = '';

								if ( chord !== 'r' && beamsLookup.hasOwnProperty( timings ) ) {
									transformedTimings += beamsLookup[timings];
								} else {
									var splittedTimings = timings.split( ',' );

									splittedTimings.forEach( function ( timing ) {
										if ( chord === 'r' ) {
											if ( restsDurationLookup.hasOwnProperty( timing ) ) {
												transformedTimings += restsDurationLookup[timing];
											}
										} else {
											if ( notesDurationLookup.hasOwnProperty( timing ) ) {
												transformedTimings += notesDurationLookup[timing];
											}
										}
									} );
								}

								return transformedTimings;
							};

							if ( steps !== 0 || useFlats ) {

								var chord = vm.transposeChord( splitted[0], steps, useFlats );

								vm.song.body.push( {
									type: 'chord',
									value: vm.replaceNonChord( chord ),
									timing: transformTimings( chord, splitted[1] )
								} );

							} else {

								vm.song.body.push( {
									type: 'chord',
									value: vm.replaceNonChord( splitted[0] ),
									timing: transformTimings( splitted[0], splitted[1] )
								} );

							}
						}
					}

				} );

			} );

			console.log( this.song.body );
		}
	}
} );