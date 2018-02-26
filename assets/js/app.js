String.prototype.replaceAll = function ( search, replacement ) {
	return this.split( search ).join( replacement );
};

var app = new Vue( {
	el: '#app',
	data: {
		keys: [ 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B' ],
		flatKeys: [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B' ],
		sharpKeys: [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ],
		noteNames: [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ],
		keysWithFlats: [ 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb' ],
		sourceCode: 'title:\nartists:\nkey:C\ncomment:\nbpm:100\nmeter:4/4\nbody:\n',
		newKey: '',
		song: {
			title: null,
			artists: null,
			key: 'C',
			comment: null,
			bpm: null,
			meter: null,
			body: null
		}
	},
	mounted: function () {
		console.log( 'ready' );
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
				return this.flatKeys[ indexOfNewKey ];
			} else {
				return this.sharpKeys[ indexOfNewKey ];
			}
		},
		transposeChord: function ( chord, steps, useFlats ) {
			if ( chord === 'r' )
				return chord;

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
					vm.song[ splittedValue[ 0 ] ] = splittedValue[ 1 ];
				} else {
					songBody += value + '\r\n';
				}
			} );

			// Parse song body
			var indexOfKey = vm.sharpKeys.indexOf( vm.song.key );
			if ( indexOfKey === -1 ) {
				indexOfKey = vm.flatKeys.indexOf( vm.song.key );
			}

			if ( vm.newKey === '' ) {
				vm.newKey = vm.song.key;
			}

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

			var songBodyLines = songBody.trim().split( /\s*[\r\n]+\s*/g );
			var newSongBody = {
				lines: []
			};

			songBodyLines.forEach( function ( value ) {
				if ( value === 'v2' || value === '' )
					return;

				var line = value.trim();
				var currentLine = {
					bars: []
				};
				//var lineHasLabels = false;
				//var lineHasComments = false;

				var measures = line.split( '|' );

				measures.forEach( function ( value ) {
					var currentBar = {
						items: []
					};

					var items = value.split( ' ' );

					items.forEach( function ( value ) {
						if ( value === '' )
							return;

						currentBar.items.push( value );

						//var firstCharacter = value.substr( 0, 1 );
						//var lastCharacter = value.substr( value.length - 1, 1 );
						//
						//if ( firstCharacter === '[' && lastCharacter === ']' ) {
						//	var label = value.substr( 1 ).substr( 0, value.length - 2 ).replaceAll( '_', ' ' );
						//
						//	if ( value.substr( 0, 1 ) === '\'' ) {
						//		currentBar.left_label = label.replaceAll( '\'', '' );
						//	} else if ( value.substr( 0, 1 ) === '"' ) {
						//		currentBar.right_label = label.replaceAll( '"', '' );
						//	} else {
						//		currentBar.left_label = label;
						//	}
						//
						//	lineHasLabels = true;
						//} else if ( value === '[[:' || value === '[[' || value === '[[_' ) {
						//	currentBar.before = value;
						//} else if ( value.substr( 0, 2 ) === '[[' ) {
						//	// Update useflats
						//	var newKeyInLine = value.substr( 2 );
						//	useFlats = keysWithFlats.indexOf( newKeyInLine ) > -1;
						//} else if ( value.substr( 0, 3 ) === ':]]' ) {
						//	currentBar.after = value;
						//} else if ( firstCharacter === '\'' ) {
						//	currentBar.left_comment = value.replaceAll( '\'', '' ).replaceAll( '_', ' ' );
						//	lineHasComments = true;
						//} else if ( firstCharacter === '"' ) {
						//	currentBar.right_comment = value.replaceAll( '"', '' ).replaceAll( '_', ' ' );
						//	lineHasComments = true;
						//} else if ( firstCharacter === '(' ) {
						//	value = value.replaceAll( '(', '' ).replaceAll( ')', '' );
						//
						//	var splittedNotes = value.split( ',' );
						//	var noteSeries = [];
						//
						//	splittedNotes.forEach( function ( splittedValue ) {
						//		if ( steps !== 0 || useFlats ) {
						//			noteSeries.push( transposeChord( splittedValue, steps, useFlats ) );
						//		} else {
						//			noteSeries.push( splittedValue );
						//		}
						//	} );
						//
						//	currentBar.items.push( {
						//		chord: '(' + noteSeries.join( ',' ) + ')'
						//	} );
						//} else {
						//	if ( value.indexOf( ':' ) === -1 ) {
						//		if ( steps !== 0 || useFlats ) {
						//			currentBar.items.push( {
						//				chord: vm.transposeChord( value, steps, useFlats )
						//			} );
						//		} else {
						//			currentBar.items.push( {
						//				chord: value
						//			} );
						//		}
						//	} else {
						//		var splitted = value.split( ':' );
						//		if ( steps !== 0 || useFlats ) {
						//			currentBar.items.push( {
						//				chord: vm.transposeChord( splitted[ 0 ], steps, useFlats ),
						//				timing: splitted[ 1 ]
						//			} );
						//		} else {
						//			currentBar.items.push( {
						//				chord: splitted[ 0 ],
						//				timing: splitted[ 1 ]
						//			} );
						//		}
						//	}
						//}
					} );

					currentLine.bars.push( currentBar );
					//currentLine.hasComments = lineHasComments;
					//currentLine.hasLabels = lineHasLabels;
				} );

				newSongBody.lines.push( currentLine );
			} );

			this.song.body = newSongBody;

			console.log( this.song.body );
		}
	}
} );