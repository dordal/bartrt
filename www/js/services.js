/*
 * BartRT - services.js
 *
 * David Ordal - david -at- ordal.com
 * 
 */

//
// bartApi Service
//
BartRT.factory('bartApi', ['$http', '$q', 'bartApiKey', function($http, $q, bartApiKey) {
    return {

        //
        // Get a station object and load the ETD data from
        // the BART API, and then parses it into an array.
        // 
        // @param station an abbreviation for a BART station, e.g. 12TH
        //
        getETD: function(station, idx) {

            station.loaded = false;

            var response = $q.defer();

            // $http.get('/test/bart/' + station.abbreviation + '.xml')
            $http.get('http://api.bart.gov/api/etd.aspx?cmd=etd&key=' + bartApiKey + '&orig=' + station.abbreviation )
            .success(function(data, status, headers, config) {

                x2js = new X2JS();
                bartData = x2js.xml_str2json( data ).root;

                // assign basic station data
                station.name = bartData.station.name;
                station.abbreviation = bartData.station.abbr;
                station.idx = idx;  // index in the stations array
                station.etd = new Array();

                // X2JS will return a single ETD result as an object, not an array. We
                // need to convert it so the rest of our code (which assumes an array)
                // will work.
                if (typeof bartData.station.etd !== 'undefined' && !Array.isArray(bartData.station.etd)) {
                    bartData.station.etd = new Array(bartData.station.etd);
                }

                // assign ETD data
                for (e in bartData.station.etd) {

                    var etd = new Array();
                    etd.name = bartData.station.etd[e].destination;
                    etd.abbreviation = bartData.station.etd[e].abbreviation;
                    etd.trains = new Array();

                    // same problem as above; do another array conversion
                    if (typeof bartData.station.etd[e].estimate !== 'undefined' && !Array.isArray(bartData.station.etd[e].estimate)) {
                        bartData.station.etd[e].estimate = new Array(bartData.station.etd[e].estimate);
                    }
                    for (i in bartData.station.etd[e].estimate) {
                        var train = new Array();
                        train.minutes = bartData.station.etd[e].estimate[i].minutes;
                        train.minutes = train.minutes.replace('Leaving','Now');
                        train.length = bartData.station.etd[e].estimate[i].length;

                        etd.trains.push(train);

                        // color is a little funny. At a station like Hayward, you could (theoretically) have
                        // both a green train and an orange train headed for Fremont, if you were running during
                        // commute hours. For now, we ignore that and take the color of the last train we see, but
                        // we may need to improve this in the future.
                        etd.color = bartData.station.etd[e].estimate[i].color.toLowerCase();
                    }

                    station.etd.push(etd);
                }

                station.loaded = true;

                response.resolve(station);

            })
            .error(function(data, status, headers, config) {
                alert('Unable to load data for ' + station.abbreviation);
                response.reject('error');
            });

            return response.promise;
        },

        //
        // Load a list of stations from the BART API
        //
        getStations: function() {

            var response = $q.defer();

            // $http.get('/test/bart/stations.xml')
            $http.get('http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + bartApiKey )
            .success(function(data, status, headers, config) {

                x2js = new X2JS();
                bartData = x2js.xml_str2json( data ).root;
                response.resolve(bartData.stations.station);

            })
            .error(function(data, status, headers, config) {
                alert('Unable to load station list');
                response.reject('error');
            });

            return response.promise;

        }
    };
}]);