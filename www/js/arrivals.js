function ArrivalsCtrl($scope, $http, $http) {
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


  $scope.loadData = function() {
     delete $http.defaults.headers.common['X-Requested-With'];
     $http.defaults.headers.put['Access-Control-Allow-Credentials']='true'
     $http.get('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=FRMT&key=MW9S-E7SL-26DU-VV8V').success(function(data) {
        bartData = xmlToJson(data).root;

        $scope.stations[0].name = bartData.station.name;
        $scope.stations[0].abbreviation = bartData.station.abbr;

        $scope.stations[0].etd = new Array();   

        if (typeof(bartData.station.etd) == 'object') {
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

            $scope.stations[0].etd.push(etd);
        }

        
     });
  }
 /*
  $scope.addTodo = function() {
    $scope.todos.push({text:$scope.todoText, done:false});
    $scope.todoText = '';
  };
 
  $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.todos, function(todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };
 
  $scope.archive = function() {
    var oldTodos = $scope.todos;
    $scope.todos = [];
    angular.forEach(oldTodos, function(todo) {
      if (!todo.done) $scope.todos.push(todo);
    });
  };
  */
}

function xmlToJson(xml) {
 var x2js = new X2JS();
 var json = x2js.xml_str2json( xml );
 return json;
}