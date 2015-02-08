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

    // optional parameter to load a single station
    $scope.station = $routeParams.station;

    // uncomment to force-update the local station storage with sample data
    // localStorageService.add('stations',[{ name: '12th St. Oakland City Center', abbreviation: '12TH'}, {name: 'Embarcadero', abbreviation: 'EMBR'}, {name: 'Orinda',abbreviation: 'ORIN'}]);

    //
    // load arrival times
    //
    $scope.loadETD = function() {

        // TODO: put up a loading icon which gets removed when data is loaded

        // check whether we were passed a station (e.g. #/stations/19th), and either display just
        // that station, or load all stations from local storage.
        if ( $scope.station ) {
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
BartRT.controller('ConfigCtrl', ['$scope', '$location', '$routeParams', 'localStorageService', 'bartApi', function($scope, $location, $routeParams, localStorageService, bartApi) {

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
    $scope.action = $routeParams.action;

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
    // select a station and either do a quick lookup, or save it to local storage
    //
    $scope.selectStation = function(station) {
        if($routeParams.action == 'lookup') {
            $location.path('arrivals/' + station.abbr);
        } else {

            // dedup: if we're adding a station we already have, remove the old one
            // so the 'new' one goes on the bottom of the list.
            for (var idx=0; idx < $scope.stations.length; idx++) {
                if ($scope.stations[idx].abbreviation == station.abbr) {
                    $scope.stations.splice(idx,1);
                }
            }

            $scope.stations.push({'name': station.name, 'abbreviation': station.abbr});

            // save to local storage, and refresh back to config page.
            localStorageService.add('stations',$scope.stations);
            $location.path('config');
        }
    }

}]);
