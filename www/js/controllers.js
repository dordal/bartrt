/*
 * BartRT - controllers.js
 *
 * David Ordal - david -at- ordal.com
 * 
 */

//
// Arrivals Controller
//
BartRT.controller('ArrivalsCtrl', ['$scope', 'localStorageService', 'bartApi', function($scope, localStorageService, bartApi) { 

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
    $scope.loadETD = function() {

        // load stations from local storage
        $scope.stations = localStorageService.get('stations');

        // iterate through each station in the list, and load data for it
        for (var idx=0; idx< $scope.stations.length; idx++) {
            // we have to call a separate function which returns a promise, so we can wait for
            // the results of each asynchronous API call. See this doc for details:
            // http://sravi-kiran.blogspot.com/2013/03/MovingAjaxCallsToACustomServiceInAngularJS.html
            bartApi.getETD($scope.stations[idx]).then(function(stations) {
                $scope.stations[idx] = stations;
            });
        }
    }
}]);

//
// Config Controller
//
BartRT.controller('ConfigCtrl', ['$scope', 'localStorageService', 'bartApi', function($scope, localStorageService, bartApi) {

    $scope.stationList = new Array();
    $scope.stations = localStorageService.get('stations');

    // 
    // load preference data
    //
    $scope.loadPreferences = function() {

        // we use a promise to make sure we have station data from BART
        // before loading the station list
        bartApi.getStations().then(function(stationList) {
            console.log(stationList);

            $scope.stationList = stationList;

            // go through local storage, iterate through the stations list
            // for each station, assign something to $scope to set options
            // somehow will be something to do with the ng-options directive:
            // http://docs.angularjs.org/api/ng.directive:select
        });
    },

    $scope.savePreferences = function() {
        localStorageService.add('stations',$scope.stations);


    }
}]);
