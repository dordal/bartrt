/*
 * BartRT - controllers.js
 *
 * David Ordal - david -at- ordal.com
 * 
 */

//
// Arrivals Controller
//
BartRT.controller('ArrivalsCtrl', ['$scope', '$location', '$routeParams', 'localStorageService', 'bartApi', function($scope, $location, $routeParams, localStorageService, bartApi) { 

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

    //
    // load arrival times
    //
    $scope.loadETD = function() {

        // TODO: put up a loading icon which gets removed when data is loaded

        // check whether we were passed a station (e.g. #/stations/19th), and either display just
        // that station, or load all stations from local storage.
        if ( $routeParams.station ) {
            $scope.stations = [{ abbreviation: $routeParams.station}];
        } else {
            $scope.stations = localStorageService.get('stations');
        }

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
        $scope.currentTime = Date.now();
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

    //
    // save preference data
    //
    $scope.savePreferences = function() {

        // assign station names & verify no duplicates
        for (var idx=0; idx < $scope.stations.length; idx++) {
            // TODO: duplicate check. Go through the list and make sure there are no duplicates
            // If there are, we can reasonably assume the last added item was the duplicate,
            // and should be removed. NOTE this doesn't quite work; if somebody changes an existing
            // entry to a duplicate we won't know which one to delete. Maybe we need to figure out the
            // changed value somehow and pass it in.

            // set the station name; look it up in the station list
            $scope.stations[idx].name = $scope.stationList[$scope.stations[idx].abbreviation].name;
        }

        localStorageService.add('stations',$scope.stations);

    },

    //
    // add a station
    //
    $scope.addStation = function() {
        // we add a new element to the array but we don't want to save
        // to local storage here, because the user hasn't picked which
        // station they want to add yet
        $scope.stations.push({'name': null, 'abbreviation': null});
    },

    // 
    // delete a station
    // 
    $scope.deleteStation = function (station) {
        var index=$scope.stations.indexOf(station)
        $scope.stations.splice(index,1);     
        localStorageService.add('stations',$scope.stations);
    }
}]);

//
// Station List Controller
//
BartRT.controller('StationListCtrl', ['$scope', '$location', '$routeParams', 'localStorageService', 'bartApi', function($scope, $location, $routeParams, localStorageService, bartApi) {

    $scope.stationList = new Object();
    $scope.stations = localStorageService.get('stations');

    // 
    // load preference data
    //
    $scope.loadStationList = function() {

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
    }

    // 
    // select a station
    //
    $scope.selectStation = function(station) {

        console.log(station);
        console.log();

        if($routeParams.action == 'lookup') {
            $location.path('arrivals/' + station.abbr);
        } else {
            $scope.stations.push({'name': station.name, 'abbreviation': station.abbr});
            localStorageService.add('stations',$scope.stations);
            $location.path('config');
        }
    }

}]);
