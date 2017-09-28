'use strict';

importScripts('sw-toolbox.js');

toolbox.precache([
	'index.html',
	'dist/css/styles.min.css',
	'dist/css/print.min.css',
	'dist/js/scripts.min.css',
	'dist/fonts/raleway-v11-latin-regular.woff2',
	'dist/fonts/inconsolata-v15-latin-regular.woff2'
]);
	
// toolbox.router.get('/images/*', toolbox.cacheFirst);
toolbox.router.get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 5 });