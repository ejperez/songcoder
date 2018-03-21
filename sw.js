'use strict';

importScripts('sw-toolbox.js');

toolbox.precache([
	'index.html',	
	'dist/css/styles.min.css',
	'dist/js/scripts.min.js',
	'dist/fonts/raleway-v11-latin-regular.woff2',
	'manifest.json'
]);
	
// toolbox.router.get('/images/*', toolbox.cacheFirst);
toolbox.router.get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 5 });