'use strict';

importScripts('sw-toolbox.js');

toolbox.precache([
	'index.html',
	'guide.html',
	'dist/css/styles.min.css',
	'dist/js/scripts.min.js',
	'dist/fonts/raleway-v11-latin-regular.woff2',
	'dist/fonts/inconsolata-v15-latin-regular.woff2',
	'dist/fonts/musisync.woff',
	'manifest.json'
]);
	
// toolbox.router.get('/images/*', toolbox.cacheFirst);
toolbox.router.get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 5 });