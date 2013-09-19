/*
 * BartRT - controllers.js
 *
 * David Ordal - david -at- ordal.com
 * 
 */

//
// Arrivals Controller
//
function ArrivalsCtrl($scope, $http, $http) {

  	// TODO: On load of the page fragment, populate the data out of local browser storage (via a JSON object). 
  	// This should contain a list of station abbreviations & names for the stations that we want to get data for 
  	// (rather than the current hard-coded list).

  	// Data format for a given station:

  	// {
    //      name: '12th St. Oakland City Center',
    //      abbreviation: '12th',
    //      etd: [{
    //          name: 'Embarcadero',
    //          abbreviation: 'EMCD',
    //          trains: [{
    //              minutes: 2,
    //              length: 6
    //          }, {
    //              minutes: 12,
    //              length: 10
    //          }]
    //      }, {
    //          name: 'Richmond',
    //          abbreviation: 'RICH',
    //          trains: [{
    //              minutes: 7,
    //              length: 5
    //          }, {
    //              minutes: 14,
    //              length: 9
    //          }]
    //      },
    //      ]
    //  }

    $scope.stations = [{
        name: '12th St. Oakland City Center',
        abbreviation: '12TH'
    }, {
        name: 'Embarcadero',
        abbreviation: 'EMBR'
    }, {
        name: 'Orinda',
        abbreviation: 'ORIN',
    }];

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

*/

  $scope.loadData = function() {

    // make an API call and parse the data
    function parseData(idx) {
        $http.get('/test/bart/' + $scope.stations[idx].abbreviation + '.xml').success(function(data) {

            x2js = new X2JS();
            bartData = x2js.xml_str2json( data ).root;

            $scope.stations[idx].name = bartData.station.name;
            $scope.stations[idx].abbreviation = bartData.station.abbr;

            // clear the ETD times; we're about to reload them
            $scope.stations[idx].etd = new Array();   

            // X2JS will return a single ETD result as an object, not an array. We
            // need to convert it so the rest of our code (which assumes an array)
            // will work.
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

                $scope.stations[idx].etd.push(etd);
            }
        });
    }

    delete $http.defaults.headers.common['X-Requested-With'];
 	$http.defaults.headers.put['Access-Control-Allow-Credentials']='true'
	// http://api.bart.gov/api/etd.aspx?cmd=etd&orig=FRMT&key=MW9S-E7SL-26DU-VV8V

    // iterate through each station in the list, and load data for it
	for (var idx=0; idx< $scope.stations.length; idx++) {
            // we have to call a separate function so that we can limit scope and make sure 
            // the array index (idx) doesn't change while we're waiting for the HTTP call
            // to return.
            parseData(idx);
    }
  }
}


//
// Config Controller
//
function ConfigCtrl($scope, helloWorldFromFactory) {

    var foobar = helloWorldFromFactory.getPage();
    debugger;
    $scope.myHelloVar = foobar;

}