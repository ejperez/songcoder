var app = new Vue( {
	el: '#app',
	computed: {
		keys: function () {
			return SongCoder.keys;
		}
	},
	data: {
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
		parse: function () {
			this.song = SongCoder.parse( this.sourceCode, this.newKey );
		},
		print: function () {
			window.print();
		}
	}
} );