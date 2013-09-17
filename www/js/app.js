/*
 * BartRT - app.js
 *
 * David Ordal - david -at- ordal.com
 * 
 */


//
// Angular Initialization + Dependency Injection
//
angular.module('arrivals', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/arrivals', {templateUrl: 'partials/arrivals.html',   controller: ArrivalsCtrl}).
      when('/config', {templateUrl: 'partials/config.html', controller: ConfigCtrl}).
      otherwise({redirectTo: '/arrivals'});
}]);


