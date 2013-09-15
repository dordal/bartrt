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

//
// Arrivals Controller
//
function ArrivalsCtrl($scope, $http, $http) {
    $scope.stations = [{
        name: 'Fremont',
        abbreviation: 'FRMT',
        etd: [{
            name: 'Embarcadero',
            abbreviation: 'EMCD',
            trains: [{
                minutes: 2,
                length: 6
            }, {
                minutes: 12,
                length: 10
            }]
        }, {
            name: 'Richmond',
            abbreviation: 'RICH',
            trains: [{
                minutes: 7,
                length: 5
            }, {
                minutes: 14,
                length: 9
            }]
        },
        ]
    }, {
        name: 'Civic Center',
        abbreviation: 'CVCC',
        etd: [{
            name: 'Embarcadero',
            abbreviation: 'EMCD',
            trains: [{
                minutes: 4,
                length: 3
            }, {
                minutes: 18,
                length: 10
            }]
    }, {
        name: 'San Francisco International Airport',
            abbreviation: 'SFIA',
            trains: [{
                minutes: 8,
                length: 9
            }, {
                minutes: 22,
                length: 9
            }]
        },
        ]
    }];


  $scope.loadData = function() {
     delete $http.defaults.headers.common['X-Requested-With'];
     $http.defaults.headers.put['Access-Control-Allow-Credentials']='true'
	 // http://api.bart.gov/api/etd.aspx?cmd=etd&orig=FRMT&key=MW9S-E7SL-26DU-VV8V
     $http.get('/test/bart/12th.xml').success(function(data) {
     	x2js = new X2JS();
        bartData = x2js.xml_str2json( data ).root;

        $scope.stations[0].name = bartData.station.name;
        $scope.stations[0].abbreviation = bartData.station.abbr;

        $scope.stations[0].etd = new Array();   

        // X2JS will return a single ETD result as an object, not an array. We
        // need to convert it.
        if (!Array.isArray(bartData.station.etd)) {
            bartData.station.etd = new Array(bartData.station.etd);
        }

        for (e in bartData.station.etd) {

            var etd = new Array();
            etd.name = bartData.station.etd[e].destination;
            etd.abbreviation = bartData.station.etd[e].abbreviation;
            etd.trains = new Array();
            for (i in bartData.station.etd[e].estimate) {
                var train = new Array();
                train.minutes = bartData.station.etd[e].estimate[i].minutes;
                train.length = bartData.station.etd[e].estimate[i].length;

                etd.trains.push(train);
            }

            $scope.stations[0].etd.push(etd);
        }

        
     });
  }
}


//
// Config Controller
//
function ConfigCtrl($scope) {

    
}

