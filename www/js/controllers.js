/*
 * BartRT - controllers.js
 *
 * David Ordal - david -at- ordal.com
 * 
 */

//
// Arrivals Controller
//
BartRT.controller('ArrivalsCtrl', ['$scope', '$http', 'localStorageService', 'bartApi', function($scope, $http, localStorageService, bartApi) { 

    // uncomment to update the local station storage
    // localStorageService.add('stations',[{ name: '12th St. Oakland City Center', abbreviation: '12TH'}, {name: 'Embarcadero', abbreviation: 'EMBR'}, {name: 'Orinda',abbreviation: 'ORIN'}]);


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
    $scope.loadData = function() {

        // load stations from local storage
        $scope.stations = localStorageService.get('stations');

        delete $http.defaults.headers.common['X-Requested-With'];
        $http.defaults.headers.put['Access-Control-Allow-Credentials']='true'
        
        // iterate through each station in the list, and load data for it
        for (var idx=0; idx< $scope.stations.length; idx++) {
            // we have to call a separate function so that we can limit scope and make sure 
            // the array index (idx) doesn't change while we're waiting for the HTTP call
            // to return.
            bartApi.getETD($scope.stations[idx]);
        }
    }
}]);

//
// Config Controller
//
BartRT.controller('ConfigCtrl', ['$scope', 'helloWorldFromFactory', function($scope, helloWorldFromFactory) { 
    var foobar = helloWorldFromFactory.sayHello();
    $scope.myHelloVar = foobar;
}]);
