/*
 * BartRT - app.js
 *
 * David Ordal - david -at- ordal.com
 * 
 */

//
// Angular Initialization + Dependency Injection
//
var BartRT = angular.module('bartRT', ['LocalStorageModule','ngRoute'])

	// setup constants
	.constant('bartApiKey', 'M9KV-TWSU-T8DT-IKWW')

	// configure routing
	.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/arrivals/:station?', {templateUrl: 'partials/arrivals.html', controller: 'ArrivalsCtrl'}).
		when('/config', {templateUrl: 'partials/config.html', controller: 'ConfigCtrl'}).
		when('/stationlist/:action', {templateUrl: 'partials/stationlist.html', controller: 'StationListCtrl'}).		
		otherwise({redirectTo: '/arrivals'});
	}])

	// configure the http provider
	.config(['$httpProvider', function($httpProvider) {
		// set headers to avoid CORS issues
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
		$httpProvider.defaults.headers.put['Access-Control-Allow-Credentials']='true'
	}])

	// configure local storage provider
	.config(function (localStorageServiceProvider) {
     	localStorageServiceProvider.prefix = 'bartRT';
  	})

	// load some defaults if none are present in local storage, setup other misc app stuff
	.run(function (localStorageService) {
		var stations = localStorageService.get('stations');
		if (stations == null) {
			// TODO: Possibly poll the BART API and get the first two stations or something, rather than hardcode
			// this data here
            localStorageService.add('stations',[{ abbreviation: '12TH', name: '12th St. Oakland City Center'}, {abbreviation: 'EMBR', name: 'Embarcadero'}]);
        }
	});