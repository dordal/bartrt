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
    // localStorageService.add('stations',[{ name: '12th St. Oakland City Center', abbr: '12TH'}, {name: 'Embarcadero', abbr: 'EMBR'}, {name: 'Orinda',abbr: 'ORIN'}]);

    // add a listener for the app resuming, so we can refresh. We only want to add this once; easiest way is to record whether we've added it.
    if($scope.resumeListenerAdded != true) {
        document.addEventListener("resume", function(){ loadStationETD(); }, false);
        $scope.resumeListenerAdded = true;        
    }

    //
    // load arrival times
    //
    $scope.loadETD = function() {
        loadStationETD();
    },

    $scope.addStation = function(station) {
        $scope.stations = localStorageService.get('stations');

        // dedup: if we're adding a station we already have, simply skip it and 
        // go back to the arrivals screen
        for (var idx=0; idx < $scope.stations.length; idx++) {
            if ($scope.stations[idx].abbr == station.abbr) {
                $location.path('arrivals');
                return;
            }
        }

        $scope.stations.push({'name': station.name, 'abbr': station.abbr});

        // save to local storage, and refresh back to config page.
        localStorageService.add('stations',$scope.stations);
        $location.path('arrivals');
    }

    //
    // load arrival times... part 2
    //
    // If I call $scope.loadETD() from the resume event (above), angular seems to be making a copy of $scope. The function runs on
    // resume, but the view is never updated. If I call it this way, with a local function, it works fine, presumably because I'm 
    // not passing a copy of $scope to an anonymous function.
    //
    loadStationETD = function() {

        // check whether we were passed a station (e.g. #/stations/19th), and either display just
        // that station, or load all stations from local storage. Also set a flag so the interface
        // can react appropriately depending on whether we have one or multiple stations.
        if ( $scope.station ) {
            $scope.stations = [{ abbr: $routeParams.station}];
            $scope.singleStationView = true;
        } else {
            $scope.stations = localStorageService.get('stations');
            $scope.singleStationView = false;
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

            // convert the data from BART to an object with station abbrs as keys; makes
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

            // convert the data from BART to an object with station abbrs as keys; makes
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
                if ($scope.stations[idx].abbr == station.abbr) {
                    $scope.stations.splice(idx,1);
                }
            }

            $scope.stations.push({'name': station.name, 'abbr': station.abbr});

            // save to local storage, and refresh back to config page.
            localStorageService.add('stations',$scope.stations);
            $location.path('config');
        }
    }

}]);
