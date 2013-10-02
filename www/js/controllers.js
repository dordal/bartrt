/*
 * BartRT - controllers.js
 *
 * David Ordal - david -at- ordal.com
 * 
 */

angular.module('bartRT.controllers', [])

//
// Arrivals Controller
//
.controller('ArrivalsCtrl', ['$scope', '$http', 'bartApi', function($scope, $http, bartApi) { 

    /*
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
    }
    */

    // TODO: On load of the page fragment, populate the data out of local browser storage (via a JSON object). 
    // This should contain a list of station abbreviations & names for the stations that we want to get data for 
    // (rather than the current hard-coded list).

    $scope.stations = [
    {
        name: '12th St. Oakland City Center',
        abbreviation: '12TH'
    }, {
        name: 'Embarcadero',
        abbreviation: 'EMBR'
    }, {
        name: 'Orinda',
        abbreviation: 'ORIN',
    }];

    $scope.loadData = function() {

        delete $http.defaults.headers.common['X-Requested-With'];
        $http.defaults.headers.put['Access-Control-Allow-Credentials']='true'
        // http://api.bart.gov/api/etd.aspx?cmd=etd&orig=FRMT&key=MW9S-E7SL-26DU-VV8V

        // iterate through each station in the list, and load data for it
        for (var idx=0; idx< $scope.stations.length; idx++) {
            // we have to call a separate function so that we can limit scope and make sure 
            // the array index (idx) doesn't change while we're waiting for the HTTP call
            // to return.
            bartApi.getETD($scope.stations[idx]);
        }
    }
}])

//
// Config Controller
//
.controller('ConfigCtrl', ['$scope', 'helloWorldFromFactory', function($scope, helloWorldFromFactory) { 
    var foobar = helloWorldFromFactory.sayHello();
    $scope.myHelloVar = foobar;
}]);
