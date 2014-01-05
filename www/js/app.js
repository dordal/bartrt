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
		when('/arrivals', {templateUrl: 'partials/arrivals.html', controller: 'ArrivalsCtrl'}).
		when('/config', {templateUrl: 'partials/config.html', controller: 'ConfigCtrl'}).
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
            localStorageService.add('stations',[{ abbreviation: '12TH'}, {abbreviation: 'EMBR'}]);
        }

        // add a 20px iOS 7 header. See https://gist.github.com/shazron/6602131
		if(navigator.userAgent.match(/iPhone OS 7/)) {
			document.body.style.marginTop = "20px";
		}
	});