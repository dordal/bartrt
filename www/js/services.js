/*
 * BartRT - services.js
 *
 * David Ordal - david -at- ordal.com
 * 
 */

angular.module('bartRT.services', [])


.factory('helloWorldFromFactory', [function() {
    return {
        sayHello: function() {
            return "Hello, World!"
        }
    };
}])

//
// bartApi Service
//
.factory('bartApi', ['$http', function($http) {
    return {

        //
        // Get a station object and load the ETD data from
        // the BART API, and then parses it into an array.
        // 
        // @param station an abbreviation for a BART station, e.g. 12TH
        //
        getETD: function(station) {
            $http.get('/test/bart/' + station.abbreviation + '.xml').success(function(data) {

                x2js = new X2JS();
                bartData = x2js.xml_str2json( data ).root;

                // assign basic station data
                station.name = bartData.station.name;
                station.abbreviation = bartData.station.abbr;
                station.etd = new Array();

                // X2JS will return a single ETD result as an object, not an array. We
                // need to convert it so the rest of our code (which assumes an array)
                // will work.
                if (!Array.isArray(bartData.station.etd)) {
                    bartData.station.etd = new Array(bartData.station.etd);
                }

                // assign ETD data
                for (e in bartData.station.etd) {

                    var etd = new Array();
                    etd.name = bartData.station.etd[e].destination;
                    etd.abbreviation = bartData.station.etd[e].abbreviation;
                    etd.trains = new Array();

                    // same problem as above; do another array conversion
                    if (!Array.isArray(bartData.station.etd[e].estimate)) {
                        bartData.station.etd[e].estimate = new Array(bartData.station.etd[e].estimate);
                    }
                    for (i in bartData.station.etd[e].estimate) {
                        var train = new Array();
                        train.minutes = bartData.station.etd[e].estimate[i].minutes;
                        train.length = bartData.station.etd[e].estimate[i].length;

                        etd.trains.push(train);
                    }

                    station.etd.push(etd);
                }
            });
        }
    };
}]);