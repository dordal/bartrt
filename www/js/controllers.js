function ArrivalsCtrl($scope) {
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
                length: 7
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

function ConfigCtrl($scope) {

    
}

