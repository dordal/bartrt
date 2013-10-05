/*
 * BartRT - app.js
 *
 * David Ordal - david -at- ordal.com
 * 
 */

//
// Angular Initialization + Dependency Injection
//
var BartRT = angular.module('bartRT', ['LocalStorageModule'])

	// setup constants
	.constant('bartApiKey', 'MW9S-E7SL-26DU-VV8V')

	// configure routing
	.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/arrivals', {templateUrl: 'partials/arrivals.html', controller: 'ArrivalsCtrl'}).
		when('/config', {templateUrl: 'partials/config.html', controller: 'ConfigCtrl'}).
		otherwise({redirectTo: '/arrivals'});
	}])

	// configure the http provider
	.config(['$httpProvider', function($httpProvider) {
		// set headers to avoid CORS issues
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
		$httpProvider.defaults.headers.put['Access-Control-Allow-Credentials']='true'
	}]);
