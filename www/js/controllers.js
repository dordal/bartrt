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

        // TODO: put up a loading icon which gets removed when data is loaded

        // load stations from local storage
        $scope.stations = localStorageService.get('stations');

        // iterate through each station in the list, and load data for it
        for (var idx=0; idx < $scope.stations.length; idx++) {

            // we have to call a separate function which returns a promise, so we can wait for
            // the results of each asynchronous API call. See this doc for an example:
            // http://sravi-kiran.blogspot.com/2013/03/MovingAjaxCallsToACustomServiceInAngularJS.html
            bartApi.getETD($scope.stations[idx], idx).then(function(station) {
                // There's a bit of trickery here because we pass the index of the current station in the 
                // $scope.stations array to the getETD() function, and then get it back as station.idx. This
                // is so we can be sure to update the correct station in the $scope.stations array...
                $scope.stations[station.idx] = station;
            });
        }
    }
}]);

//
// Config Controller
//
BartRT.controller('ConfigCtrl', ['$scope', 'localStorageService', 'bartApi', function($scope, localStorageService, bartApi) {

    $scope.stationList = new Object();
    $scope.stations = localStorageService.get('stations');

    // 
    // load preference data
    //
    $scope.loadPreferences = function() {

        // TODO: put up a loading icon which gets removed when data is loaded

        // we use a promise to make sure we have station data from BART
        // before loading the station list
        bartApi.getStations().then(function(stationList) {

            // convert the data from BART to an object with station abbreviations as keys; makes
            // for easier use later
            for (var idx=0; idx < stationList.length; idx++) {
                $scope.stationList[stationList[idx].abbr] = stationList[idx];
            }
        });
    },

    $scope.savePreferences = function() {
        // assign station names
        for (var idx=0; idx < $scope.stations.length; idx++) {
            $scope.stations[idx].name = $scope.stationList[$scope.stations[idx].abbreviation].name;
        }

        // TODO: insert de-duping code in here to remove duplicate station names (or possibly
        // do this at load time of the list)

        localStorageService.add('stations',$scope.stations);


    },

    $scope.addStation = function() {
        $scope.stations.push({'name': null, 'abbreviation': null});
    }

    $scope.deleteStation = function (station) {
        var index=$scope.stations.indexOf(station)
        $scope.stations.splice(index,1);     
        localStorageService.add('stations',$scope.stations);
    }
}]);
