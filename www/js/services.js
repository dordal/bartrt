/*
 * BartRT - services.js
 *
 * David Ordal - david -at- ordal.com
 * 
 */

BartRT.factory('helloWorldFromFactory', ['$http', function($http) {
    return {

    	// NOTES: we pass the $http service through here as a dependency to the helloWorldFromFactory
    	// service, and can then use it in the getPage call

    	getPage: function() {
    		$http.get('/test/bart/EMBR.xml').success(function(data) {
    			debugger;
    			return data;
    		});
    	},

        sayHello: function() {
            return "Hello, World!"
        }
    };
}]);

BartRT.factory('bartApi', ['$http', function($http) {
    return {

        //
        // getETD: this function takes a station name and loads the ETD data from
        // the BART API, and then parses it into an array.
        //
        getETD: function(station) {
            $http.get('/test/bart/EMBR.xml').success(function(data) {
                debugger;
                return data;
            });
        },

    };
}]);