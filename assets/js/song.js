/**
 * Created by STOK-Comp3 on 30/05/2017.
 */
function Song () {
	this.title = 'Title';
	this.artists = 'Artist';
	this.key = null;
	this.comment = null;
	this.bpm = null;
	this.meter = null;
	this.body = null;

	var flatKeys = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
	var keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	var noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
	var keysWithFlats = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];

	String.prototype.replaceAll = function ( search, replacement ) {
		return this.split( search ).join( replacement );
	};

	var transposeNote = function ( note, steps, useFlats ) {
		var indexOfKey = keys.indexOf( note );
		if ( indexOfKey === -1 ) {
			indexOfKey = flatKeys.indexOf( note );
		}

		var indexOfNewKey = indexOfKey + steps;

		if ( indexOfNewKey < 0 ) {
			indexOfNewKey = keys.length + indexOfNewKey;
		} else if ( indexOfNewKey >= keys.length ) {
			indexOfNewKey = indexOfNewKey - keys.length;
		}

		if ( useFlats ) {
			return flatKeys[indexOfNewKey];
		} else {
			return keys[indexOfNewKey];
		}
	};

	var transposeChord = function ( chord, steps, useFlats ) {
		if ( chord === 'r' )
			return chord;

		var currentNote = chord.substr( 0, 1 );

		if ( noteNames.indexOf( currentNote ) === -1 ) {
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

		currentNote = transposeNote( currentNote, steps, useFlats );

		chord = currentNote + chordType;

		// Transpose over key note
		if ( chord.indexOf( '/' ) > -1 ) {
			var overKey = chord.substr( chord.indexOf( '/' ) + 1 );
			chord = chord.substr( 0, chord.indexOf( '/' ) ) + '/' + transposeNote( overKey, steps, useFlats );
		}

		return chord;
	};

	this.parse = function ( source, mode, newKey ) {
		var currentSong = this;

		// Split source code lines
		var lines = source.trim().split( /\s*[\r\n]+\s*/g );

		if ( lines.length > 0 ) {
			// Map to song object properties
			var propertyCount = mode === 'traditional' ? 7 : 6;

			lines.forEach( function ( value, index ) {
				if ( index < propertyCount ) {
					var splittedValue = value.split( ':' );
					currentSong[splittedValue[0]] = splittedValue[1];
				} else {
					currentSong.body += value + '\r\n';
				}
			} );
		}

		// Parse song body
		if ( mode === 'traditional' ) {
			var indexOfKey = keys.indexOf( currentSong.key );
			if ( indexOfKey === -1 ) {
				indexOfKey = flatKeys.indexOf( currentSong.key );
			}

			if ( newKey === '' ) {
				newKey = currentSong.key;
			}

			var indexOfNewKey = keys.indexOf( newKey );
			if ( indexOfNewKey === -1 ) {
				indexOfNewKey = flatKeys.indexOf( newKey );
			}

			// Calculate semitone steps
			var steps = indexOfNewKey - indexOfKey;

			// Determine if flat notes should be used
			var useFlats = keysWithFlats.indexOf( newKey ) > -1;

			if ( steps !== 0 || useFlats ) {
				currentSong.key = transposeNote( currentSong.key, steps, useFlats );
			}
		}

		var songBodyLines = currentSong.body.trim().split( /\s*[\r\n]+\s*/g );
		var newSongBody = {
			lines: []
		};

		songBodyLines.forEach( function ( value ) {
			if ( value === 'v2' || value === '' )
				return;

			var line = value.trim();
			var currentLine = {
				bars: [],
				hasComments: false,
				hasLabels: false
			};
			var lineHasLabels = false;
			var lineHasComments = false;

			var measures = line.split( '|' );

			measures.forEach( function ( value ) {
				var currentBar = {
					items: []
				};

				var items = value.split( ' ' );
				items.forEach( function ( value ) {
					if ( value === '' )
						return;

					var firstCharacter = value.substr( 0, 1 );
					var lastCharacter = value.substr( value.length - 1, 1 );

					if ( firstCharacter === '[' && lastCharacter === ']' ) {
						var label = value.substr( 1 ).substr( 0, value.length - 2 ).replaceAll( '_', ' ' );

						if ( value.substr( 0, 1 ) === '\'' ) {
							currentBar.left_label = label.replaceAll( '\'', '' );
						} else if ( value.substr( 0, 1 ) === '"' ) {
							currentBar.right_label = label.replaceAll( '"', '' );
						} else {
							currentBar.left_label = label;
						}

						lineHasLabels = true;
					} else if ( value === '[[:' || value === '[[' || value === '[[_' ) {
						currentBar.before = value;
					} else if ( value.substr( 0, 2 ) === '[[' ) {
						// Update useflats
						var newKeyInLine = value.substr( 2 );
						useFlats = keysWithFlats.indexOf( newKeyInLine ) > -1;
					} else if ( value.substr( 0, 3 ) === ':]]' ) {
						currentBar.after = value;
					} else if ( firstCharacter === '\'' ) {
						currentBar.left_comment = value.replaceAll( '\'', '' ).replaceAll( '_', ' ' );
						lineHasComments = true;
					} else if ( firstCharacter === '"' ) {
						currentBar.right_comment = value.replaceAll( '"', '' ).replaceAll( '_', ' ' );
						lineHasComments = true;
					} else if ( firstCharacter === '(' ) {
						value = value.replaceAll( '(', '' ).replaceAll( ')', '' );

						var splittedNotes = value.split( ',' );
						var noteSeries = [];

						splittedNotes.forEach( function ( splittedValue ) {
							if ( mode === 'traditional' ) {
								if ( steps !== 0 || useFlats ) {
									noteSeries.push( transposeChord( splittedValue, steps, useFlats ) );
								} else {
									noteSeries.push( splittedValue );
								}
							} else if ( mode === 'nashville' ) {
								noteSeries.push( splittedValue );
							}
						} );

						currentBar.items.push( {
							chord: '(' + noteSeries.join( ',' ) + ')'
						} );
					} else {
						if ( value.indexOf( ':' ) === -1 ) {
							if ( mode === 'traditional' ) {
								if ( steps !== 0 || useFlats ) {
									currentBar.items.push( {
										chord: transposeChord( value, steps, useFlats )
									} );
								} else {
									currentBar.items.push( {
										chord: value
									} );
								}
							} else if ( mode === 'nashville' ) {
								currentBar.items.push( {
									chord: value
								} );
							}
						} else {
							var splitted = value.split( ':' );
							if ( mode === 'traditional' ) {
								if ( steps !== 0 || useFlats ) {
									currentBar.items.push( {
										chord: transposeChord( splitted[0], steps, useFlats ),
										timing: splitted[1]
									} );
								} else {
									currentBar.items.push( {
										chord: splitted[0],
										timing: splitted[1]
									} );
								}
							} else if ( mode === 'nashville' ) {
								currentBar.items.push( {
									chord: splitted[0],
									timing: splitted[1]
								} );
							}
						}
					}
				} );

				currentLine.bars.push( currentBar );
				currentLine.hasComments = lineHasComments;
				currentLine.hasLabels = lineHasLabels;
			} );

			newSongBody.lines.push( currentLine );
		} );

		currentSong.body = newSongBody;
	};
}